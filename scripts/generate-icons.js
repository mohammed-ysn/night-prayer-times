import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const iconsDir = join(__dirname, '../static/icons');

const sizes = [192, 512];

const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="64" fill="#1a1a2e"/>
  <defs>
    <mask id="moon-mask">
      <circle cx="256" cy="256" r="140" fill="white"/>
      <circle cx="310" cy="220" r="110" fill="black"/>
    </mask>
  </defs>
  <circle cx="256" cy="256" r="140" fill="#ffd700" mask="url(#moon-mask)"/>
</svg>`;

async function generateIcons() {
	for (const size of sizes) {
		await sharp(Buffer.from(svgIcon))
			.resize(size, size)
			.png()
			.toFile(join(iconsDir, `icon-${size}.png`));
		console.log(`Generated icon-${size}.png`);
	}
}

generateIcons().catch(console.error);
