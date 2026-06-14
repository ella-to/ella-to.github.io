#!/usr/bin/env node
// Reads vanity.json and writes a go-import index.html for each package into <outputDir>/<pkg>/index.html

import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

const outputDir = resolve(process.argv[2] ?? 'new-docs');
const vanity = JSON.parse(readFileSync(new URL('../vanity.json', import.meta.url), 'utf-8'));
const { host, github_org, packages } = vanity;

for (const pkg of packages) {
  const name = pkg.name;
  const repoUrl = pkg.repo ?? `https://github.com/${github_org}/${name}`;
  const importPath = `${host}/${name}`;

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="go-import" content="${importPath} git ${repoUrl}.git" />
    <meta name="go-source" content="${importPath} ${repoUrl} ${repoUrl}/tree/main{/dir} ${repoUrl}/blob/main{/dir}/{file}#L{line}" />
    <meta http-equiv="refresh" content="0; url=https://pkg.go.dev/${importPath}" />
    <title>${importPath}</title>
  </head>
  <body>
    <p>Nothing to see here; <a href="https://pkg.go.dev/${importPath}">see the package on pkg.go.dev</a>.</p>
  </body>
</html>
`;

  const dir = join(outputDir, name);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  console.log(`  wrote ${dir}/index.html`);
}

console.log(`Done — generated ${packages.length} vanity pages into ${outputDir}`);
