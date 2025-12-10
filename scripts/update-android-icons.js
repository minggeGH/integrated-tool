const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateIcons() {
  const projectRoot = path.resolve(__dirname, '..');
  const logoPath = path.join(projectRoot, 'public', 'logo.png');
  const resRoot = path.join(projectRoot, 'android', 'app', 'src', 'main', 'res');

  if (!fs.existsSync(logoPath)) {
    throw new Error('logo.png 未找到: ' + logoPath);
  }

  const densities = {
    mdpi: 48,
    hdpi: 72,
    xhdpi: 96,
    xxhdpi: 144,
    xxxhdpi: 192,
  };

  const outputs = [];

  for (const [density, size] of Object.entries(densities)) {
    const outDir = path.join(resRoot, `mipmap-${density}`);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const filenames = ['ic_launcher.png', 'ic_launcher_foreground.png', 'ic_launcher_round.png'];
    const ratio = 0.82;
    const contentSize = Math.round(size * ratio);
    const padLeft = Math.round((size - contentSize) / 2);
    const padTop = Math.round((size - contentSize) / 2);

    const base = await sharp({
      create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
    })
      .png()
      .toBuffer();

    const content = await sharp(logoPath)
      .resize(contentSize, contentSize, { fit: 'contain' })
      .png()
      .toBuffer();

    for (const name of filenames) {
      const outFile = path.join(outDir, name);
      await sharp(base)
        .composite([{ input: content, left: padLeft, top: padTop }])
        .png()
        .toFile(outFile);
      outputs.push(outFile);
    }
  }

  console.log('Android 图标已更新:');
  outputs.forEach((p) => console.log(' - ' + p));
}

generateIcons().catch((err) => {
  console.error(err);
  process.exit(1);
});