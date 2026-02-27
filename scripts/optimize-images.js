const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const INPUT_DIR = path.join(__dirname, '..', 'public', 'uploads')

async function processFile(file) {
  const filePath = path.join(INPUT_DIR, file)
  const ext = path.extname(file).toLowerCase()
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return

  try {
    const stat = await fs.promises.stat(filePath)
    if (!stat.isFile()) return

    const image = sharp(filePath)
    const metadata = await image.metadata()

    const resizeWidth = Math.min(metadata.width || 1600, 1600)

    if (ext === '.png') {
      await image
        .resize({ width: resizeWidth })
        .png({ compressionLevel: 9, quality: 80 })
        .toFile(filePath + '.tmp')
    } else {
      await image
        .resize({ width: resizeWidth })
        .jpeg({ quality: 75, mozjpeg: true })
        .toFile(filePath + '.tmp')
    }

    await fs.promises.rename(filePath + '.tmp', filePath)

    const webpPath = filePath.replace(/\.[^.]+$/, '') + '.webp'
    await image
      .resize({ width: resizeWidth })
      .webp({ quality: 75 })
      .toFile(webpPath)

    console.log('Optimized', file)
  } catch (err) {
    console.error('Failed to process', file, err.message)
  }
}

async function walkAndProcess(dir) {
  const entries = await fs.promises.readdir(dir)
  for (const entry of entries) {
    const full = path.join(dir, entry)
    const stat = await fs.promises.stat(full)
    if (stat.isDirectory()) {
      await walkAndProcess(full)
    } else {
      const rel = path.relative(INPUT_DIR, full)
      await processFile(rel)
    }
  }
}

;(async () => {
  try {
    if (!fs.existsSync(INPUT_DIR)) {
      console.log('No uploads directory found at', INPUT_DIR)
      return
    }
    await walkAndProcess(INPUT_DIR)
    console.log('Image optimisation complete')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
