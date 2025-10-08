#!/bin/bash

# Build DMG installer on Mac
# Run this script on your Mac to create a proper DMG installer

set -e

VERSION="${VERSION:-v0.5.4}"
APP_NAME="FoundryMCPServer"
VOLUME_NAME="Foundry MCP Server"
DMG_NAME="${APP_NAME}-${VERSION}-macOS.dmg"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BUILD_DIR="${SCRIPT_DIR}/build"
APP_BUNDLE="${BUILD_DIR}/${APP_NAME}.app"
DMG_TEMP="${BUILD_DIR}/dmg-temp"

echo "🍎 Building DMG Installer for Foundry MCP Server"
echo "Version: ${VERSION}"
echo ""

# Check if app bundle exists
if [ ! -d "${APP_BUNDLE}" ]; then
  echo "❌ Error: ${APP_BUNDLE} not found"
  echo "Please run the build script first to create the .app bundle"
  exit 1
fi

# Clean up old DMG
if [ -f "${BUILD_DIR}/${DMG_NAME}" ]; then
  echo "🗑️  Removing old DMG..."
  rm -f "${BUILD_DIR}/${DMG_NAME}"
fi

# Create temporary DMG directory
echo "📁 Creating DMG structure..."
rm -rf "${DMG_TEMP}"
mkdir -p "${DMG_TEMP}"

# Copy app bundle
echo "📦 Copying app bundle..."
cp -R "${APP_BUNDLE}" "${DMG_TEMP}/"

# Copy README
if [ -f "${BUILD_DIR}/README.md" ]; then
  cp "${BUILD_DIR}/README.md" "${DMG_TEMP}/"
fi

# Create symbolic link to Applications folder
echo "🔗 Creating Applications symlink..."
ln -s /Applications "${DMG_TEMP}/Applications"

# Create DMG
echo "🔨 Creating DMG..."
hdiutil create -volname "${VOLUME_NAME}" \
  -srcfolder "${DMG_TEMP}" \
  -ov \
  -format UDZO \
  -imagekey zlib-level=9 \
  "${BUILD_DIR}/${DMG_NAME}"

# Clean up temp directory
echo "🧹 Cleaning up..."
rm -rf "${DMG_TEMP}"

echo ""
echo "✅ DMG created successfully!"
echo "📁 Location: ${BUILD_DIR}/${DMG_NAME}"
echo ""

# Show size
ls -lh "${BUILD_DIR}/${DMG_NAME}"

echo ""
echo "To test the DMG:"
echo "1. Double-click to mount"
echo "2. Drag FoundryMCPServer.app to Applications"
echo "3. Unmount the DMG"
echo "4. Run the app from /Applications"
