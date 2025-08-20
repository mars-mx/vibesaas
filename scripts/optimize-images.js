#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function optimizeImage(inputPath, outputPath, options = {}) {
  const {
    width = null,
    height = null,
    quality = 85,
    format = 'auto'
  } = options;

  try {
    const input = await fs.readFile(inputPath);
    let pipeline = sharp(input);

    // Get metadata
    const metadata = await pipeline.metadata();
    console.log(`Original: ${metadata.width}x${metadata.height}, ${metadata.format}`);

    // Resize if dimensions provided
    if (width || height) {
      pipeline = pipeline.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Convert format if needed
    const ext = path.extname(outputPath).toLowerCase();
    const outputFormat = format === 'auto' ? ext.slice(1) : format;

    if (outputFormat === 'png') {
      pipeline = pipeline.png({
        quality,
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: true
      });
    } else if (outputFormat === 'webp') {
      pipeline = pipeline.webp({ quality });
    } else if (outputFormat === 'jpg' || outputFormat === 'jpeg') {
      pipeline = pipeline.jpeg({ quality, progressive: true });
    }

    // Save optimized image
    await pipeline.toFile(outputPath);

    // Get new file size
    const stats = await fs.stat(outputPath);
    const originalStats = await fs.stat(inputPath);
    const reduction = ((1 - stats.size / originalStats.size) * 100).toFixed(1);

    console.log(`Optimized: ${outputPath}`);
    console.log(`Size: ${(originalStats.size / 1024 / 1024).toFixed(2)}MB → ${(stats.size / 1024 / 1024).toFixed(2)}MB (${reduction}% reduction)`);

    return { success: true, reduction };
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🖼️  Optimizing images...\n');

  // Optimize logo
  await optimizeImage(
    'public/logo.png',
    'public/logo-optimized.png',
    { 
      width: 512,  // Reasonable size for a logo
      quality: 90 
    }
  );

  // Create WebP version for modern browsers
  await optimizeImage(
    'public/logo.png',
    'public/logo.webp',
    { 
      width: 512,
      format: 'webp',
      quality: 85
    }
  );

  // Create smaller versions for different use cases
  await optimizeImage(
    'public/logo.png',
    'public/logo-small.png',
    { 
      width: 256,
      quality: 90
    }
  );

  await optimizeImage(
    'public/logo.png',
    'public/logo-small.webp',
    { 
      width: 256,
      format: 'webp',
      quality: 85
    }
  );

  console.log('\n✅ Image optimization complete!');
}

main().catch(console.error);