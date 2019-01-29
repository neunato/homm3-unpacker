
const fs = require("fs")

function css (contents, file) {
   return contents.toString().replace("<<< CSS >>>", fs.readFileSync("src/css.css", "utf8"))
}

function js (contents) {
   const files = [
      "app-main-def.js",
      "app-main-lod.js",
      "app-main-pcx.js",
      "app-main-message.js",
      "app-main-txt.js",
      "app-canvas.js",
      "app.js"
   ]
   return contents.toString().replace("<<< JS >>>", files.map(filename => fs.readFileSync(`src/${filename}`), "utf8").join("\n\n"))
}

const configuration = {
   template: {
      base: "src/"
   },
   tasks: {
      "build": {
         watch: "src/",
         src: "src/index.html",
         transforms: [css, js]
      },
      "default": {
         series: ["build", "watch"]
      }
   }
}

require("glupost")(configuration)