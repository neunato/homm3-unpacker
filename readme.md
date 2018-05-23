# homm3 unpacker

Parse file formats used by Heroes of Might and Magic III in node.js or modern browsers.


-----

_If there is any interest in the modding community (to say, edit files in browser), I can easily make `DEF`s/`LOD`s repackable._

_If anyone is in need of parsing some other file type (`H3M`, `H3C`, `SND`, `VID`…) feel free to open an issue and I'll see what I can do._


## API

All functions expect the binary data of a file (__`buffer`__ parameter) in form of an `ArrayBuffer` or node.js `Buffer`.


### unpackLOD( buffer, processor )

Parse .LOD archive files.

__`processor`__ &raquo; function to process extracted binary data or object with processors for specific file formats - function/object - defaults to `(buffer, filename) => buffer`.


```javascript
// Returns something like
{
   type: "lod (expansion)",
   files: {
      "ab.h3c": ArrayBuffer,
      "AdvEvent.txt": ArrayBuffer,
      "Ar_Bg.pcx": ArrayBuffer,
      …
   }
}
```

### unpackDEF( buffer, options )

Parse .DEF animation files.

__`options.format`__ &raquo; format to encode image data to - `"png"`/`"bitmap"` - defaults to `"png"`.

__`options.padding`__ &raquo; include padding around images - boolean - defaults to `false`.

```javascript
// Returns something like
{
   type: "def (creature)",
   fullWidth: 450,
   fullHeight: 400,
   palette: [                             // 256 rgba colors.
      { r: 0, g: 0, b: 0, a: 0 },
      { r: 0, g: 0, b: 0, a: 64 },
      { r: 255, g: 100, b: 255, a: 0 },
      …
   ],
   groups: [
      "moving": ["CAbehe10.pcx", "CAbehe11.pcx", "CAbehe12.pcx", "CAbehe13.pcx", "CAbehe14.pcx", …],
      "mouse over": ["CAbehe01.pcx", "CAbehe05.pcx", "CAbehe06.pcx", "CAbehe07.pcx", "CAbehe08.pcx", …]
      …
   ],
   images: {
      "CAbehe10.pcx": {
         width: 116,
         height: 110,
         x: 173,
         y: 158,
         data: ArrayBuffer                // PNG file.
      },
      "CAbehe01.pcx": {
         width: 88,
         height: 106,
         x: 174,
         y: 165,
         data: ArrayBuffer,
         selection: ArrayBuffer           // Selection extracted into separate PNG.
      },
      …
   }
}
```


### unpackPCX( buffer, options )

Parse .PCX images.

__`options.format`__ &raquo; format to encode image data to - `"png"`/`"bitmap"` - defaults to `"png"`.

```javascript
// Returns something like
{
   type: "pcx (indexed)",
   width: 58,
   height: 64,
   data: ArrayBuffer                      // PNG file.
}
```
_Note: not to be confused with PCX images in DEFs._



## Examples

Reading/writing to files with the help of these two.

```javascript
const fs = require("graceful-fs")                     // So we don't care about the number of open files.

function read( path ){
   return new Promise(function(resolve){
      fs.readFile(path, function(error, data){
         if( error )
            throw new Error(`Error reading ${path}.`)
         resolve(data)
      })
   })
}

function write( path, buffer ){
   return new Promise(function(resolve){
      fs.writeFile(path, Buffer.from(buffer), function(error){
         if( error )
            throw new Error(`Error writing ${path}.`)
         resolve(buffer)
      })
   })
}
```

Unpack all files from a LOD and keep them in memory. Without a second parameter, the extracted files are stored as binary data in the `.files` dictionary object under their filenames.

```javascript
async function example1( path ){
   const file = await read(path)
   return unpackLOD(file)
}
```

Previous example is equivalent to the following when a processor function is supplied as the second parameter. The callback is invoked with `(buffer, filename)` for every file and its return value is stored under the value in `.files` dictionary.

```javascript
async function example2( path ){
   const file = await read(path)
   return unpackLOD(file, buffer => buffer)
}
```


When passing an object as the second parameter, its keys are matched against the file extension (case insensitively), and the callback's return value is stored instead of raw binary data. The following will parse all DEF files with `unpackDEF` and store any other file as `ArrayBuffer`.

```javascript
async function example3( path ){
   const file = await read(path)
   return unpackLOD(file, {
      def: buffer => unpackDEF(buffer)
   })
}

// Equivalent to this.
async function example4( path ){
   const file = await read(path)
   return unpackLOD(file, (buffer, filename) => /\.def$/i.test(filename) ? unpackDEF(buffer) : buffer)
}
```


Unpacking images from large LODs can take several minutes. It's nice to get some feedback while running - the following logs the completion of each parsed DEF.

```javascript
async function example5( path ){
   const file = await read(path)
   return unpackLOD(file, {
      def: (buffer, filename) => {
         const result = unpackDEF(buffer)
         console.log(`Unpacked "${filename}.`)
         return result
      }
   })
}
```


To extract files archived in a LOD into separate files.

```javascript
// Extract while parsing.
async function example6( path ){
   const file = await read(path)
   unpackLOD(file, (buffer, filename) => { write(filename, buffer) })
}

// Extract after parsing.
async function example7( path ){
   const file = await read(path)
   const lod = unpackLOD(file)
   for( const [filename, buffer] of Object.entries(lod.files) )
      write(filename, buffer)
}
```


The following would extract every image in a LOD (animation frames and standalone images) as a PNG file.

```javascript
async function example8( path ){
   const file = await read(path)
   const lod = unpackLOD(file, {
      def: (buffer, filename){
         const def = unpackDEF(buffer, { format: "png", padding: true })
         for( const [filename, image] of Object.entries(lod.files) ){
            write(filename, image.data)
            if( image.selection )
               write(filename, image.selection)
         }
      },
      pcx: (buffer, filename){
         const image = unpackPCX(buffer, { format: "png" })
         write(filename, image.data)
      }
   })
}
```