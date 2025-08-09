import { Pool, neonConfig } from '@neondatabase/serverless';
import sharp from 'sharp';
import ws from 'ws';

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

// Database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function fixPhotoOrientation() {
  console.log('Starting photo orientation fix process...');
  
  try {
    // Get all photos from database
    const result = await pool.query('SELECT id, image_data, filename, original_name FROM plant_photos');
    const photos = result.rows;
    
    console.log(`Found ${photos.length} photos to process for orientation fix`);
    
    let processedCount = 0;
    let fixedCount = 0;
    let errorCount = 0;
    
    for (const photo of photos) {
      try {
        console.log(`Processing photo ${photo.id}: ${photo.original_name || photo.filename}`);
        
        // Convert base64 to buffer
        const imageBuffer = Buffer.from(photo.image_data, 'base64');
        
        // Get image metadata to check orientation
        const image = sharp(imageBuffer);
        const metadata = await image.metadata();
        
        console.log(`  Current dimensions: ${metadata.width}x${metadata.height}px, orientation: ${metadata.orientation || 'undefined'}`);
        
        // Only process if there's an orientation issue (orientation property exists and isn't 1)
        if (!metadata.orientation || metadata.orientation === 1) {
          console.log(`  Skipping - no orientation correction needed`);
          processedCount++;
          continue;
        }
        
        // Fix orientation by auto-rotating and maintaining current size
        console.log(`  Fixing orientation (EXIF orientation: ${metadata.orientation})`);
        const fixedBuffer = await image
          .rotate() // Auto-rotate based on EXIF orientation
          .jpeg({ quality: 85 })
          .toBuffer();
        
        // Convert back to base64
        const fixedBase64 = fixedBuffer.toString('base64');
        
        // Update database with orientation-fixed image
        await pool.query(
          'UPDATE plant_photos SET image_data = $1, size = $2 WHERE id = $3',
          [fixedBase64, fixedBuffer.length, photo.id]
        );
        
        console.log(`  ✓ Orientation fixed. Size: ${fixedBuffer.length} bytes`);
        fixedCount++;
        processedCount++;
        
      } catch (error) {
        console.error(`  ✗ Error processing photo ${photo.id}:`, error.message);
        errorCount++;
        processedCount++;
      }
      
      // Add small delay to avoid overwhelming the database
      if (processedCount % 5 === 0) {
        console.log(`Progress: ${processedCount}/${photos.length} photos processed`);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log('\n=== Orientation Fix Process Complete ===');
    console.log(`Total photos processed: ${processedCount}`);
    console.log(`Photos with orientation fixed: ${fixedCount}`);
    console.log(`Photos skipped (no orientation issue): ${processedCount - fixedCount - errorCount}`);
    console.log(`Errors: ${errorCount}`);
    
  } catch (error) {
    console.error('Fatal error during photo orientation fix process:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the orientation fix process
fixPhotoOrientation().then(() => {
  console.log('Photo orientation fix process completed successfully');
  process.exit(0);
}).catch(error => {
  console.error('Photo orientation fix process failed:', error);
  process.exit(1);
});

export { fixPhotoOrientation };