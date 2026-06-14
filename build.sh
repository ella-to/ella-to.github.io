#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/new-docs"

echo "==> Installing dependencies..."
cd "$ROOT"
pnpm install --frozen-lockfile

echo "==> Building Next.js app..."
pnpm build

echo "==> Assembling new-docs..."
rm -rf "$OUT"
cp -r "$ROOT/out" "$OUT"

echo "==> Generating vanity URL pages..."
node "$ROOT/scripts/generate-vanity.mjs" "$OUT"

echo "==> Copying CNAME..."
echo "ella.to" > "$OUT/CNAME"

echo ""
echo "Done. Output is in: $OUT"
echo "Preview with: npx serve $OUT"
