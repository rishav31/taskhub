#!/bin/bash

# Compile TypeScript files in electron directory to JavaScript
npx tsc -p tsconfig.electron.json --outDir electron --declaration false

echo "✅ Electron TypeScript compiled to JavaScript"
