import sharp from "sharp";
import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// --- Master monogram (deep near-black squircle, white twin-P) ---------------
const monoPath = `M72 52 L72 200 M72 52 A44 44 0 0 1 72 140 M138 52 L138 200 M138 52 A44 44 0 0 1 138 140`;
const STROKE = 26;

const iconSvg = (rx = 56, bg = "#060606") => `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="256" height="256" rx="${rx}" fill="${bg}"/>
  <path d="${monoPath}" stroke="#ffffff" stroke-width="${STROKE}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`;

const render = (svg, size) =>
  sharp(Buffer.from(svg)).resize(size, size, { fit: "contain" }).png().toBuffer();

// --- ICO assembler (PNG-in-ICO, supported by all modern browsers) -----------
function buildIco(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);
  const entries = [];
  const datas = [];
  let offset = 6 + count * 16;
  for (const { size, buf } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(buf.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += buf.length;
    entries.push(e);
    datas.push(buf);
  }
  return Buffer.concat([header, ...entries, ...datas]);
}

// --- Open Graph card (1200x630) ---------------------------------------------
const ogSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#060606"/>
  <g transform="translate(96 96) scale(0.7)">
    <rect width="256" height="256" rx="56" fill="#0d0d0f"/>
    <path d="${monoPath}" stroke="#ffffff" stroke-width="${STROKE}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>
  <text x="96" y="404" font-family="Helvetica, Arial, sans-serif" font-size="64" font-weight="700" letter-spacing="-2" fill="#f4f4f5">Pinkman Protects</text>
  <text x="98" y="456" font-family="Helvetica, Arial, sans-serif" font-size="28" font-weight="400" fill="#a1a1aa">Security awareness, handled.</text>
  <text x="98" y="556" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="500" fill="#3ecf8e">Ethical phishing simulations &#183; Human risk, measured</text>
</svg>`;

async function main() {
  const sizes = [16, 32, 48, 64, 128, 256];
  const images = [];
  for (const s of sizes) images.push({ size: s, buf: await render(iconSvg(Math.round(56 * (s / 256)) || 1), s) });

  writeFileSync(join(root, "src/app/favicon.ico"), buildIco(images));

  // Apple touch icon — Apple ignores transparency, slightly larger radius tile
  await sharp(Buffer.from(iconSvg(56))).resize(180, 180).png().toFile(join(root, "src/app/apple-icon.png"));

  // OG card
  mkdirSync(join(root, "public"), { recursive: true });
  await sharp(Buffer.from(ogSvg)).png().toFile(join(root, "public/og.png"));

  // Previews for review
  mkdirSync(join(root, ".brand-preview"), { recursive: true });
  for (const s of [16, 32, 64, 256]) {
    await sharp(Buffer.from(iconSvg(Math.round(56 * (s / 256)) || 1))).resize(s, s).png().toFile(join(root, `.brand-preview/icon-${s}.png`));
  }
  await sharp(Buffer.from(ogSvg)).png().toFile(join(root, ".brand-preview/og.png"));
  // Zoomed 16px to eyeball small-size legibility
  await sharp(await render(iconSvg(4), 16)).resize(256, 256, { kernel: "nearest" }).png().toFile(join(root, ".brand-preview/icon-16-zoom.png"));

  console.log("Brand assets generated.");
}

main().catch((e) => { console.error(e); process.exit(1); });
