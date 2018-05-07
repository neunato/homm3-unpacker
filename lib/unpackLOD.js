"use strict"

const BufferView         = require("./BufferView")
const unpackDEF          = require("./unpackDEF")
const unpackPCX          = require("./unpackPCX")
const { defineFileType } = require("./types")
const zlib               = require("pako")


// By default, pcx images are parsed, and defs are not.

function unpackLOD( buffer, { pcx = true, def = true } = {} ){

   if( !(buffer instanceof BufferView) )
      buffer = new BufferView(buffer)

   if( pcx === true )
      pcx = {}

   if( def === true )
      def = {}

   const magic = buffer.uint32()
   if( magic !== 0x00444F4C )
      throw new Error("Not a LOD file.")

   const type = defineFileType(buffer.uint32())    // File type (200 for base archives, 500 for expansion pack archives).

   const fileCount = buffer.uint32()
   if( fileCount > 10000 )
      throw new Error("File limit exceeded.")

   buffer.skip(80)                                 // Unknown 80 bytes.

   // Next is a list of pointers to files.
   const files = {}

   for( let i = 0; i < fileCount; i++ ){
      const name     = buffer.string(16).replace(/\0.*$/, "")  // Null terminated file name.
      const offset   = buffer.uint32()                         // Pointer to file data, header size included.
      const fullSize = buffer.uint32()                         // Uncompressed size.
      buffer.uint32()                                          // Game file type; assigned when parsing file.
      const size     = buffer.uint32()                         // Compressed size.

      let raw
      if( size === 0 )                            // Uncompressed file.
         raw = buffer.buffer.slice(offset, offset + fullSize)
      else
         raw = zlib.inflate(new Uint8Array(buffer.buffer, offset, size)).buffer

      let file
      if( pcx && /\.pcx$/i.test(name) )           // PCX (standalone) image.
         file = unpackPCX(raw, pcx)
      else if( def && /\.def$/i.test(name) )      // DEF file.
         file = unpackDEF(raw, def)
      else
         file = raw

      files[name] = file
   }

   return {
      type,
      files
   }

}


module.exports = unpackLOD









