#!/usr/bin/env node

/**
 * Mac PKG Installer Builder for Foundry MCP Server
 *
 * Creates a native Mac installer (.pkg) that:
 * - Downloads and bundles Node.js for both Apple Silicon (arm64) and Intel (x64)
 * - Creates an app bundle structure at /Applications/FoundryMCPServer.app
 * - Configures Claude Desktop to use the MCP server
 * - Auto-detects ComfyUI installation or provides download link
 * - Detects and installs Foundry module
 * - Runs post-install scripts for configuration
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

const VERSION = process.env.VERSION || 'v0.5.4';
const NODE_VERSION = '20.11.0'; // LTS version

// Paths
const ROOT_DIR = path.join(__dirname, '..');
const BUILD_DIR = path.join(__dirname, 'build');
const MAC_DIR = path.join(__dirname, 'mac');
const PKG_ROOT = path.join(BUILD_DIR, 'mac-pkg-root');
const APP_BUNDLE = path.join(PKG_ROOT, 'Applications', 'FoundryMCPServer.app');
const CONTENTS_DIR = path.join(APP_BUNDLE, 'Contents');
const MACOS_DIR = path.join(CONTENTS_DIR, 'MacOS');
const RESOURCES_DIR = path.join(CONTENTS_DIR, 'Resources');
const NODE_ARM64_DIR = path.join(RESOURCES_DIR, 'node-arm64');
const NODE_X64_DIR = path.join(RESOURCES_DIR, 'node-x64');
const SERVER_DIR = path.join(RESOURCES_DIR, 'foundry-mcp-server');

const OUTPUT_PKG = path.join(BUILD_DIR, `FoundryMCPServer-${VERSION}-macOS.pkg`);

console.log('🍎 Building Mac PKG Installer for Foundry MCP Server');
console.log(`Version: ${VERSION}`);
console.log(`Node.js: ${NODE_VERSION}`);
console.log('');

// Clean and create directories
console.log('📁 Creating directory structure...');
if (fs.existsSync(PKG_ROOT)) {
  fs.rmSync(PKG_ROOT, { recursive: true, force: true });
}

fs.mkdirSync(PKG_ROOT, { recursive: true });
fs.mkdirSync(path.join(PKG_ROOT, 'Applications'), { recursive: true });
fs.mkdirSync(CONTENTS_DIR, { recursive: true });
fs.mkdirSync(MACOS_DIR, { recursive: true });
fs.mkdirSync(RESOURCES_DIR, { recursive: true });
fs.mkdirSync(NODE_ARM64_DIR, { recursive: true });
fs.mkdirSync(NODE_X64_DIR, { recursive: true });
fs.mkdirSync(SERVER_DIR, { recursive: true });

// Download Node.js binaries
function downloadNodeBinary(arch) {
  const nodeArch = arch === 'arm64' ? 'arm64' : 'x64';
  const url = `https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-darwin-${nodeArch}.tar.gz`;
  const targetDir = arch === 'arm64' ? NODE_ARM64_DIR : NODE_X64_DIR;
  const tarFile = path.join(BUILD_DIR, `node-${arch}.tar.gz`);

  console.log(`📥 Downloading Node.js ${NODE_VERSION} for ${arch}...`);

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(tarFile);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        https.get(response.headers.location, (resp) => {
          resp.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`✅ Downloaded Node.js ${arch}`);

            // Extract tarball
            console.log(`📦 Extracting Node.js ${arch}...`);
            try {
              execSync(`tar -xzf "${tarFile}" -C "${BUILD_DIR}"`, { stdio: 'inherit' });
              const extractedDir = path.join(BUILD_DIR, `node-v${NODE_VERSION}-darwin-${nodeArch}`);

              // Copy node binary and lib files
              fs.copyFileSync(
                path.join(extractedDir, 'bin', 'node'),
                path.join(targetDir, 'node')
              );
              fs.chmodSync(path.join(targetDir, 'node'), 0o755);

              // Copy lib directory if it exists
              const libSrc = path.join(extractedDir, 'lib');
              const libDest = path.join(targetDir, 'lib');
              if (fs.existsSync(libSrc)) {
                fs.cpSync(libSrc, libDest, { recursive: true });
              }

              console.log(`✅ Extracted Node.js ${arch}`);
              resolve();
            } catch (err) {
              reject(err);
            }
          });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded Node.js ${arch}`);

          // Extract tarball
          console.log(`📦 Extracting Node.js ${arch}...`);
          try {
            execSync(`tar -xzf "${tarFile}" -C "${BUILD_DIR}"`, { stdio: 'inherit' });
            const extractedDir = path.join(BUILD_DIR, `node-v${NODE_VERSION}-darwin-${nodeArch}`);

            // Copy node binary and lib files
            fs.copyFileSync(
              path.join(extractedDir, 'bin', 'node'),
              path.join(targetDir, 'node')
            );
            fs.chmodSync(path.join(targetDir, 'node'), 0o755);

            // Copy lib directory if it exists
            const libSrc = path.join(extractedDir, 'lib');
            const libDest = path.join(targetDir, 'lib');
            if (fs.existsSync(libSrc)) {
              fs.cpSync(libSrc, libDest, { recursive: true });
            }

            console.log(`✅ Extracted Node.js ${arch}`);
            resolve();
          } catch (err) {
            reject(err);
          }
        });
      }
    }).on('error', reject);
  });
}

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

// Copy launch script
function copyLaunchScript() {
  console.log('📝 Copying launch script...');

  const launchScript = path.join(MAC_DIR, 'launch.sh');
  const launchDest = path.join(MACOS_DIR, 'FoundryMCPServer');

  if (!fs.existsSync(launchScript)) {
    throw new Error('launch.sh not found in installer/mac/');
  }

  fs.copyFileSync(launchScript, launchDest);
  fs.chmodSync(launchDest, 0o755);

  console.log('✅ Copied launch script');
}

// Copy Info.plist
function copyInfoPlist() {
  console.log('📝 Copying Info.plist...');

  const infoPlist = path.join(MAC_DIR, 'Info.plist');
  const infoDest = path.join(CONTENTS_DIR, 'Info.plist');

  if (!fs.existsSync(infoPlist)) {
    throw new Error('Info.plist not found in installer/mac/');
  }

  // Read and replace version
  let plistContent = fs.readFileSync(infoPlist, 'utf8');
  plistContent = plistContent.replace(/\$\{VERSION\}/g, VERSION.replace('v', ''));

  fs.writeFileSync(infoDest, plistContent);

  console.log('✅ Copied Info.plist');
}

// Create scripts directory for post-install
function createPostInstallScript() {
  console.log('📝 Creating post-install script...');

  const scriptsDir = path.join(BUILD_DIR, 'mac-scripts');
  fs.mkdirSync(scriptsDir, { recursive: true });

  const postInstallSrc = path.join(MAC_DIR, 'scripts', 'postinstall');
  const postInstallDest = path.join(scriptsDir, 'postinstall');

  if (!fs.existsSync(postInstallSrc)) {
    throw new Error('postinstall script not found in installer/mac/scripts/');
  }

  fs.copyFileSync(postInstallSrc, postInstallDest);
  fs.chmodSync(postInstallDest, 0o755);

  console.log('✅ Created post-install script');

  return scriptsDir;
}

// Build PKG with pkgbuild
function buildPkg(scriptsDir) {
  console.log('🔨 Building PKG installer...');

  try {
    // Create component package
    const componentPkg = path.join(BUILD_DIR, 'FoundryMCPServer-component.pkg');

    execSync(`pkgbuild --root "${PKG_ROOT}" --scripts "${scriptsDir}" --identifier com.foundry-mcp.server --version "${VERSION.replace('v', '')}" --install-location / "${componentPkg}"`, {
      stdio: 'inherit'
    });

    // Create product archive (distribution package)
    execSync(`productbuild --package "${componentPkg}" "${OUTPUT_PKG}"`, {
      stdio: 'inherit'
    });

    console.log('✅ Built PKG installer');
    console.log('');
    console.log(`📦 Installer created: ${OUTPUT_PKG}`);

    const stats = fs.statSync(OUTPUT_PKG);
    console.log(`   Size: ${(stats.size / 1024 / 1024).toFixed(1)} MB`);

  } catch (err) {
    throw new Error(`Failed to build PKG: ${err.message}`);
  }
}

// Main build process
async function build() {
  try {
    // Download Node.js binaries
    await downloadNodeBinary('arm64');
    await downloadNodeBinary('x64');

    // Copy server files
    copyServerFiles();

    // Copy launch script
    copyLaunchScript();

    // Copy Info.plist
    copyInfoPlist();

    // Create post-install script
    const scriptsDir = createPostInstallScript();

    // Build PKG
    buildPkg(scriptsDir);

    console.log('');
    console.log('🎉 Mac installer build complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Test the installer on a Mac');
    console.log('2. Verify Claude Desktop configuration');
    console.log('3. Test ComfyUI detection and spawning');

  } catch (err) {
    console.error('❌ Build failed:', err.message);
    process.exit(1);
  }
}

build();
