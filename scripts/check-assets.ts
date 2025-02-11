import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

interface AssetInfo {
  file: string;
  description: string;
  type: 'vector' | 'image' | 'json';
}

const REQUIRED_ASSETS: AssetInfo[] = [
  // Icons
  {
    file: 'favicon.svg',
    description: 'Main website favicon',
    type: 'vector'
  },
  {
    file: 'apple-touch-icon.png',
    description: 'iOS home screen icon (180x180px)',
    type: 'image'
  },
  {
    file: 'icon-96.png',
    description: 'App shortcut icon (96x96px)',
    type: 'image'
  },
  {
    file: 'icon-192.png',
    description: 'PWA icon (192x192px)',
    type: 'image'
  },
  {
    file: 'icon-512.png',
    description: 'PWA icon (512x512px)',
    type: 'image'
  },

  // Screenshots
  {
    file: 'screenshot-1.png',
    description: 'Home screen screenshot (1080x1920px)',
    type: 'image'
  },
  {
    file: 'screenshot-2.png',
    description: 'Now playing screen screenshot (1080x1920px)',
    type: 'image'
  },

  // Social Media
  {
    file: 'og-image.png',
    description: 'Social media preview image (1200x630px)',
    type: 'image'
  },

  // Configuration
  {
    file: 'manifest.json',
    description: 'PWA manifest file',
    type: 'json'
  },

  // Placeholders
  {
    file: 'placeholder-album.svg',
    description: 'Placeholder for missing album artwork',
    type: 'vector'
  },
  {
    file: 'placeholder-artist.svg',
    description: 'Placeholder for missing artist images',
    type: 'vector'
  },
  {
    file: 'placeholder-playlist.svg',
    description: 'Placeholder for missing playlist covers',
    type: 'vector'
  }
];

function checkAssets() {
  console.log(chalk.blue('\nChecking required assets in public directory...\n'));

  const existingFiles = fs.readdirSync(PUBLIC_DIR);
  const missingAssets: AssetInfo[] = [];
  const unexpectedFiles: string[] = [];

  // Check for missing required assets
  REQUIRED_ASSETS.forEach(asset => {
    if (!existingFiles.includes(asset.file)) {
      missingAssets.push(asset);
    }
  });

  // Check for unexpected files
  existingFiles.forEach(file => {
    if (!REQUIRED_ASSETS.some(asset => asset.file === file) && 
        !file.startsWith('.') && // Ignore hidden files
        file !== 'README.md') {  // Ignore README
      unexpectedFiles.push(file);
    }
  });

  // Report results
  if (missingAssets.length === 0 && unexpectedFiles.length === 0) {
    console.log(chalk.green('✓ All required assets are present and no unexpected files found!\n'));
    return;
  }

  // Report missing assets
  if (missingAssets.length > 0) {
    console.log(chalk.red('Missing required assets:'));
    missingAssets.forEach(asset => {
      console.log(chalk.yellow(`  • ${asset.file} - ${asset.description}`));
    });
    console.log();
  }

  // Report unexpected files
  if (unexpectedFiles.length > 0) {
    console.log(chalk.red('Unexpected files found:'));
    unexpectedFiles.forEach(file => {
      console.log(chalk.yellow(`  • ${file}`));
    });
    console.log(chalk.gray('  These files may not be needed and can be removed.\n'));
  }

  // Exit with error if missing required assets
  if (missingAssets.length > 0) {
    process.exit(1);
  }
}

checkAssets(); 