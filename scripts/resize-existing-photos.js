import { Pool, neonConfig } from '@neondatabase/serverless';
import sharp from 'sharp';
import ws from 'ws';

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

// Database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function resizeExistingPhotos() {
  console.log('Starting photo resize process...');
  
  try {
    // Get all photos from database
    const result = await pool.query('SELECT id, image_data, filename, original_name FROM plant_photos');
    const photos = result.rows;
    
    console.log(`Found ${photos.length} photos to process`);
    
    let processedCount = 0;
    let resizedCount = 0;
    let errorCount = 0;
    
    for (const photo of photos) {
      try {
        console.log(`Processing photo ${photo.id}: ${photo.original_name || photo.filename}`);
        
        // Convert base64 to buffer
        const imageBuffer = Buffer.from(photo.image_data, 'base64');
        
        // Get image metadata
        const image = sharp(imageBuffer);
        const metadata = await image.metadata();
        
        console.log(`  Original dimensions: ${metadata.width}x${metadata.height}px`);
        
        // Skip if already 1000px wide or less
        if (!metadata.width || metadata.width <= 1000) {
          console.log(`  Skipping - already optimal size (${metadata.width}px wide)`);
          processedCount++;
          continue;
        }
        
        // Resize image with proper orientation handling
        console.log(`  Resizing from ${metadata.width}px to 1000px width`);
        const resizedBuffer = await image
          .rotate() // Auto-rotate based on EXIF orientation
          .resize(1000, null, { 
            withoutEnlargement: true,
            fit: 'inside'
          })
          .jpeg({ quality: 85 })
          .toBuffer();
        
        // Convert back to base64
        const resizedBase64 = resizedBuffer.toString('base64');
        
        // Update database with resized image
        await pool.query(
          'UPDATE plant_photos SET image_data = $1, size = $2 WHERE id = $3',
          [resizedBase64, resizedBuffer.length, photo.id]
        );
        
        console.log(`  ✓ Resized successfully. Original: ${imageBuffer.length} bytes, New: ${resizedBuffer.length} bytes`);
        resizedCount++;
        processedCount++;
        
      } catch (error) {
        console.error(`  ✗ Error processing photo ${photo.id}:`, error.message);
        errorCount++;
        processedCount++;
      }
      
      // Add small delay to avoid overwhelming the database
      if (processedCount % 10 === 0) {
        console.log(`Progress: ${processedCount}/${photos.length} photos processed`);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log('\n=== Resize Process Complete ===');
    console.log(`Total photos processed: ${processedCount}`);
    console.log(`Photos resized: ${resizedCount}`);
    console.log(`Photos skipped (already optimal): ${processedCount - resizedCount - errorCount}`);
    console.log(`Errors: ${errorCount}`);
    
  } catch (error) {
    console.error('Fatal error during photo resize process:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the resize process
resizeExistingPhotos().then(() => {
  console.log('Photo resize process completed successfully');
  process.exit(0);
}).catch(error => {
  console.error('Photo resize process failed:', error);
  process.exit(1);
});

export { resizeExistingPhotos };