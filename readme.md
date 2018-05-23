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