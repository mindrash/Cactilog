#!/usr/bin/env tsx

/**
 * Populate additional growth records script - Adds more growth tracking data
 * Creates realistic progression data for better analytics visualization
 */

import { db } from "../server/db";
import { plants, growthRecords } from "../shared/schema";
import { eq, and } from "drizzle-orm";

// Additional growth records for comprehensive tracking
const additionalGrowthRecords = [
  // TRI-PACH-PC-2 - PC clone progression
  { plantCustomId: "TRI-PACH-PC-2", date: "2025-05-30", heightInches: "10.2", widthInches: "2.1", healthScore: 8, observations: "Small but healthy PC pup, establishing well" },
  { plantCustomId: "TRI-PACH-PC-2", date: "2025-06-20", heightInches: "11.0", widthInches: "2.3", healthScore: 9, observations: "Good growth, developing characteristic PC features" },
  { plantCustomId: "TRI-PACH-PC-2", date: "2025-07-25", heightInches: "12.1", widthInches: "2.5", healthScore: 9, observations: "Steady growth, typical PC vigor" },

  // TRI-HY-TDL46-1 - Heynes x Sharxx hybrid tracking
  { plantCustomId: "TRI-HY-TDL46-1", date: "2025-06-01", heightInches: "14.8", widthInches: "4.8", circumferenceInches: "15.1", healthScore: 10, observations: "Impressive initial size for TDL46, excellent blue coloration" },
  { plantCustomId: "TRI-HY-TDL46-1", date: "2025-07-01", heightInches: "16.2", widthInches: "5.1", circumferenceInches: "16.0", healthScore: 10, observations: "Rapid growth, classic 'Matcha' coloration developing" },
  { plantCustomId: "TRI-HY-TDL46-1", date: "2025-07-26", heightInches: "17.4", widthInches: "5.4", circumferenceInches: "17.0", healthScore: 10, observations: "Outstanding growth rate, fat and blue as expected" },

  // TRI-BRIDG-BRDR-1 - Bruce's Dragon monstrose
  { plantCustomId: "TRI-BRIDG-BRDR-1", date: "2025-06-05", heightInches: "6.8", widthInches: "3.2", healthScore: 9, observations: "Monstrose pup, unusual growth patterns visible" },
  { plantCustomId: "TRI-BRIDG-BRDR-1", date: "2025-07-10", heightInches: "7.5", widthInches: "3.6", healthScore: 9, observations: "Monstrose traits becoming more pronounced" },
  { plantCustomId: "TRI-BRIDG-BRDR-1", date: "2025-07-26", heightInches: "8.2", widthInches: "4.0", healthScore: 10, observations: "Beautiful monstrose development, classic Bruce's Dragon form" },

  // TRI-PERU-SHARXX-1 - Sharxx Blue tracking
  { plantCustomId: "TRI-PERU-SHARXX-1", date: "2025-06-05", heightInches: "4.5", widthInches: "2.8", healthScore: 8, observations: "Small grafted cutting, adapting well to graft" },
  { plantCustomId: "TRI-PERU-SHARXX-1", date: "2025-07-05", heightInches: "5.8", widthInches: "3.1", healthScore: 9, observations: "Good graft success, blue coloration emerging" },
  { plantCustomId: "TRI-PERU-SHARXX-1", date: "2025-07-26", heightInches: "6.9", widthInches: "3.4", healthScore: 9, observations: "Excellent Sharxx Blue characteristics developing" },

  // TRI-PERU-HY-LXL-1 - Lee X Lumberjack
  { plantCustomId: "TRI-PERU-HY-LXL-1", date: "2025-06-05", heightInches: "8.2", widthInches: "3.5", healthScore: 9, observations: "Rooted cutting, excellent vigor" },
  { plantCustomId: "TRI-PERU-HY-LXL-1", date: "2025-07-10", heightInches: "9.4", widthInches: "3.8", healthScore: 10, observations: "Rapid growth, hybrid vigor evident" },
  { plantCustomId: "TRI-PERU-HY-LXL-1", date: "2025-07-26", heightInches: "10.6", widthInches: "4.1", healthScore: 10, observations: "Outstanding growth rate for Lee X Lumberjack cross" },

  // LOPH-FRI-1 - Fricii slow growth
  { plantCustomId: "LOPH-FRI-1", date: "2025-06-01", heightInches: "1.5", widthInches: "2.0", healthScore: 8, observations: "Small fricii, establishing root system" },
  { plantCustomId: "LOPH-FRI-1", date: "2025-07-15", heightInches: "1.6", widthInches: "2.1", healthScore: 9, observations: "Minimal but steady growth, typical for species" },
  { plantCustomId: "LOPH-FRI-1", date: "2025-07-26", heightInches: "1.7", widthInches: "2.2", healthScore: 9, observations: "Healthy fricii development, slow but consistent" },

  // LOPH-WILL-2 - Second williamsii
  { plantCustomId: "LOPH-WILL-2", date: "2025-06-01", heightInches: "2.0", widthInches: "2.5", healthScore: 8, observations: "Rooted williamsii from Austin Crooks" },
  { plantCustomId: "LOPH-WILL-2", date: "2025-07-10", heightInches: "2.1", widthInches: "2.6", healthScore: 9, observations: "Good establishment, typical williamsii growth" },
  { plantCustomId: "LOPH-WILL-2", date: "2025-07-26", heightInches: "2.2", widthInches: "2.7", healthScore: 9, observations: "Steady progress, healthy root development" },

  // TRI-BRIDG-CLONEA-1 - Clone A TBM
  { plantCustomId: "TRI-BRIDG-CLONEA-1", date: "2025-06-01", heightInches: "8.2", widthInches: "3.0", healthScore: 9, observations: "8 inch Clone A from 3koSerious, excellent quality" },
  { plantCustomId: "TRI-BRIDG-CLONEA-1", date: "2025-07-15", heightInches: "9.1", widthInches: "3.3", healthScore: 10, observations: "Strong growth, classic Clone A characteristics" },
  { plantCustomId: "TRI-BRIDG-CLONEA-1", date: "2025-07-26", heightInches: "9.7", widthInches: "3.5", healthScore: 10, observations: "Excellent Clone A development, beautiful specimen" },

  // ARIO-RES-1 - Ariocarpus slow growth
  { plantCustomId: "ARIO-RES-1", date: "2025-06-10", heightInches: "1.8", widthInches: "2.8", healthScore: 8, observations: "NOID Ariocarpus, appears to be retusus" },
  { plantCustomId: "ARIO-RES-1", date: "2025-07-20", heightInches: "1.8", widthInches: "2.9", healthScore: 8, observations: "Minimal growth expected, good coloration" },
  { plantCustomId: "ARIO-RES-1", date: "2025-07-26", heightInches: "1.9", widthInches: "3.0", healthScore: 9, observations: "Slight growth, developing tubercles" },

  // TRI-PACH-TPMC-1 - TPMC crested/monstrose
  { plantCustomId: "TRI-PACH-TPMC-1", date: "2025-06-15", heightInches: "3.8", widthInches: "4.2", healthScore: 9, observations: "Unique TPMC tip, monstrose and crest features" },
  { plantCustomId: "TRI-PACH-TPMC-1", date: "2025-07-20", heightInches: "4.2", widthInches: "4.8", healthScore: 10, observations: "Excellent monstrose development" },
  { plantCustomId: "TRI-PACH-TPMC-1", date: "2025-07-26", heightInches: "4.5", widthInches: "5.1", healthScore: 10, observations: "Outstanding TPMC characteristics, rare mutation" },

  // TRI-PACH-JA-1 - Jaime Alberto ceremonial clone
  { plantCustomId: "TRI-PACH-JA-1", date: "2025-06-25", heightInches: "7.2", widthInches: "2.8", healthScore: 10, observations: "Sacred clone used in ceremonies, excellent provenance" },
  { plantCustomId: "TRI-PACH-JA-1", date: "2025-07-26", heightInches: "8.0", widthInches: "3.0", healthScore: 10, observations: "Rapid growth for tip cutting, ceremonial vigor" },

  // TRI-SCOP-MBBB-1 - MB x BB scopulicola cross
  { plantCustomId: "TRI-SCOP-MBBB-1", date: "2025-06-30", heightInches: "5.5", widthInches: "2.2", healthScore: 9, observations: "MB x BB cross from Cactus Jones, excellent genetics" },
  { plantCustomId: "TRI-SCOP-MBBB-1", date: "2025-07-26", heightInches: "6.2", widthInches: "2.4", healthScore: 10, observations: "Strong scopulicola characteristics, high-quality cross" },

  // TRI-SCOP-ZULK-1 - Zed x Hulk scopulicola
  { plantCustomId: "TRI-SCOP-ZULK-1", date: "2025-06-30", heightInches: "4.8", widthInches: "2.0", healthScore: 9, observations: "ZULK clone pup, Zed scop x Hulk scop cross" },
  { plantCustomId: "TRI-SCOP-ZULK-1", date: "2025-07-26", heightInches: "5.4", widthInches: "2.2", healthScore: 10, observations: "Excellent ZULK development, unique cross characteristics" },

  // TRI-CUZ-BLUEZCO-1 - Bluezco cuzcoensis
  { plantCustomId: "TRI-CUZ-BLUEZCO-1", date: "2025-06-30", heightInches: "6.8", widthInches: "2.5", healthScore: 10, observations: "Authentic Cusco cuzcoensis, beautiful blue coloration" },
  { plantCustomId: "TRI-CUZ-BLUEZCO-1", date: "2025-07-26", heightInches: "7.4", widthInches: "2.7", healthScore: 10, observations: "Outstanding Bluezco characteristics, true cuzcoensis" },

  // LOPH-KOE-1 - Koehresii tracking
  { plantCustomId: "LOPH-KOE-1", date: "2025-06-30", heightInches: "1.2", widthInches: "1.8", healthScore: 8, observations: "Small koehresii, rare species" },
  { plantCustomId: "LOPH-KOE-1", date: "2025-07-26", heightInches: "1.3", widthInches: "1.9", healthScore: 9, observations: "Slight growth, developing koehresii characteristics" },

  // TRI-PACH-TORRES-1 - Torres & Torres wild specimen
  { plantCustomId: "TRI-PACH-TORRES-1", date: "2025-06-30", heightInches: "8.5", widthInches: "3.2", healthScore: 10, observations: "Wild Chilean specimen, collected by Torres & Torres" },
  { plantCustomId: "TRI-PACH-TORRES-1", date: "2025-07-26", heightInches: "9.2", widthInches: "3.4", healthScore: 10, observations: "Excellent wild genetics, outside standard T. pachanoi range" },

  // Additional flowering status records
  { plantCustomId: "TRI-HUAN-DH-1", date: "2025-07-30", heightInches: "17.2", widthInches: "4.8", floweringStatus: "budding", healthScore: 10, observations: "First buds appearing! Incredible achievement for size" },
  { plantCustomId: "TRI-BRIDG-TBM-1", date: "2025-07-30", heightInches: "10.0", widthInches: "3.5", floweringStatus: "budding", healthScore: 10, observations: "TBM showing flower buds, excellent maturity" },
  { plantCustomId: "LOPH-WILL-1", date: "2025-07-30", heightInches: "2.1", widthInches: "2.5", floweringStatus: "blooming", healthScore: 10, observations: "Beautiful white/pink flowers, first bloom!" },
];

async function populateMoreGrowth() {
  console.log("🌱 Adding more growth records for comprehensive analytics...");
  
  // Tom's user ID from the system
  const userId = "45392487";

  try {
    let addedCount = 0;

    for (const record of additionalGrowthRecords) {
      try {
        // Find the plant by customId
        const [plant] = await db.select().from(plants).where(
          and(
            eq(plants.userId, userId),
            eq(plants.customId, record.plantCustomId)
          )
        );

        if (plant) {
          await db.insert(growthRecords).values({
            plantId: plant.id,
            date: record.date,
            heightInches: record.heightInches || null,
            widthInches: record.widthInches || null,
            circumferenceInches: record.circumferenceInches || null,
            offsetCount: record.offsetCount || null,
            healthScore: record.healthScore || null,
            floweringStatus: record.floweringStatus || null,
            observations: record.observations || null,
          });
          addedCount++;
          console.log(`📊 Added growth record for ${record.plantCustomId} on ${record.date}`);
        } else {
          console.log(`⚠️  Plant not found: ${record.plantCustomId}`);
        }
      } catch (error) {
        console.log(`⚠️  Skipping growth record for ${record.plantCustomId}:`, error.message);
      }
    }

    console.log(`\n🎉 Added ${addedCount} additional growth records!`);
    console.log("📈 Growth tracking analytics now have much richer data");
    
  } catch (error) {
    console.error("❌ Error adding growth records:", error);
    process.exit(1);
  }
}

// Run the script
populateMoreGrowth().then(() => {
  console.log("✨ Additional growth records script completed successfully!");
  process.exit(0);
}).catch((error) => {
  console.error("💥 Script failed:", error);
  process.exit(1);
});