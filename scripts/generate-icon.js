const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const svgPath = path.resolve(__dirname, '../public/resource/img/tool.svg');
  const outDir = path.resolve(__dirname, '../public/icons');
  const logoPath = path.resolve(__dirname, '../public/logo.png');

  if (!fs.existsSync(svgPath)) {
    throw new Error('SVG source not found: ' + svgPath);
  }
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const svg = fs.readFileSync(svgPath);

  // Generate 96x96 favicon
  await sharp(svg)
    .resize(96, 96, { fit: 'cover' })
    .png()
    .toFile(path.join(outDir, 'favicon-96x96.png'));

  // Generate logo 512x512 used by some icon generators
  await sharp(svg)
    .resize(512, 512, { fit: 'cover' })
    .png()
    .toFile(logoPath);

  console.log('Generated icons:', {
    favicon96: path.join(outDir, 'favicon-96x96.png'),
    logo: logoPath,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});