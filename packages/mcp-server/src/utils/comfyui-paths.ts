/**
 * ComfyUI installation detection utilities
 */

import * as fs from 'fs';
import * as path from 'path';
import { isMac, isWindows } from './platform.js';

/**
 * Check if a directory contains a valid ComfyUI installation
 */
export function isValidComfyUIPath(dirPath: string): boolean {
  try {
    const mainPyPath = path.join(dirPath, 'main.py');
    return fs.existsSync(mainPyPath) && fs.statSync(mainPyPath).isFile();
  } catch (error) {
    return false;
  }
}

/**
 * Get common ComfyUI installation paths for the current platform
 */
function getCommonComfyUIPaths(): string[] {
  const paths: string[] = [];
  const home = process.env.HOME || process.env.USERPROFILE || '';

  if (isWindows()) {
    const localAppData = process.env.LOCALAPPDATA || 'C:\\Users\\Default\\AppData\\Local';

    // Windows paths
    paths.push(
      `${localAppData}\\FoundryMCPServer\\ComfyUI-headless`,
      `${localAppData}\\ComfyUI`,
      'C:\\ComfyUI',
      `${home}\\ComfyUI`
    );
  } else if (isMac()) {
    const appSupport = `${home}/Library/Application Support`;

    // Mac paths - ComfyUI Desktop and manual installs
    paths.push(
      `${appSupport}/FoundryMCPServer/ComfyUI-headless`,
      `${appSupport}/ComfyUI`,
      '/Applications/ComfyUI.app/Contents/Resources/ComfyUI',
      `${home}/ComfyUI`,
      '/opt/ComfyUI',
      '/usr/local/ComfyUI'
    );
  } else {
    // Linux paths
    paths.push(
      `${home}/.local/share/FoundryMCPServer/ComfyUI-headless`,
      `${home}/ComfyUI`,
      '/opt/ComfyUI',
      '/usr/local/ComfyUI'
    );
  }

  return paths;
}

/**
 * Attempt to detect an existing ComfyUI installation
 * Returns the path if found, or null if not found
 */
export function detectComfyUIInstallation(): string | null {
  const commonPaths = getCommonComfyUIPaths();

  for (const dirPath of commonPaths) {
    if (isValidComfyUIPath(dirPath)) {
      return dirPath;
    }
  }

  return null;
}

/**
 * Get the ComfyUI Desktop download URL for Mac
 */
export function getComfyUIDesktopURL(): string {
  return 'https://www.comfy.org/download';
}

/**
 * Check if ComfyUI Desktop is likely installed on Mac
 */
export function isComfyUIDesktopInstalled(): boolean {
  if (!isMac()) {
    return false;
  }

  const appPath = '/Applications/ComfyUI.app';
  try {
    return fs.existsSync(appPath);
  } catch (error) {
    return false;
  }
}

/**
 * Get Python command for running ComfyUI on the current platform
 */
export function getDefaultPythonCommand(): string {
  if (isWindows()) {
    // Windows: embedded Python in ComfyUI directory
    return 'python/python.exe';
  } else if (isMac()) {
    // Mac: system Python or ComfyUI Desktop's Python
    return 'python3';
  } else {
    // Linux: system Python
    return 'python3';
  }
}
