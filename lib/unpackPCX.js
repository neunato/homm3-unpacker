"use strict"

const BufferView         = require("./BufferView")
const { defineFileType } = require("./types")
const upng               = require("upng-js")



// .PCX files occur as standalone files (archived in .LODs) and in .DEF animation files (also archived in LODs).
// Standalones are stored as 24bit BGR bitmap or indexed bitmap with a palette of 256 24bit RGB colors.
// Animation frames share a palette (one per .DEF), contain some additional positioning information, special 
// colors for unit selection and encode their bitmaps using several variations of RLE.

// When no palette is supplied, the image is parsed as a standalone file.

function unpackPCX( buffer, options = {} ){

   if( !(buffer instanceof BufferView) )
      buffer = new BufferView(buffer)

   if( options.palette )
      return unpackPCXFrame(buffer, options)
   else
      return unpackPCXStandalone(buffer, options)

}


// options.format = "png" / "bitmap"

function unpackPCXStandalone( buffer, { format = "png" } ){

   if( format !== "png" && format !== "bitmap" )
      throw new Error("PCX output format not supported.")

   let type
   const size   = buffer.uint32()
   const width  = buffer.uint32()
   const height = buffer.uint32()

   const pixelCount = width * height
   const bitmap = new BufferView(pixelCount * 4)

   // 1 byte per pixel, indexed bitmap.
   if( pixelCount === size ){
      type = defineFileType(16)        // Implicit "pcx (indexed)".
      const indices = buffer.loop(pixelCount, buffer.uint8)
      const palette = buffer.loop(256, () => ({ r: buffer.uint8(), g: buffer.uint8(), b: buffer.uint8() }))
      palette[0]  = { r: 0, g: 0, b: 0, a: 0 }    // Transparency                 (0,255,255)
      for( const index of indices ){
         const { r, g, b, a = 255 } = palette[index]
         bitmap.setuint8(r, g, b, a)
      }
   }
   // 3 bytes per pixel, bgr bitmap.
   else if( pixelCount * 3 === size ){
      type = defineFileType(17)        // Implicit "pcx (bgr)".
      for( let i = 0; i < pixelCount; i++ ){
         const b = buffer.uint8()
         const g = buffer.uint8()
         const r = buffer.uint8()
         bitmap.setuint8(r, g, b, 255)
      }
   }
   else{
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


// options.palette
// options.format = "png" / "bitmap"
// options.padding = false / true

function unpackPCXFrame( buffer, { palette, format = "png", padding = false } ){

   if( format !== "png" && format !== "bitmap" )
      throw new Error("PCX output format not supported.")

   if( padding !== true && padding !== false )
      throw new Error('Padding must be a boolean.')


   const size        = buffer.uint32()      // Size in bytes (already read).
   const type        = defineFileType(18)   // Implicit "pcx (frame)".
   const compression = buffer.uint32()      // Type 1 (creatures), 2 (roads and rivers), 3 (everything else).
   const fullWidth   = buffer.uint32()      // Full width (same as .width in def header).
   const fullHeight  = buffer.uint32()      // Full height (same as .height in def header).
   const width       = buffer.uint32()      // Cropped width.
   const height      = buffer.uint32()      // Cropped height.
   const x           = buffer.uint32()      // Offset left, relative to full width.
   const y           = buffer.uint32()      // Offset top, relative to full height.


   // Image data.
   const indices = []
   const start = buffer.at
   const yellow = { r: 255, g: 255, b: 0 }

   // Type 0 is supposed to be a copy, but not a single file seems to use it? This will break if the number of 
   // arguments is too large.
   if( compression === 0 ){
      indices.push( ...buffer.loop(size, buffer.uint8) )
   }

   // Type 1 is used for creatures. It encodes offsets to rows of palette indices where each row contains a 
   // sequence of 2 byte pairs (index + length). If `index` is 0xFF, the following `length` bytes are raw palette 
   // indices, else they are filled with color at `index`.
   if( compression === 1 ){
      const offsets = buffer.loop(height, buffer.uint32)  // Scanline offsets.
      for( const offset of offsets ){
         buffer.seek(start + offset)

         let left = width                                 // Number of pixels left in scanline.
         do{
            const index  = buffer.uint8()
            const length = buffer.uint8() + 1
            indices.push( ...buffer.loop(length, index === 0xFF ? buffer.uint8 : index) )
            left -= length
         } while( left )
      }
   }

   // Type 2 is used for roads and rivers? It works in the same way as type 1, except that `index` + `length` are
   // encoded within a single byte (three bits for `index`, five for `length`).
   else if( compression === 2 ){
      const offsets = buffer.loop(height, buffer.uint16)  // Scanline offsets.
      buffer.skip(2)                                      // Two unknown bytes.
      for( const offset of offsets ){
         buffer.seek(start + offset)

         let left = width                                 // Number of pixels left in scanline.
         do{
            const byte    = buffer.uint8()
            const index   = byte >> 5
            const length  = (byte & 0x1F) + 1
            indices.push( ...buffer.loop(length, index === 0x7 ? buffer.uint8 : index) )
            left -= length
         } while( left )
      }
   }

   // Type 3 is used for everything else. It seems to encode `index` + `length` within a single byte, just like 
   // type 2, but how the offsets work is unclear to me.
   else if( compression === 3 ){
      const offsets = buffer.loop(height * width / 32, buffer.uint16)  // Scanline offsets.
      for( const offset of offsets ){
         buffer.seek(start + offset)

         let left = 32
         do{
            const byte    = buffer.uint8()
            const index   = byte >> 5
            const length  = (byte & 0x1F) + 1
            indices.push( ...buffer.loop(length, index === 0x7 ? buffer.uint8 : index) )
            left -= length
         } while( left )
      }
   }

   const image = {
      type,
      width,
      height,
      x,
      y,
   }

   // Store the pixel data in a RGBA/png ArrayBuffer.
   if( !padding ){

      const bitmap = new BufferView(width * height * 4)
      for( const index of indices ){
         const { r, g, b, a = 255 } = palette[index]
         bitmap.setuint8(r, g, b, a)
      }
      image.data = format === "bitmap" ? bitmap.buffer : upng.encode([bitmap.buffer], width, height, 0)

      if( !indices.includes(5) )
         return image


      const selection = new BufferView(width * height * 4)
      for( const index of indices ){
         const { r, g, b, a = 255 } = (index === 5 || index === 6 || index === 7) ? yellow : palette[0]
         selection.setuint8(r, g, b, a)
      }
      image.selection = format === "bitmap" ? selection.buffer : upng.encode([selection.buffer], width, height, 0)

   }
   else{

      const bitmap = new BufferView(fullWidth * fullHeight * 4)  // All values initialised to 0, which is exactly what we use for transparency.
      for( let i = 0; i < height; i++ ){
         bitmap.seek( ((y + i) * fullWidth + x) * 4 )
         for( let j = 0; j < width; j++ ){
            const index = indices[i * width + j]
            const { r, g, b, a = 255 } = palette[index]
            bitmap.setuint8(r, g, b, a)
         }
      }
      image.data = format === "bitmap" ? bitmap.buffer : upng.encode([bitmap.buffer], fullWidth, fullHeight, 0)

      if( !indices.includes(5) )
         return image


      const selection = new BufferView(fullWidth * fullHeight * 4)
      for( let i = 0; i < height; i++ ){
         selection.seek( ((y + i) * fullWidth + x) * 4 )
         for( let j = 0; j < width; j++ ){
            const index = indices[i * width + j]
            const { r, g, b, a = 255 } = (index === 5 || index === 6 || index === 7) ? yellow : palette[0]
            selection.setuint8(r, g, b, a)
         }
      }
      image.selection = format === "bitmap" ? selection.buffer : upng.encode([selection.buffer], fullWidth, fullHeight, 0)
      
   }

   return image

}


module.exports = unpackPCX









