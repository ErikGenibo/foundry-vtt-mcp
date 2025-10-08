#!/usr/bin/env node

/**
 * Simple Mac Installer Builder - Creates .app bundle in tar.gz
 *
 * This creates a distributable Mac app bundle that can be tested directly
 * or wrapped in DMG/PKG later. Use this for development/testing.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const VERSION = process.env.VERSION || 'v0.5.4';
const NODE_VERSION = '20.11.0';

// Paths
const ROOT_DIR = path.join(__dirname, '..');
const BUILD_DIR = path.join(__dirname, 'build');
const MAC_DIR = path.join(__dirname, 'mac');
const APP_BUNDLE = path.join(BUILD_DIR, 'FoundryMCPServer.app');
const CONTENTS_DIR = path.join(APP_BUNDLE, 'Contents');
const MACOS_DIR = path.join(CONTENTS_DIR, 'MacOS');
const RESOURCES_DIR = path.join(CONTENTS_DIR, 'Resources');
const SERVER_DIR = path.join(RESOURCES_DIR, 'foundry-mcp-server');
const MODULE_DIR = path.join(RESOURCES_DIR, 'foundry-module');

console.log('🍎 Building Mac App Bundle for Foundry MCP Server');
console.log(`Version: ${VERSION}`);
console.log('Note: This creates an .app bundle without Node.js (expects system Node.js)');
console.log('');

// Clean and create directories
console.log('📁 Creating directory structure...');
if (fs.existsSync(APP_BUNDLE)) {
  fs.rmSync(APP_BUNDLE, { recursive: true, force: true });
}

fs.mkdirSync(BUILD_DIR, { recursive: true });
fs.mkdirSync(CONTENTS_DIR, { recursive: true });
fs.mkdirSync(MACOS_DIR, { recursive: true });
fs.mkdirSync(RESOURCES_DIR, { recursive: true });
fs.mkdirSync(SERVER_DIR, { recursive: true });
fs.mkdirSync(MODULE_DIR, { recursive: true });

// Copy MCP server files
function copyServerFiles() {
  console.log('📦 Copying MCP server files...');

  const indexBundle = path.join(ROOT_DIR, 'packages', 'mcp-server', 'dist', 'index.bundle.cjs');
  const backendBundle = path.join(ROOT_DIR, 'packages', 'mcp-server', 'dist', 'backend.bundle.cjs');

  if (!fs.existsSync(indexBundle) || !fs.existsSync(backendBundle)) {
    throw new Error('MCP server bundles not found. Run npm run bundle:server first.');
  }

  fs.copyFileSync(indexBundle, path.join(SERVER_DIR, 'index.cjs'));
  fs.copyFileSync(backendBundle, path.join(SERVER_DIR, 'backend.bundle.cjs'));

  // Copy package.json for version info
  const packageJson = path.join(ROOT_DIR, 'packages', 'mcp-server', 'package.json');
  fs.copyFileSync(packageJson, path.join(SERVER_DIR, 'package.json'));

  console.log('✅ Copied MCP server files');
}

// Copy Foundry module files
function copyFoundryModule() {
  console.log('📦 Copying Foundry module...');

  const moduleSource = path.join(ROOT_DIR, 'packages', 'foundry-module', 'dist');

  if (!fs.existsSync(moduleSource)) {
    throw new Error('Foundry module not found. Run npm run build:foundry first.');
  }

  // Copy all module files recursively
  copyRecursive(moduleSource, MODULE_DIR);

  console.log('✅ Copied Foundry module');
}

// Recursive copy helper
function copyRecursive(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(child => {
      copyRecursive(path.join(src, child), path.join(dest, child));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Create simple launch script (uses system node)
function createLaunchScript() {
  console.log('📝 Creating launch script...');

  const launchScript = `#!/bin/bash

# Foundry MCP Server Launch Script
# Uses system Node.js (must be installed)

SCRIPT_DIR="$( cd "$( dirname "\${BASH_SOURCE[0]}" )" && pwd )"
RESOURCES_DIR="$SCRIPT_DIR/../Resources"
SERVER_DIR="$RESOURCES_DIR/foundry-mcp-server"

# Check for Node.js
if ! command -v node &> /dev/null; then
  echo "Error: Node.js not found. Please install Node.js 18+ from https://nodejs.org/" >&2
  exit 1
fi

# Launch the MCP server
exec node "$SERVER_DIR/index.cjs"
`;

  const launchDest = path.join(MACOS_DIR, 'FoundryMCPServer');
  fs.writeFileSync(launchDest, launchScript);
  fs.chmodSync(launchDest, 0o755);

  console.log('✅ Created launch script');
}

// Copy Info.plist
function copyInfoPlist() {
  console.log('📝 Creating Info.plist...');

  const plistContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleDevelopmentRegion</key>
	<string>en</string>
	<key>CFBundleExecutable</key>
	<string>FoundryMCPServer</string>
	<key>CFBundleIdentifier</key>
	<string>com.foundry-mcp.server</string>
	<key>CFBundleInfoDictionaryVersion</key>
	<string>6.0</string>
	<key>CFBundleName</key>
	<string>Foundry MCP Server</string>
	<key>CFBundlePackageType</key>
	<string>APPL</string>
	<key>CFBundleShortVersionString</key>
	<string>${VERSION.replace('v', '')}</string>
	<key>CFBundleVersion</key>
	<string>${VERSION.replace('v', '')}</string>
	<key>LSMinimumSystemVersion</key>
	<string>10.15</string>
	<key>LSUIElement</key>
	<true/>
	<key>NSHumanReadableCopyright</key>
	<string>Copyright © 2025 Foundry MCP. All rights reserved.</string>
	<key>CFBundleDisplayName</key>
	<string>Foundry MCP Server</string>
</dict>
</plist>
`;

  fs.writeFileSync(path.join(CONTENTS_DIR, 'Info.plist'), plistContent);

  console.log('✅ Created Info.plist');
}

// Create README
function createReadme() {
  console.log('📝 Creating README...');

  const readmeContent = `# Foundry MCP Server ${VERSION}

## Installation

1. **Install Node.js** (if not already installed)
   - Download from: https://nodejs.org/
   - Version 18+ required

2. **Move to Applications**
   - Drag FoundryMCPServer.app to your /Applications folder

3. **First Launch**
   - Open the app (it will configure Claude Desktop automatically)
   - If you see a security warning, go to System Preferences → Security & Privacy → Allow

4. **Install ComfyUI** (for AI map generation - Apple Silicon only)
   - Open Terminal and run:
     \`\`\`
     cd /Applications/FoundryMCPServer.app/Contents/Resources
     node setup-comfyui.js
     \`\`\`
   - This downloads ComfyUI + AI models (~13.5GB, takes 30-40 mins)
   - Or download ComfyUI Desktop manually from: https://www.comfy.org/download

## Usage

Once installed, the MCP server will appear in Claude Desktop. You can now:
- Access your Foundry VTT game data from Claude
- Generate AI battlemaps with ComfyUI (Apple Silicon only)
- Use 25+ tools for campaign management

## Requirements

- macOS 10.15+ (Catalina or later)
- Node.js 18+
- Apple Silicon (M1/M2/M3/M4) required for AI map generation
- Foundry VTT (local or remote instance)

## Troubleshooting

**"FoundryMCPServer" cannot be opened because it is from an unidentified developer**
- Right-click the app → Open → Open anyway
- Or: System Preferences → Security & Privacy → Allow

**AI maps not working**
- Ensure you're on Apple Silicon (not Intel Mac)
- Run the setup script (see installation step 4 above)
- ComfyUI requires ~13.5GB of downloads

## Support

- GitHub: https://github.com/adambdooley/foundry-vtt-mcp
- Issues: https://github.com/adambdooley/foundry-vtt-mcp/issues
`;

  fs.writeFileSync(path.join(BUILD_DIR, 'README.md'), readmeContent);

  console.log('✅ Created README');
}

// Main build process
// Copy setup script
function copySetupScript() {
  console.log('📝 Copying ComfyUI setup script...');

  const setupScript = path.join(MAC_DIR, 'setup-comfyui.js');
  const setupDest = path.join(RESOURCES_DIR, 'setup-comfyui.js');

  if (!fs.existsSync(setupScript)) {
    throw new Error('setup-comfyui.js not found in installer/mac/');
  }

  fs.copyFileSync(setupScript, setupDest);
  fs.chmodSync(setupDest, 0o755);

  console.log('✅ Copied setup script');
}

function build() {
  try {
    copyServerFiles();
    copyFoundryModule();
    copySetupScript();
    createLaunchScript();
    copyInfoPlist();
    createReadme();

    console.log('');
    console.log('🎉 Mac app bundle created successfully!');
    console.log('');
    console.log(`📁 Location: ${APP_BUNDLE}`);
    console.log('');
    console.log('Next steps:');
    console.log('1. Transfer FoundryMCPServer.app to your Mac');
    console.log('2. Install Node.js 18+ on Mac (if not installed)');
    console.log('3. Drag to /Applications');
    console.log('4. Run the app to configure Claude Desktop');
    console.log('5. Run setup script for ComfyUI:');
    console.log('   cd /Applications/FoundryMCPServer.app/Contents/Resources');
    console.log('   node setup-comfyui.js');
    console.log('');
    console.log('To create a distributable package:');
    console.log('- Zip: cd installer/build && tar -czf FoundryMCPServer-'+VERSION+'-macOS.tar.gz FoundryMCPServer.app');
    console.log('- DMG: Use Disk Utility on Mac to create DMG from .app bundle');

  } catch (err) {
    console.error('❌ Build failed:', err.message);
    process.exit(1);
  }
}

build();
