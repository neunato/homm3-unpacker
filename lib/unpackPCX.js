"use strict"

const BufferView = require("./BufferView")
const { defineFileType } = require("./types")
const upng = require("upng-js")



// .PCX files occur as standalone files (archived in .LODs) and in .DEF animation files (also archived in LODs).
// Standalones are stored as 24bit BGR bitmap or indexed bitmap with a palette of 256 24bit RGB colors.
// Animation frames share a palette (one per .DEF), contain some additional positioning information, special
// colors for unit selection and encode their bitmaps using several variations of RLE.

// When no palette is supplied, the image is parsed as a standalone file.


function unpackPCX(buffer, { format = "png", transparency = [{r: 0, g: 255, b: 255}, {r: 255, g: 0, b: 255}, {r: 0, g: 0, b: 0}] } = {}) {

   if (!(buffer instanceof BufferView))
      buffer = new BufferView(buffer)

   if (format !== "png" && format !== "bitmap")
      throw new Error("PCX output format not supported.")

   if (!Array.isArray(transparency) || transparency.some(({r, g, b}) => r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255))
      throw new Error("Transparency must be an array of {r, g, b} values in 0-255 range.")

   let type
   const size = buffer.uint32()
   const width = buffer.uint32()
   const height = buffer.uint32()

   const pixelCount = width * height
   const bitmap = new BufferView(pixelCount * 4)

   // 1 byte per pixel, indexed bitmap.
   if (pixelCount === size) {
      type = defineFileType(16)               // Implicit "pcx (indexed)". This is in fact readable in LOD.
      const indices = buffer.loop(pixelCount, buffer.uint8)
      const palette = buffer.loop(256, () => ({ r: buffer.uint8(), g: buffer.uint8(), b: buffer.uint8() }))

      // Transparency - make first palette entry transparent if its colour is found in .transparency.
      const [first] = palette
      if (transparency.some(({r, g, b}) => r === first.r && g === first.g && b === first.b))
         palette[0] = { r: 0, g: 0, b: 0, a: 0 }

      for (const index of indices) {
         const { r, g, b, a = 255 } = palette[index]
         bitmap.setuint8(r, g, b, a)
      }
   }

   // 3 bytes per pixel, bgr bitmap.
   else if (pixelCount * 3 === size) {
      type = defineFileType(17)               // Implicit "pcx (bgr)". This is in fact readable in LOD.
      for (let i = 0; i < pixelCount; i++) {
         const b = buffer.uint8()
         const g = buffer.uint8()
         const r = buffer.uint8()
         bitmap.setuint8(r, g, b, 255)
      }
   }

   else {
      throw new Error("Image size mismatch.")
   }


   const data = format === "bitmap" ? bitmap.buffer : upng.encode([bitmap.buffer], width, height, 0)

   return {
      type,
      width,
      height,
      data
   }

}

module.exports = unpackPCX
