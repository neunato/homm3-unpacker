"use strict"

const BufferView                         = require("./BufferView")
const { defineFileType, defineDEFGroup } = require("./types")
const upng                               = require("upng-js")


function unpackDEF( buffer, options = {} ){

   if( !(buffer instanceof BufferView) )
      buffer = new BufferView(buffer)

   if( options.format === undefined )
      options.format = "png"
   
   if( options.padding === undefined )
      options.padding = false

   if( options.format !== "png" && options.format !== "bitmap" )
      throw new Error("DEF output format not supported.")

   if( options.padding !== true && options.padding !== false )
      throw new Error("Padding must be a boolean.")


   // Header.
   const type       = defineFileType(buffer.uint32())
   const fullWidth  = buffer.uint32()
   const fullHeight = buffer.uint32()

   const groupCount = buffer.uint32()
   const palette    = buffer.loop(256, () => ({ r: buffer.uint8(), g: buffer.uint8(), b: buffer.uint8(), a: 255 }))
   
   // Replace special colors in palette.
   palette[0]  = { r: 0, g: 0, b: 0, a: 0 }    // Transparency                 (0,255,255)
   palette[1]  = { r: 0, g: 0, b: 0, a: 64 }   // Shadow border                (255,150,255)
   palette[4]  = { r: 0, g: 0, b: 0, a: 128 }  // Shadow body                  (255,0,255)
   palette[5]  = { r: 0, g: 0, b: 0, a: 0 }    // Selection                    (255,255,0)
   palette[6]  = { r: 0, g: 0, b: 0, a: 128 }  // Selection over shadow body   (180,0,255)
   palette[7]  = { r: 0, g: 0, b: 0, a: 64 }   // Selection over shadow border (0,255,0)

   options.palette = palette

   // After the header, a sequence of animation groups follows. Each contains pointers to the actual images, which 
   // are immediately parsed and stored in `images`.
   let groups = {}
   let images = {}

   for( let i = 0; i < groupCount; i++ ){
      const group = defineDEFGroup(type, buffer.uint32())

      const frameCount = buffer.uint32()
      buffer.skip(8)                           // Unknown.

      // Names and offsets to images within the group.
      const names    = buffer.loop(frameCount, () => buffer.string(13).replace(/\0.*$/, ""))   // Null terminated.
      const offsets  = buffer.loop(frameCount, buffer.uint32)

      // Extract image buffer sizes.
      const at = buffer.at
      const sizes = offsets.map(offset => { buffer.seek(offset); return buffer.uint32() + 32 })
      buffer.seek(at)

      groups[group] = buffer.loop(frameCount, i => {
         const name   = names[i]
         const offset = offsets[i]
         const size   = sizes[i]

         if( !images[name] )
            images[name] = unpackFrame(new BufferView(buffer, offset, size), options)

         return name
      })
   }


   return {
      type,
      fullWidth,
      fullHeight,
      palette,
      groups,
      images
   }

}


function unpackFrame( buffer, { palette, format, padding } ){

   const size        = buffer.uint32()      // Size in bytes (already read).
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


module.exports = unpackDEF

