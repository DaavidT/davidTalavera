import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputPath = path.join(process.cwd(), 'public', 'innovacion.png');
const outputPath = path.join(process.cwd(), 'public', 'innovacion.webp');

sharp(inputPath)
  .webp({ quality: 80 })
  .toFile(outputPath)
  .then((info) => {
    const originalSize = fs.statSync(inputPath).size;
    const compressedSize = info.size;
    const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);
    
    console.log(`✅ Image compressed successfully`);
    console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Compressed: ${(compressedSize / 1024).toFixed(2)} KB`);
    console.log(`   Savings: ${savings}% (${((originalSize - compressedSize) / 1024).toFixed(0)} KB)`);
    console.log(`   Output: ${outputPath}`);
  })
  .catch((err) => {
    console.error('❌ Error compressing image:', err);
    process.exit(1);
  });
