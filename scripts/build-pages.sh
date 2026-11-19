#!/usr/bin/env bash
set -e

echo "Building Cloudflare Pages proxy bundle..."
mkdir -p dist
cp scripts/_worker.js dist/_worker.js
touch dist/index.html

if [ -d "public" ]; then
  cp -r public/* dist/ 2>/dev/null || true
fi

echo "Cloudflare Pages build successfully generated in dist/"
