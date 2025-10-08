#!/usr/bin/env node

/**
 * Foundry MCP Server - ComfyUI Setup Script for Mac
 *
 * This script downloads and installs:
 * - ComfyUI Desktop (200MB)
 * - SDXL Base Model (6.5GB)
 * - SDXL VAE (335MB)
 * - D&D Battlemaps Model (6.5GB)
 * - Config files and license
 *
 * Total download: ~13.5GB
 * Run this ONCE after installing the MCP server.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

console.log('🍎 Foundry MCP Server - ComfyUI Setup for Mac');
console.log('==============================================\n');

// Check if Apple Silicon
const arch = process.arch;
const platform = process.platform;

if (platform !== 'darwin') {
  console.error('❌ This script is only for macOS');
  process.exit(1);
}

if (arch !== 'arm64') {
  console.error('❌ ComfyUI requires Apple Silicon (M1/M2/M3/M4)');
  console.error('   Your Mac has an Intel processor and cannot run ComfyUI efficiently.');
  console.error('   You can still use all other MCP tools!');
  process.exit(1);
}

console.log('✅ Apple Silicon detected');
console.log('');

// Configuration
const COMFYUI_DMG_URL = 'https://download.comfy.org/mac/dmg/arm64';
const COMFYUI_APP_PATH = '/Applications/ComfyUI.app';
const COMFYUI_RESOURCES = `${COMFYUI_APP_PATH}/Contents/Resources/ComfyUI`;

const MODELS = [
  {
    name: 'YAML Config',
    url: 'https://huggingface.co/AdamDooley/dnd-battlemaps-sdxl-1.0-mirror/resolve/main/dDBattlemapsSDXL10_upscaleV10.yaml',
    path: 'models/configs/dDBattlemapsSDXL10_upscaleV10.yaml',
    size: '1KB'
  },
  {
    name: 'SDXL Base Model',
    url: 'https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors',
    path: 'models/checkpoints/sd_xl_base_1.0.safetensors',
    size: '6.5GB'
  },
  {
    name: 'SDXL VAE',
    url: 'https://huggingface.co/stabilityai/sdxl-vae/resolve/main/sdxl_vae.safetensors',
    path: 'models/vae/sdxl_vae.safetensors',
    size: '335MB'
  },
  {
    name: 'D&D Battlemaps Checkpoint',
    url: 'https://huggingface.co/AdamDooley/dnd-battlemaps-sdxl-1.0-mirror/resolve/main/dDBattlemapsSDXL10_upscaleV10.safetensors',
    path: 'models/checkpoints/dDBattlemapsSDXL10_upscaleV10.safetensors',
    size: '6.5GB'
  },
  {
    name: 'License File',
    url: 'https://huggingface.co/AdamDooley/dnd-battlemaps-sdxl-1.0-mirror/resolve/main/LICENSE.txt',
    path: 'models/checkpoints/dDBattlemapsSDXL10_LICENSE.txt',
    size: '1KB'
  }
];

// Helper: Download file with progress
function downloadFile(url, dest, displayName) {
  return new Promise((resolve, reject) => {
    console.log(`📥 Downloading ${displayName}...`);

    const file = fs.createWriteStream(dest);
    let downloadedBytes = 0;
    let totalBytes = 0;
    let lastPercent = 0;

    const request = https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(response.headers.location, dest, displayName).then(resolve).catch(reject);
      }

      totalBytes = parseInt(response.headers['content-length'] || '0', 10);

      response.on('data', (chunk) => {
        downloadedBytes += chunk.length;
        const percent = totalBytes > 0 ? Math.floor((downloadedBytes / totalBytes) * 100) : 0;

        if (percent > lastPercent && percent % 10 === 0) {
          const downloaded = (downloadedBytes / 1024 / 1024).toFixed(1);
          const total = (totalBytes / 1024 / 1024).toFixed(1);
          console.log(`   ${percent}% - ${downloaded}MB / ${total}MB`);
          lastPercent = percent;
        }
      });

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded ${displayName}`);
        resolve();
      });
    });

    request.on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });

    file.on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

// Step 1: Check/Install ComfyUI
async function installComfyUI() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Step 1: ComfyUI Desktop Installation');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (fs.existsSync(COMFYUI_APP_PATH)) {
    console.log('✅ ComfyUI already installed at /Applications/ComfyUI.app');
    console.log('');
    return true;
  }

  console.log('ComfyUI not found. Downloading (~200MB)...');
  console.log('');

  const tmpDir = process.env.TMPDIR || '/tmp';
  const dmgPath = path.join(tmpDir, 'ComfyUI.dmg');

  try {
    await downloadFile(COMFYUI_DMG_URL, dmgPath, 'ComfyUI Desktop');

    console.log('\n📦 Installing ComfyUI...');

    // Mount DMG
    const mountOutput = execSync(`hdiutil attach "${dmgPath}" -nobrowse -noverify`, { encoding: 'utf8' });
    const volumeMatch = mountOutput.match(/\/Volumes\/[^\s]+/);

    if (!volumeMatch) {
      throw new Error('Failed to mount DMG');
    }

    const volumePath = volumeMatch[0];
    console.log(`   Mounted at ${volumePath}`);

    // Copy to Applications
    const appPath = `${volumePath}/ComfyUI.app`;
    execSync(`cp -R "${appPath}" /Applications/`);
    console.log('   Copied to /Applications');

    // Unmount
    execSync(`hdiutil detach "${volumePath}"`);

    // Clean up
    fs.unlinkSync(dmgPath);

    console.log('✅ ComfyUI installed successfully\n');
    return true;
  } catch (error) {
    console.error(`❌ Failed to install ComfyUI: ${error.message}`);
    console.error('\nYou can install manually from: https://www.comfy.org/download\n');
    return false;
  }
}

// Step 2: Download Models
async function downloadModels() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Step 2: AI Model Downloads (~13.3GB)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (!fs.existsSync(COMFYUI_RESOURCES)) {
    console.error('❌ ComfyUI Resources directory not found');
    console.error('   Please install ComfyUI first\n');
    return false;
  }

  console.log('This will download 5 files (~13.3GB total)');
  console.log('Estimated time: 20-30 minutes on fast connection\n');

  for (let i = 0; i < MODELS.length; i++) {
    const model = MODELS[i];
    const destPath = path.join(COMFYUI_RESOURCES, model.path);
    const destDir = path.dirname(destPath);

    console.log(`[${i + 1}/${MODELS.length}] ${model.name} (${model.size})`);

    // Check if already exists
    if (fs.existsSync(destPath)) {
      console.log(`   ✅ Already exists, skipping\n`);
      continue;
    }

    // Create directory
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Download
    try {
      await downloadFile(model.url, destPath, model.name);
      console.log('');
    } catch (error) {
      console.error(`   ❌ Failed: ${error.message}\n`);
      return false;
    }
  }

  console.log('✅ All models downloaded successfully\n');
  return true;
}

// Step 3: Install Foundry Module (optional)
function installFoundryModule() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Step 3: Foundry VTT Module Installation');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const home = process.env.HOME;
  const possiblePaths = [
    `${home}/Library/Application Support/FoundryVTT/Data/modules`,
    `${home}/FoundryVTT/Data/modules`,
    '/Applications/FoundryVTT/Data/modules'
  ];

  let foundryPath = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      foundryPath = p;
      break;
    }
  }

  if (!foundryPath) {
    console.log('⚠️  Foundry VTT not detected');
    console.log('   Install Foundry VTT from: https://foundryvtt.com/');
    console.log('   The module will be auto-installed when you connect to Foundry\n');
    return false;
  }

  console.log(`✅ Foundry VTT detected at ${foundryPath}`);

  const modulePath = path.join(foundryPath, 'foundry-mcp-bridge');
  if (fs.existsSync(path.join(modulePath, 'module.json'))) {
    console.log('✅ Module already installed\n');
    return true;
  }

  // Try to find module in app bundle
  const resourcesPath = path.join(__dirname, '..', 'Resources', 'foundry-module');
  if (!fs.existsSync(resourcesPath)) {
    console.log('⚠️  Module files not found in app bundle');
    console.log('   Module will be auto-installed when you connect to Foundry\n');
    return false;
  }

  try {
    // Copy module
    execSync(`cp -R "${resourcesPath}" "${modulePath}"`);
    console.log('✅ Module installed successfully\n');
    return true;
  } catch (error) {
    console.log(`⚠️  Could not install module: ${error.message}`);
    console.log('   Module will be auto-installed when you connect to Foundry\n');
    return false;
  }
}

// Main setup process
async function main() {
  console.log('This script will:');
  console.log('1. Install ComfyUI Desktop (~200MB)');
  console.log('2. Download AI models (~13.3GB)');
  console.log('3. Install Foundry VTT module (if Foundry detected)');
  console.log('');
  console.log('⚠️  Total download: ~13.5GB');
  console.log('⚠️  Estimated time: 30-40 minutes');
  console.log('');
  console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');

  await new Promise(resolve => setTimeout(resolve, 5000));

  const comfyUISuccess = await installComfyUI();
  if (!comfyUISuccess) {
    console.log('\n❌ Setup failed at ComfyUI installation');
    console.log('Please install ComfyUI manually and run this script again\n');
    process.exit(1);
  }

  const modelsSuccess = await downloadModels();
  if (!modelsSuccess) {
    console.log('\n❌ Setup failed at model downloads');
    console.log('You can try running this script again to resume\n');
    process.exit(1);
  }

  installFoundryModule();

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Setup Complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('Next steps:');
  console.log('1. Restart Claude Desktop');
  console.log('2. Open Foundry VTT and enable "Foundry MCP Bridge" module');
  console.log('3. In Claude, you can now generate AI battlemaps!');
  console.log('');
  console.log('To test: Ask Claude to "generate a forest clearing battlemap"');
  console.log('');
}

main().catch((error) => {
  console.error('\n❌ Unexpected error:', error.message);
  process.exit(1);
});
