"use strict"

const BufferView = require("./BufferView")
const { defineFileType } = require("./types")
const zlib = require("pako")


function unpackLOD(buffer, processor = (buffer) => buffer) {

   if (!(buffer instanceof BufferView))
      buffer = new BufferView(buffer)

   // Convert processor object to a function.
   if (typeof processor === "object") {
      const keys = Object.keys(processor)
      if (!keys.every((key) => typeof processor[key] === "function"))
         throw new Error("Invalid processor given.")

      const formats = keys.map((f) => ({ regex: new RegExp(`.${escapeRegExp(f)}$`, "i"), processor: processor[f] }))
      processor = function(buffer, name, skip) {
         for (const format of formats) {
            if (format.regex.test(name))
               return format.processor(buffer, name, skip)
         }
         return buffer
      }
   }

   if (typeof processor !== "function")
      throw new Error("Invalid processor given.")



   const magic = buffer.uint32()
   if (magic !== 0x00444F4C)
      throw new Error("Not a LOD file.")

   const type = defineFileType(buffer.uint32())    // File type (200 for base archives, 500 for expansion pack archives).

   const fileCount = buffer.uint32()
   if (fileCount > 10000)
      throw new Error("File limit exceeded.")

   buffer.skip(80)                                 // Unknown 80 bytes.

   // Next is a list of pointers to files.
   const files = {}

   // If `skip` is called from within a processor, the file is not kept.
   let keep
   function skip() {
      keep = false
   }

   for (let i = 0; i < fileCount; i++) {
      const name = buffer.string(16).replace(/\0.*$/, "")    // Null terminated file name.
      const offset = buffer.uint32()                         // Pointer to file data, header size included.
      const fullSize = buffer.uint32()                       // Uncompressed size.
      buffer.uint32()                                        // Game file type; assigned when parsing file.
      const size = buffer.uint32()                           // Compressed size.

      let raw
      if (size === 0)                                        // Uncompressed file.
         raw = buffer.buffer.slice(offset, offset + fullSize)
      else
         raw = zlib.inflate(new Uint8Array(buffer.buffer, offset, size)).buffer

      keep = true
      const result = processor(raw, name, skip)
      if (keep)
         files[name] = result
   }

   return {
      type,
      files
   }

}

function escapeRegExp(string) {

   return string.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")

}


module.exports = unpackLOD
