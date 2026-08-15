import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import type { AddressInfo } from 'node:net';
import type { AstroIntegration } from 'astro';
import puppeteer from 'puppeteer';

const MIME: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.md': 'text/markdown',
};

/**
 * Serves `root` over loopback. The page needs a real origin — its font URLs are
 * absolute (/fonts/...), which file:// resolves against the filesystem root.
 */
async function serveDir(root: string) {
  const server = createServer(async (req, res) => {
    const path = decodeURIComponent((req.url ?? '/').split('?')[0]!);
    // normalize() collapses any ../ before it can escape root.
    const rel = normalize(path).replace(/^(\.\.[/\\])+/, '');
    const file = join(root, rel.endsWith('/') ? `${rel}index.html` : rel);

    try {
      const body = await readFile(file);
      res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });

  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;

  return {
    origin: `http://127.0.0.1:${port}`,
    close: () => new Promise<void>((resolve) => server.close(() => resolve())),
  };
}

interface Options {
  /** Route to print. */
  page?: string;
  /** Output filename, relative to the build dir. */
  output?: string;
}

/**
 * Prints a built page to PDF after the static build.
 *
 * The PDF is the page's own @media print rules rendered by Chrome — the
 * stylesheet in src/styles/markdown.css is the only place the design lives.
 */
export default function resumePdf({ page = '/', output = 'resume.pdf' }: Options = {}): AstroIntegration {
  return {
    name: 'resume-pdf',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = dir.pathname;
        const server = await serveDir(root);
        const browser = await puppeteer.launch({
          // CI containers often lack the kernel permissions the sandbox needs.
          // We only ever load our own build output over loopback.
          args: process.env.CI ? ['--no-sandbox'] : [],
        });

        try {
          const tab = await browser.newPage();
          await tab.goto(`${server.origin}${page}`, { waitUntil: 'networkidle0' });
          // Belt and braces: networkidle0 covers the font requests, but layout
          // shifts if a face lands late, which would shuffle the page breaks.
          await tab.evaluateHandle('document.fonts.ready');

          await tab.pdf({
            path: join(root, output),
            format: 'letter',
            printBackground: false,
            margin: { top: '0.7in', bottom: '0.7in', left: '0.75in', right: '0.75in' },
          });

          logger.info(`Printed ${page} to ${output}`);
        } finally {
          await browser.close();
          await server.close();
        }
      },
    },
  };
}
