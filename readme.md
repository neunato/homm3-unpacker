# homm3 unpacker

Parse file formats used by Heroes of Might and Magic III in node.js or modern browsers.


-----

_If there is any interest in the modding community (to say, edit files in browser), I can easily make repacking `DEF`s/`LOD`s possible._

_If anyone is in need of parsing some other file type (`H3M`, `H3C`, `SND`, `VID`…) feel free to open an issue and I'll see what I can do._


## API

All functions expect the binary data of a file (__`buffer`__ parameter) in form of an `ArrayBuffer` or node.js `Buffer`.


### unpackLOD( buffer, options )

Parse .LOD archive files.

__`options.def`__ &raquo; options passed to `unpackDEF` or `false` to keep the def's source data. Defaults to `false`.

__`options.pcx`__ &raquo; options passed to `unpackPCX` or `false` to keep the image's source data. Defaults to `{ format: "png" }`.

-----

### unpackDEF( buffer, options )

Parse .DEF animation files.

__`options.pcx`__ &raquo; options passed to `unpackPCX` or `false` to keep the image's source data. Defaults to `{ format: "png" }`

-----

### unpackPCX( buffer, options )

Parse .PCX standalone images or .DEF animation frames.

__`options.palette`__ &raquo; external palette; file parsed as animation frame if present.

__`options.format`__ &raquo; format to encode the image data to; `"png"`/`"bitmap"`. Defaults to `"png"`.

__`options.padding`__ &raquo; include padding around animation frame. Defaults to `false`. No effect on standalones.

_Note: converting a large number of images to png can take a long time._

-----



## Examples

```javascript
const fs = require("fs")
const { unpackLOD, unpackDEF, unpackPCX } = require("homm3-unpacker")
```

```javascript
const buffer  = fs.readFileSync("H3ab_spr.lod")
const options = { pcx: { format: "png" } }
const lod     = unpackLOD(buffer, options)

// lod = {
//    type: "lod (expansion)",
//    files: {
//       "ab.h3c": ArrayBuffer,             // Raw file.
//       "AdvEvent.txt": ArrayBuffer,
//       "Ar_Bg.pcx": {
//          type: "pcx (rgb)",
//          data: ArrayBuffer               // PNG image.
//       },
//       …
//    }
// }
```

```javascript
const buffer  = fs.readFileSync("CABEHE.def")
const options = { pcx: { format: "png", padding: true } }
const def     = unpackDEF(buffer, options)

// def = {
//    type: "def (creature)",
//    fullWidth: 450,
//    fullHeight: 400,
//    palette: [                            // 256 rgba colors.
//       { r: 0, g: 0, b: 0, a: 0 },
//       { r: 0, g: 0, b: 0, a: 64 },
//       { r: 255, g: 100, b: 255, a: 0 },
//       …
//    ],
//    groups: [
//       "moving": ["CAbehe10.pcx", "CAbehe11.pcx", "CAbehe12.pcx", "CAbehe13.pcx", "CAbehe14.pcx", …],
//       "mouse over": ["CAbehe01.pcx", "CAbehe05.pcx", "CAbehe06.pcx", "CAbehe07.pcx", "CAbehe08.pcx", …]
//       …
//    ],
//    images: {
//       "CAbehe10.pcx": {
//          width: 116,
//          height: 110,
//          x: 173,
//          y: 158,
//          data: ArrayBuffer               // PNG image.
//       },
//       "CAbehe01.pcx": {
//          width: 88,
//          height: 106,
//          x: 174,
//          y: 165,
//          data: ArrayBuffer,
//          selection: ArrayBuffer          // Selections extracted into separate images.
//       },
//       …
//    }
// }
```