import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';

// Fonts are read once per build process and cached in module scope.
let _fontBold: Buffer | null = null;
let _fontMono: Buffer | null = null;

function fonts() {
  if (!_fontBold) {
    _fontBold = readFileSync(
      join(process.cwd(), 'node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff'),
    );
  }
  if (!_fontMono) {
    _fontMono = readFileSync(
      join(process.cwd(), 'node_modules/@fontsource/space-mono/files/space-mono-latin-400-normal.woff'),
    );
  }
  return { bold: _fontBold, mono: _fontMono };
}

function titleSize(title: string): number {
  const l = title.length;
  if (l > 55) return 44;
  if (l > 38) return 54;
  if (l > 22) return 64;
  return 72;
}

export interface OGParams {
  title: string;
  eyebrow?: string;
  date?: string;
}

const INK = '#0a0a0a';
const PAPER = '#fafaf7';
const FAINT = 'rgba(10,10,10,0.45)';

// Build a satori-compatible element tree (plain objects, no JSX needed).
function buildTree({ title, eyebrow, date }: OGParams) {
  const eyebrowEl = eyebrow
    ? {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            fontFamily: 'Space Mono',
            fontSize: 12,
            letterSpacing: '0.16em',
            color: FAINT,
            marginBottom: 24,
          },
          children: eyebrow.toUpperCase(),
        },
      }
    : null;

  const dateEl = date
    ? {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            fontFamily: 'Space Mono',
            fontSize: 13,
            letterSpacing: '0.14em',
            color: INK,
          },
          children: date,
        },
      }
    : { type: 'div', props: { style: { display: 'flex' }, children: '' } };

  return {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: PAPER,
      },
      children: [
        // Top rule
        {
          type: 'div',
          props: {
            style: { height: 6, background: INK, flexShrink: 0 },
            children: '',
          },
        },
        // Content
        {
          type: 'div',
          props: {
            style: {
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              padding: '60px 80px 52px',
            },
            children: [
              ...(eyebrowEl ? [eyebrowEl] : []),
              // Title — takes all remaining vertical space
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flex: 1,
                    fontFamily: 'Space Grotesk',
                    fontWeight: 700,
                    fontSize: titleSize(title),
                    color: INK,
                    lineHeight: 1.1,
                    alignItems: 'flex-start',
                  },
                  children: title,
                },
              },
              // Bottom rule
              {
                type: 'div',
                props: {
                  style: { height: 2, background: INK, flexShrink: 0, marginBottom: 20 },
                  children: '',
                },
              },
              // Footer: date left, branding right
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexShrink: 0,
                  },
                  children: [
                    dateEl,
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          fontFamily: 'Space Mono',
                          fontSize: 13,
                          letterSpacing: '0.14em',
                          color: FAINT,
                        },
                        children: 'DAO.BRUSSELS',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

export async function generateOGImage(params: OGParams): Promise<ArrayBuffer> {
  const { bold, mono } = fonts();

  const svg = await satori(buildTree(params), {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Space Grotesk', data: bold, weight: 700, style: 'normal' },
      { name: 'Space Mono', data: mono, weight: 400, style: 'normal' },
    ],
  });

  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return buf.buffer as ArrayBuffer;
}
