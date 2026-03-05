@echo off
REM TaskHub Desktop Build Helper Script for Windows
REM This script helps prepare and build the electron desktop application

setlocal enabledelayedexpansion

echo ================================
echo TaskHub Desktop App Builder
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed. Please install Node.js 16+ first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo Node.js version: %NODE_VERSION%
echo npm version: %NPM_VERSION%
echo.

REM Function to check icon files
:check_icons
echo Checking icon files...
set missing=0

if not exist "assets\icon.svg" (
    echo Warning: Missing assets\icon.svg
    set missing=1
) else (
    echo OK: Found assets\icon.svg
)

if not exist "assets\icon.png" (
    echo Warning: Missing assets\icon.png
    set missing=1
) else (
    echo OK: Found assets\icon.png
)

if not exist "assets\icon.icns" (
    echo Warning: Missing assets\icon.icns ^(needed for macOS builds^)
    set missing=1
) else (
    echo OK: Found assets\icon.icns
)

if not exist "assets\icon.ico" (
    echo Warning: Missing assets\icon.ico ^(needed for Windows builds^)
    set missing=1
) else (
    echo OK: Found assets\icon.ico
)

echo.
if %missing% equ 1 (
    echo To generate icons, visit:
    echo   1. https://icoconvert.com ^(for .ico^)
    echo   2. https://cloudconvert.com ^(for .icns^)
    echo.
)
goto :eof

REM Function to install dependencies
:install_deps
echo Installing dependencies...
call npm install
echo Dependencies installed
echo.
goto :eof

REM Function to build for Windows
:build_windows
echo Building for Windows ^(EXE^)...
call :check_icons
call npm run build:windows
echo Windows build complete!
echo Output: dist\TaskHub Setup *.exe
echo.
goto :eof

REM Function to build for macOS
:build_mac
echo Building for macOS ^(DMG^)...
echo Note: macOS builds should be done on a Mac, but attempting...
call :check_icons
call npm run build:mac
echo macOS build complete!
echo Output: dist\TaskHub-*.dmg
echo.
goto :eof

REM Main menu
if "%1"=="" (
    echo.
    echo Select an option:
    echo 1. Install dependencies
    echo 2. Check icon files
    echo 3. Build for macOS ^(DMG^)
    echo 4. Build for Windows ^(EXE^)
    echo 5. Build for all platforms
    echo.
    set /p choice="Enter choice (1-5): "
    
    if "!choice!"=="1" (
        call :install_deps
    ) else if "!choice!"=="2" (
        call :check_icons
    ) else if "!choice!"=="3" (
        call :build_mac
    ) else if "!choice!"=="4" (
        call :build_windows
    ) else if "!choice!"=="5" (
        echo Building for all platforms...
        call :check_icons
        call npm run build:all
        echo All builds complete!
    ) else (
        echo Invalid choice
    )
) else (
    if "%1"=="install" (
        call :install_deps
    ) else if "%1"=="icons" (
        call :check_icons
    ) else if "%1"=="build:mac" (
        call :build_mac
    ) else if "%1"=="build:windows" (
        call :build_windows
    ) else if "%1"=="build:all" (
        echo Building for all platforms...
        call :check_icons
        call npm run build:all
        echo All builds complete!
    ) else if "%1"=="help" (
        echo Usage: build.bat [command]
        echo.
        echo Commands:
        echo   install      - Install dependencies
        echo   icons        - Check icon files
        echo   build:mac    - Build for macOS
        echo   build:windows - Build for Windows
        echo   build:all    - Build for all platforms
        echo   help         - Show this help message
    ) else (
        echo Unknown command: %1
        echo Run 'build.bat help' for usage information
    )
)

echo Done!
