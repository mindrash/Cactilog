import { Pool, neonConfig } from '@neondatabase/serverless';
import sharp from 'sharp';
import ws from 'ws';

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

// Database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function rotatePhotosClockwise() {
  console.log('Starting photo rotation process (90 degrees clockwise)...');
  
  try {
    // Get all photos from database
    const result = await pool.query('SELECT id, image_data, filename, original_name FROM plant_photos');
    const photos = result.rows;
    
    console.log(`Found ${photos.length} photos to rotate clockwise`);
    
    let processedCount = 0;
    let rotatedCount = 0;
    let errorCount = 0;
    
    for (const photo of photos) {
      try {
        console.log(`Processing photo ${photo.id}: ${photo.original_name || photo.filename}`);
        
        // Convert base64 to buffer
        const imageBuffer = Buffer.from(photo.image_data, 'base64');
        
        // Get current image metadata
        const image = sharp(imageBuffer);
        const metadata = await image.metadata();
        
        console.log(`  Current dimensions: ${metadata.width}x${metadata.height}px`);
        
        // Rotate 90 degrees clockwise
        console.log(`  Rotating 90 degrees clockwise`);
        const rotatedBuffer = await image
          .rotate(90) // 90 degrees clockwise
          .jpeg({ quality: 85 })
          .toBuffer();
        
        // Get new dimensions
        const rotatedImage = sharp(rotatedBuffer);
        const rotatedMetadata = await rotatedImage.metadata();
        console.log(`  New dimensions: ${rotatedMetadata.width}x${rotatedMetadata.height}px`);
        
        // Convert back to base64
        const rotatedBase64 = rotatedBuffer.toString('base64');
        
        // Update database with rotated image
        await pool.query(
          'UPDATE plant_photos SET image_data = $1, size = $2 WHERE id = $3',
          [rotatedBase64, rotatedBuffer.length, photo.id]
        );
        
        console.log(`  ✓ Rotated successfully. New size: ${rotatedBuffer.length} bytes`);
        rotatedCount++;
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
    
    console.log('\n=== Rotation Process Complete ===');
    console.log(`Total photos processed: ${processedCount}`);
    console.log(`Photos rotated: ${rotatedCount}`);
    console.log(`Errors: ${errorCount}`);
    
  } catch (error) {
    console.error('Fatal error during photo rotation process:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the rotation process
rotatePhotosClockwise().then(() => {
  console.log('Photo rotation process completed successfully');
  process.exit(0);
}).catch(error => {
  console.error('Photo rotation process failed:', error);
  process.exit(1);
});

export { rotatePhotosClockwise };