#!/bin/bash

# Build TypeScript files
npx tsc -p tsconfig.electron.json

# Move compiled files
mv electron/*.js out/electron/ 2>/dev/null || mkdir -p out/electron && mv electron/*.js out/electron/

echo "Electron files compiled successfully"
