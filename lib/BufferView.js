"use strict"


// DataView wrapper exposing typed array views, while keeping some internal state. Sets LE wherever applicable.

class BufferView {

   constructor(buffer, offset = 0, length) {

      // Reuse buffer from DataView/TypedArray/BufferView/node Buffer.
      if (buffer.buffer)
         ({ buffer } = buffer)

      if (typeof buffer === "number")
         buffer = new ArrayBuffer(buffer)

      if (!(buffer instanceof ArrayBuffer))
         throw new Error("ArrayBuffer/Buffer/DataView expected.")

      if (!length || offset + length > buffer.byteLength)
         length = buffer.byteLength - offset

      this.buffer = buffer
      this.view = new DataView(buffer, offset, length)
      this.at = 0
      this.length = length

   }

   uint32() {

      const int = this.view.getUint32(this.at, true)
      this.at += 4
      return int

   }

   uint16() {

      const int = this.view.getUint16(this.at, true)
      this.at += 2
      return int
   }

   uint8() {

      return this.view.getUint8(this.at++)

   }

   string(bytes = 1) {

      let result = ""
      for (let i = 0; i < bytes; i++)
         result += String.fromCharCode(this.view.getUint8(this.at++))
      return result

   }

   skip(bytes = 1) {

      this.at += bytes

   }

   seek(offset) {

      this.at = offset

   }

   loop(times, what) {

      if (typeof what !== "function")
         return Array(times).fill(what)

      const result = []
      for (let i = 0; i < times; i++)
         result.push(what.call(this, i))
      return result

   }

   setbuffer(...args) {

      for (const buffer of args) {
         const view = new BufferView(buffer)
         for (let i = 0; i < buffer.byteLength; i++)
            this.view.setUint8(this.at++, view.uint8())
      }

   }

   setstring(...args) {

      for (const string of args) {
         for (let i = 0; i < string.length; i++)
            this.view.setUint8(this.at++, string.charCodeAt(i))
      }

   }

   setuint8(...args) {

      for (const value of args)
         this.view.setUint8(this.at++, value)

   }

   setuint16(...args) {

      for (const value of args) {
         this.view.setUint16(this.at, value, true)
         this.at += 2
      }

   }

   setuint32(...args) {

      for (const value of args) {
         this.view.setUint32(this.at, value, true)
         this.at += 4
      }

   }

}

module.exports = BufferView
