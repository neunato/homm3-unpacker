"use strict"

const BufferView                         = require("./BufferView")
const unpackPCX                          = require("./unpackPCX")
const { defineFileType, defineDEFGroup } = require("./types")


function unpackDEF( buffer, { pcx = { format: "png" } } = {} ){

   if( !(buffer instanceof BufferView) )
      buffer = new BufferView(buffer)


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

   if( pcx )
      pcx.palette = palette


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

         if( !images[name] ){
            if( pcx )
               images[name] = unpackPCX(new BufferView(buffer, offset, size), pcx)
            else
               images[name] = buffer.buffer.slice(offset, offset + size)
         }

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


module.exports = unpackDEF

