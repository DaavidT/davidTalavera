import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// SVG template for OG image
const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#E31937;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#B8152B;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#gradient)"/>
  <text x="60" y="240" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="white" letter-spacing="-2">David Talavera</text>
  <text x="60" y="320" font-family="Arial, sans-serif" font-size="48" font-weight="300" fill="white" opacity="0.95">Solutions Architect &amp; Full-Stack Developer</text>
  <text x="60" y="390" font-family="Arial, sans-serif" font-size="28" fill="white" opacity="0.8">Business automation, analytics, applied AI</text>
  <text x="60" y="560" font-family="Arial, sans-serif" font-size="24" fill="white" opacity="0.7">davidtalavera.com</text>
</svg>`;

const outputPath = path.join(process.cwd(), 'public', 'og-image.png');

// Create public directory if it doesn't exist
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate PNG from SVG
sharp(Buffer.from(svg))
  .png()
  .toFile(outputPath)
  .then((info) => {
    console.log(`✅ OG image generated: ${outputPath}`);
    console.log(`   Size: ${info.width}x${info.height}px (${(info.size / 1024).toFixed(2)}KB)`);
  })
  .catch((err) => {
    console.error('❌ Error generating OG image:', err);
    process.exit(1);
  });
