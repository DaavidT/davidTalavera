import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const images = [
  { input: 'public/central.png', output: 'public/central.webp' },
  { input: 'public/hir-seguros.png', output: 'public/hir-seguros.webp' }
];

async function compressAll() {
  for (const img of images) {
    try {
      const info = await sharp(img.input)
        .webp({ quality: 80 })
        .toFile(img.output);
      
      const origSize = fs.statSync(img.input).size;
      const compSize = info.size;
      const savings = ((origSize - compSize) / origSize * 100).toFixed(2);
      
      console.log(`✅ ${path.basename(img.input)} → ${path.basename(img.output)}`);
      console.log(`   Original: ${(origSize / 1024).toFixed(1)} KB`);
      console.log(`   Compressed: ${(compSize / 1024).toFixed(1)} KB`);
      console.log(`   Savings: ${savings}%\n`);
    } catch (e) {
      console.error(`❌ Error: ${img.input}`, e.message);
    }
  }
}

compressAll();
