#!/bin/bash

# TaskHub Desktop Build Helper Script
# This script helps prepare and build the electron desktop application

set -e

echo "================================"
echo "TaskHub Desktop App Builder"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Function to check icon files
check_icons() {
    echo "📁 Checking icon files..."
    local missing_icons=false
    
    if [ ! -f "assets/icon.svg" ]; then
        echo "⚠️  Missing: assets/icon.svg"
        missing_icons=true
    else
        echo "✅ Found: assets/icon.svg"
    fi
    
    if [ ! -f "assets/icon.png" ]; then
        echo "⚠️  Missing: assets/icon.png (needed for Linux)"
        missing_icons=true
    else
        echo "✅ Found: assets/icon.png"
    fi
    
    if [ ! -f "assets/icon.icns" ]; then
        echo "⚠️  Missing: assets/icon.icns (needed for macOS builds)"
        missing_icons=true
    else
        echo "✅ Found: assets/icon.icns"
    fi
    
    if [ ! -f "assets/icon.ico" ]; then
        echo "⚠️  Missing: assets/icon.ico (needed for Windows builds)"
        missing_icons=true
    else
        echo "✅ Found: assets/icon.ico"
    fi
    
    echo ""
    
    if [ "$missing_icons" = true ]; then
        echo "📌 To generate icons, use one of these tools:"
        echo "   1. Online: https://icoconvert.com (for .ico)"
        echo "   2. Online: https://cloudconvert.com (for .icns)"
        echo "   3. Command line: convert assets/icon.svg -resize 512x512 assets/icon.png"
        echo ""
        echo "⚠️  Note: Builds may fail without proper icon files"
        echo ""
    fi
}

# Function to install dependencies
install_deps() {
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
}

# Function to build for macOS
build_mac() {
    echo "🍎 Building for macOS (DMG)..."
    check_icons
    npm run build:mac
    echo "✅ macOS build complete!"
    echo "📦 Output: dist/TaskHub-*.dmg"
    echo ""
}

# Function to build for Windows
build_windows() {
    echo "🪟 Building for Windows (EXE)..."
    check_icons
    npm run build:windows
    echo "✅ Windows build complete!"
    echo "📦 Output: dist/TaskHub Setup *.exe"
    echo ""
}

# Main menu
if [ $# -eq 0 ]; then
    echo "Select an option:"
    echo "1. Install dependencies"
    echo "2. Check icon files"
    echo "3. Build for macOS (DMG)"
    echo "4. Build for Windows (EXE)"
    echo "5. Build for all platforms (Mac & Windows)"
    echo "6. Development mode (with hot reload)"
    echo "7. View electron build guide"
    echo ""
    read -p "Enter choice (1-7): " choice
    
    case $choice in
        1) install_deps ;;
        2) check_icons ;;
        3) build_mac ;;
        4) build_windows ;;
        5) 
            echo "🔨 Building for all platforms..."
            check_icons
            npm run build:all
            echo "✅ All builds complete!"
            echo ""
            ;;
        6)
            echo "🎯 Starting development mode..."
            echo "This will start Next.js dev server and Electron app with hot reload"
            echo ""
            npm run electron-dev
            ;;
        7) cat ELECTRON_BUILD_GUIDE.md ;;
        *) echo "Invalid choice" ;;
    esac
else
    # Handle command line arguments
    case "$1" in
        install) install_deps ;;
        icons) check_icons ;;
        build:mac) build_mac ;;
        build:windows) build_windows ;;
        build:all)
            echo "🔨 Building for all platforms..."
            check_icons
            npm run build:all
            echo "✅ All builds complete!"
            ;;
        dev) npm run electron-dev ;;
        guide) cat ELECTRON_BUILD_GUIDE.md ;;
        help)
            echo "Usage: ./build.sh [command]"
            echo ""
            echo "Commands:"
            echo "  install      - Install dependencies"
            echo "  icons        - Check icon files"
            echo "  build:mac    - Build for macOS"
            echo "  build:windows - Build for Windows"
            echo "  build:all    - Build for all platforms"
            echo "  dev          - Start development mode"
            echo "  guide        - Show electron build guide"
            echo "  help         - Show this help message"
            ;;
        *)
            echo "Unknown command: $1"
            echo "Run './build.sh help' for usage information"
            ;;
    esac
fi

echo "Done! 🎉"
