const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const UPLOADS_DIR = path.join(__dirname, '../public/uploads')
const MAX_DIMENSION = 1920
const JPEG_QUALITY = 80
const SKIP_BELOW_BYTES = 200 * 1024 // 200 KB

const SUPPORTED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif'])

async function optimizeImages() {
  const files = fs.readdirSync(UPLOADS_DIR)
  const imageFiles = files.filter(f => SUPPORTED_EXTENSIONS.has(path.extname(f).toLowerCase()))

  console.log(`Found ${imageFiles.length} images in ${UPLOADS_DIR}`)

  let processed = 0
  let skipped = 0
  let totalBefore = 0
  let totalAfter = 0

  for (const file of imageFiles) {
    const filePath = path.join(UPLOADS_DIR, file)
    const statBefore = fs.statSync(filePath)
    const sizeBefore = statBefore.size

    if (sizeBefore < SKIP_BELOW_BYTES) {
      skipped++
      continue
    }

    try {
      const image = sharp(filePath)
      const metadata = await image.metadata()

      const needsResize =
        (metadata.width && metadata.width > MAX_DIMENSION) ||
        (metadata.height && metadata.height > MAX_DIMENSION)

      let pipeline = image
      if (needsResize) {
        pipeline = pipeline.resize(MAX_DIMENSION, MAX_DIMENSION, {
          fit: 'inside',
          withoutEnlargement: true,
        })
      }

      const outputBuffer = await pipeline
        .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
        .toBuffer()

      fs.writeFileSync(filePath, outputBuffer)

      const sizeAfter = outputBuffer.length
      totalBefore += sizeBefore
      totalAfter += sizeAfter
      processed++

      const pct = Math.round((1 - sizeAfter / sizeBefore) * 100)
      console.log(
        `  ${file}: ${(sizeBefore / 1024).toFixed(0)} KB → ${(sizeAfter / 1024).toFixed(0)} KB (-${pct}%)`
      )
    } catch (err) {
      console.error(`  ERROR processing ${file}: ${err.message}`)
    }
  }

  console.log(`\nDone. Processed ${processed} files, skipped ${skipped}.`)
  console.log(
    `Total: ${(totalBefore / 1024 / 1024).toFixed(1)} MB → ${(totalAfter / 1024 / 1024).toFixed(1)} MB`
  )
}

optimizeImages().catch(err => {
  console.error(err)
  process.exit(1)
})
