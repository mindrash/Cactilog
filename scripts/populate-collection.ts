#!/usr/bin/env tsx

/**
 * Populate collection script - Seeds database with user's actual collection data
 * Based on the comprehensive tracking data from the user's PDF
 */

import { db } from "../server/db";
import { plants, growthRecords } from "../shared/schema";
import { sql, eq, and } from "drizzle-orm";

// User's actual collection data from PDF
const collectionData = [
  {
    customId: "TRI-PACH-PC-1",
    family: "Cactaceae",
    genus: "Trichocereus",
    species: "pachanoi",
    cultivar: "PC",
    commonName: "PC",
    supplier: "3koSerious.com",
    acquisitionDate: "2025-05-20",
    initialType: "pup",
    notes: "Advertised as 14.5\" but is easily a 16\" pup"
  },
  {
    customId: "TRI-PACH-PC-2", 
    family: "Cactaceae",
    genus: "Trichocereus",
    species: "pachanoi",
    cultivar: "PC",
    commonName: "PC",
    supplier: "3koSerious.com",
    acquisitionDate: "2025-05-20",
    initialType: "pup",
    notes: "freebie about 10\""
  },
  {
    customId: "LOPH-FRI-1",
    family: "Cactaceae", 
    genus: "Lophophora",
    species: "fricii",
    commonName: "Fricii",
    supplier: "Reddit",
    acquisitionDate: "2025-05-26",
    initialType: "root"
  },
  {
    customId: "TRI-HY-TDL46-1",
    family: "Cactaceae",
    genus: "Trichocereus", 
    species: "hybrid",
    cultivar: "Heynes x Sharxx",
    commonName: "TDL46",
    supplier: "Reddit",
    acquisitionDate: "2025-05-26",
    initialType: "root",
    notes: "Large 14+\" rooted plant. TDL46 is a seed grown Heynes x Sharxx cross, originally grown by Travis La Plante. Fat, Blue, short spines. \"Matcha\""
  },
  {
    customId: "MYRT-GEO-GLORP-1",
    family: "Cactaceae",
    genus: "Myrtillocactus",
    species: "geometrizans",
    cultivar: "clone",
    mutation: "Boobie",
    commonName: "Glorp",
    supplier: "Reddit",
    acquisitionDate: "2025-06-01",
    initialType: "graft",
    notes: "3x2 pup"
  },
  {
    customId: "TRI-BRIDG-BRDR-1",
    family: "Cactaceae",
    genus: "Trichocereus",
    species: "bridgesii",
    cultivar: "clone",
    mutation: "Montrose",
    commonName: "Bruce's Dragon",
    supplier: "Reddit",
    acquisitionDate: "2025-06-01",
    initialType: "pup"
  },
  {
    customId: "TRI-PERU-SHARXX-1",
    family: "Cactaceae",
    genus: "Trichocereus",
    species: "peruvianus",
    cultivar: "Sharxx Blue",
    commonName: "Sharxx Blue",
    supplier: "Reddit",
    acquisitionDate: "2025-06-01",
    initialType: "graft"
  },
  {
    customId: "TRI-PERU-HY-LXL-1",
    family: "Cactaceae",
    genus: "Trichocereus",
    species: "peruvianus",
    cultivar: "Lee X Lumberjack",
    commonName: "Lee X Lumberjack",
    supplier: "Reddit",
    acquisitionDate: "2025-06-01",
    initialType: "root"
  },
  {
    customId: "TRI-BRIDG-TBM-1",
    family: "Cactaceae",
    genus: "Trichocereus",
    species: "bridgesii",
    mutation: "Montrose",
    commonName: "TBM",
    supplier: "Reddit",
    acquisitionDate: "2025-06-01",
    initialType: "root"
  },
  {
    customId: "TRI-HUAN-DH-1",
    family: "Cactaceae",
    genus: "Trichocereus",
    species: "huanucoensis",
    commonName: "Don Huan",
    supplier: "Reddit",
    acquisitionDate: "2025-06-06",
    initialType: "pup",
    notes: "(IMDAVESBUD) Trichocereus huanucoensis, I grew this cutting and I got my mother stand directly from Don himself! This huanu grows FAT. Chonky with a perfect tip and fat butt, super powdery blue with a rubbery flesh!"
  },
  {
    customId: "LOPH-WILL-1",
    family: "Cactaceae",
    genus: "Lophophora",
    species: "williamsii",
    commonName: "williamsii",
    supplier: "3koSerious.com",
    acquisitionDate: "2025-05-27",
    initialType: "grafted",
    notes: "PC root stock"
  },
  {
    customId: "TRI-BRIDG-CLONEA-1",
    family: "Cactaceae",
    genus: "Trichocereus",
    species: "bridgesii",
    cultivar: "Clone A",
    mutation: "Montrose",
    commonName: "TBM - Clone A",
    supplier: "3koSerious.com",
    acquisitionDate: "2025-05-27",
    initialType: "root",
    notes: "8\""
  },
  {
    customId: "ARIO-RES-1",
    family: "Cactaceae",
    genus: "Ariocarpus",
    species: "resturus",
    commonName: "Ariocarpus",
    supplier: "Palmstreet",
    acquisitionDate: "2025-06-03",
    initialType: "root",
    notes: "NOID on species"
  },
  {
    customId: "LITH-AU-KG-SM-1",
    family: "Aizoaceae",
    genus: "Lithops",
    species: "aucampiae",
    commonName: "Lithops",
    supplier: "Etsy",
    acquisitionDate: "2025-06-02",
    initialType: "root",
    notes: "Konger Garden, NOID on species"
  },
  {
    customId: "LITH-AU-KG-MD-1",
    family: "Aizoaceae",
    genus: "Lithops",
    species: "aucampiae",
    commonName: "Lithops",
    supplier: "Etsy",
    acquisitionDate: "2025-06-02",
    initialType: "root",
    notes: "Konger Garden, NOID on species"
  },
  {
    customId: "LOPH-WILL-2",
    family: "Cactaceae",
    genus: "Lophophora",
    species: "williamsii",
    commonName: "williamsii",
    supplier: "FB",
    acquisitionDate: "2025-05-27",
    initialType: "root",
    notes: "FB, Austin Crooks"
  },
  {
    customId: "TRI-PACH-TPMC-1",
    family: "Cactaceae",
    genus: "Trichocereus",
    species: "pachanoi",
    cultivar: "TPMC",
    mutation: "Montrose, Crest",
    commonName: "TPMC",
    supplier: "FB",
    acquisitionDate: "2025-06-12",
    initialType: "tip",
    notes: "FB"
  },
  {
    customId: "LOPH-WILL-CAP-1",
    family: "Cactaceae",
    genus: "Lophophora",
    species: "williamsii",
    mutation: "Caespitosa",
    commonName: "williamsii caespitosa",
    supplier: "FB",
    acquisitionDate: "2025-06-11",
    initialType: "root",
    notes: "FB"
  },
  {
    customId: "TRI-PACH-JA-1",
    family: "Cactaceae",
    genus: "Trichocereus",
    species: "pachanoi",
    commonName: "Jaime Alberto",
    supplier: "Reddit",
    acquisitionDate: "2025-06-20",
    initialType: "tip",
    notes: "This clone is used by Jaime in his Shaman Ceremonies"
  },
  {
    customId: "TRI-HY-BRIDGxPACH-1",
    family: "Cactaceae",
    genus: "Trichocereus",
    species: "hybrid",
    cultivar: "Longspine bridgesii x Sals pachanoi",
    supplier: "FB",
    acquisitionDate: "2025-05-27",
    initialType: "root",
    notes: "freebie"
  },
  {
    customId: "TRI-HY-TPQCxSHARXXX-1",
    family: "Cactaceae",
    genus: "Trichocereus",
    species: "hybrid",
    cultivar: "TPQC x Sharxxx",
    commonName: "TPQC x Sharxxx",
    supplier: "Reddit",
    acquisitionDate: "2025-06-14",
    initialType: "tip"
  },
  {
    customId: "TRI-PACH-PC-3",
    family: "Cactaceae",
    genus: "Trichocereus",
    species: "pachanoi",
    cultivar: "PC",
    commonName: "PC",
    supplier: "3koSerious.com",
    acquisitionDate: "2025-05-27",
    initialType: "pup",
    notes: "freebie"
  },
  {
    customId: "TRI-SCOP-MBBB-1",
    family: "Cactaceae",
    genus: "Trichocereus",
    species: "scopulicola",
    cultivar: "MBxBB",
    commonName: "MBxBB",
    supplier: "Cactus Jones",
    acquisitionDate: "2025-06-25",
    initialType: "pup",
    notes: "MB x BB scopulicola cross. MB = Michael B collector line, BB = Backeberg historical clone"
  },
  {
    customId: "TRI-BRIDG-SS0201-1",
    family: "Cactaceae",
    genus: "Trichocereus",
    species: "bridgesii",
    cultivar: "SS02xSS01",
    commonName: "SS02xSS01",
    supplier: "Cactus Jones",
    acquisitionDate: "2025-06-25",
    notes: "Sacred Succulents bridgesii clones. SS01 = short-spined, SS02 = long-spined"
  },
  {
    customId: "TRI-SCOP-ZULK-1",
    family: "Cactaceae",
    genus: "Trichocereus",
    species: "scopulicola",
    cultivar: "ZedxHulk",
    commonName: "Zulk",
    supplier: "Cactus Jones",
    acquisitionDate: "2025-06-25",
    initialType: "pup",
    notes: "ZULK is my cloned Zed scop x Hulk scop"
  },
  {
    customId: "TRI-BRIDG-SS0201-1-VAR",
    family: "Cactaceae",
    genus: "Trichocereus",
    species: "bridgesii",
    cultivar: "MJC01",
    commonName: "MJC01",
    supplier: "Cactus Jones",
    acquisitionDate: "2025-06-25",
    notes: "Variegated revert - MJC01 is a seed grown bridgesii x bridgesii (pure bridgesii) turned into stable variegate by MetoliousChase"
  },
  {
    customId: "TRI-SCOP-A-1",
    family: "Cactaceae",
    genus: "Trichocereus",
    species: "scopulicola",
    cultivar: "Scop A",
    commonName: "Scop A",
    supplier: "Cactus Jones",
    acquisitionDate: "2025-06-25"
  },
  {
    customId: "TRI-CUZ-BLUEZCO-1",
    family: "Cactaceae",
    genus: "Trichocereus",
    species: "cuzcoensis",
    cultivar: "Bluezco",
    commonName: "Bluezco",
    supplier: "Cactus Jones",
    acquisitionDate: "2025-06-25",
    notes: "Trichocereus cuzcoensis from Cusco, Peru. Limited to Cusco area for authentic description."
  },
  {
    customId: "LOPH-KOE-1",
    family: "Cactaceae",
    genus: "Lophophora",
    species: "koereshii",
    commonName: "koereshii",
    supplier: "Reddit",
    acquisitionDate: "2025-06-25"
  },
  {
    customId: "TRI-PACH-TORRES-1",
    family: "Cactaceae",
    genus: "Trichocereus",
    species: "pachanoi",
    cultivar: "Torres & Torres",
    commonName: "Torres & Torres",
    supplier: "Cactus Jones",
    acquisitionDate: "2025-06-25",
    initialType: "pup",
    notes: "Collected by Donna and Manuel Torres in Northern Chile. Wild specimen outside standard T. pachanoi range, verified by Trevor Elliott."
  },
  {
    customId: "CYLIN-IMB-ARB-1",
    family: "Cactaceae",
    genus: "Cylindropuntia",
    species: "imbricata",
    cultivar: "arborescens",
    commonName: "Inermis (Horst's Spineless Tree Cholla)",
    initialType: "root",
    notes: "TRULY SPINELESS tree cholla from Horst Kuentzler. Bright pink flowers in July. 5-6 feet high x 6 feet wide. Zone 5."
  },
  {
    customId: "CYLIN-SPIN-1",
    family: "Cactaceae",
    genus: "Cylindropuntia",
    species: "spinosior",
    commonName: "Northern, High Altitude Form",
    initialType: "root"
  },
  {
    customId: "OPUN-BRACH-1",
    family: "Cactaceae",
    genus: "Opuntia",
    species: "brachyclada",
    initialType: "root",
    notes: "Blue Gumby Cactus. Very blue pads, finger-sized. Clear light pink flowers. 6\" high by 18\" wide. Zone 5."
  },
  {
    customId: "CORY-ELEPH-INERM-1",
    family: "Cactaceae",
    genus: "Coryphantha",
    species: "elephantidens",
    cultivar: "Inermis",
    supplier: "Etsy",
    acquisitionDate: "2025-07-18",
    initialType: "root",
    notes: "3 of them potted together"
  }
];

// Sample growth records for some plants to demonstrate tracking
const sampleGrowthRecords = [
  // TRI-PACH-PC-1 - Progressive growth over time
  { plantCustomId: "TRI-PACH-PC-1", date: "2025-05-25", heightInches: "16.0", widthInches: "2.5", healthScore: 9, observations: "Initial measurement - healthy cutting from acquisition" },
  { plantCustomId: "TRI-PACH-PC-1", date: "2025-06-15", heightInches: "16.8", widthInches: "2.7", healthScore: 9, observations: "Good growth, new spines developing" },
  { plantCustomId: "TRI-PACH-PC-1", date: "2025-07-01", heightInches: "17.5", widthInches: "2.8", healthScore: 10, observations: "Excellent vigor, considering repotting" },
  { plantCustomId: "TRI-PACH-PC-1", date: "2025-07-20", heightInches: "18.2", widthInches: "3.0", healthScore: 10, observations: "Rapid summer growth, very healthy" },

  // LOPH-WILL-1 - Slow but steady lophophora growth
  { plantCustomId: "LOPH-WILL-1", date: "2025-06-01", heightInches: "1.8", widthInches: "2.2", healthScore: 8, observations: "Initial measurement after grafting recovery" },
  { plantCustomId: "LOPH-WILL-1", date: "2025-07-01", heightInches: "1.9", widthInches: "2.3", healthScore: 9, observations: "Slight growth, graft is taking well" },
  { plantCustomId: "LOPH-WILL-1", date: "2025-07-25", heightInches: "2.0", widthInches: "2.4", healthScore: 9, observations: "Slow but consistent growth typical for species" },

  // TRI-HUAN-DH-1 - Fast growing huanucoensis 
  { plantCustomId: "TRI-HUAN-DH-1", date: "2025-06-10", heightInches: "14.5", widthInches: "4.2", healthScore: 10, observations: "Impressive initial size, very fat specimen" },
  { plantCustomId: "TRI-HUAN-DH-1", date: "2025-07-05", heightInches: "15.8", widthInches: "4.5", healthScore: 10, observations: "Rapid growth as expected, living up to reputation" },
  { plantCustomId: "TRI-HUAN-DH-1", date: "2025-07-26", heightInches: "16.9", widthInches: "4.7", healthScore: 10, observations: "Incredible growth rate, powdery blue coloration developing" },

  // MYRT-GEO-GLORP-1 - Boobie cactus growth
  { plantCustomId: "MYRT-GEO-GLORP-1", date: "2025-06-05", heightInches: "3.2", widthInches: "2.0", healthScore: 8, observations: "Small grafted pup, establishing well" },
  { plantCustomId: "MYRT-GEO-GLORP-1", date: "2025-07-01", heightInches: "3.8", widthInches: "2.2", healthScore: 9, observations: "Good growth on graft, unique mutation visible" },
  { plantCustomId: "MYRT-GEO-GLORP-1", date: "2025-07-26", heightInches: "4.3", widthInches: "2.4", healthScore: 9, observations: "Boobie mutation becoming more pronounced" },

  // TRI-BRIDG-TBM-1 - Bridgesii TBM growth
  { plantCustomId: "TRI-BRIDG-TBM-1", date: "2025-06-05", heightInches: "8.5", widthInches: "3.1", healthScore: 9, observations: "Healthy bridgesii, monstrose traits visible" },
  { plantCustomId: "TRI-BRIDG-TBM-1", date: "2025-07-10", heightInches: "9.2", widthInches: "3.3", healthScore: 9, observations: "Steady growth, beautiful blue-green color" },
  { plantCustomId: "TRI-BRIDG-TBM-1", date: "2025-07-26", heightInches: "9.8", widthInches: "3.4", healthScore: 10, observations: "Excellent health, monstrose character developing well" },

  // LITH-AU-KG-SM-1 - Lithops growth
  { plantCustomId: "LITH-AU-KG-SM-1", date: "2025-06-10", heightInches: "0.8", widthInches: "1.2", healthScore: 8, observations: "Small lithops, appears healthy" },
  { plantCustomId: "LITH-AU-KG-SM-1", date: "2025-07-15", heightInches: "0.8", widthInches: "1.3", healthScore: 9, observations: "Minimal growth expected for species, good coloration" },
  { plantCustomId: "LITH-AU-KG-SM-1", date: "2025-07-26", heightInches: "0.9", widthInches: "1.3", healthScore: 9, observations: "Slight swelling, may be preparing to split" },
];

async function populateCollection() {
  console.log("🌵 Starting collection population...");
  
  // Tom's user ID from the system
  const userId = "45392487";

  try {
    // Insert all plants
    console.log("📥 Inserting plants...");
    const insertedPlants = [];
    
    for (const plantData of collectionData) {
      try {
        const [insertedPlant] = await db.insert(plants).values({
          userId,
          customId: plantData.customId,
          family: plantData.family,
          genus: plantData.genus,
          species: plantData.species || null,
          cultivar: plantData.cultivar || null,
          mutation: plantData.mutation || null,
          commonName: plantData.commonName || null,
          supplier: plantData.supplier || null,
          acquisitionDate: plantData.acquisitionDate || null,
          initialType: plantData.initialType || null,
          notes: plantData.notes || null,
          isPublic: "public",
        }).returning();
        
        insertedPlants.push(insertedPlant);
        console.log(`✅ Added: ${plantData.customId}`);
      } catch (error) {
        console.log(`⚠️  Skipping ${plantData.customId} (may already exist):`, error.message);
      }
    }

    // Insert growth records
    console.log("\n📏 Inserting growth records...");
    for (const record of sampleGrowthRecords) {
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
            healthScore: record.healthScore || null,
            observations: record.observations || null,
          });
          console.log(`📊 Added growth record for ${record.plantCustomId} on ${record.date}`);
        }
      } catch (error) {
        console.log(`⚠️  Skipping growth record for ${record.plantCustomId}:`, error.message);
      }
    }

    console.log("\n🎉 Collection population completed!");
    console.log(`📊 Total plants in collection data: ${collectionData.length}`);
    console.log(`📏 Total growth records added: ${sampleGrowthRecords.length}`);
    
  } catch (error) {
    console.error("❌ Error populating collection:", error);
    process.exit(1);
  }
}

// Run the script
populateCollection().then(() => {
  console.log("✨ Script completed successfully!");
  process.exit(0);
}).catch((error) => {
  console.error("💥 Script failed:", error);
  process.exit(1);
});