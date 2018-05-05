
import resolve from "rollup-plugin-node-resolve"
import cjs     from "rollup-plugin-commonjs"
import uglify  from "rollup-plugin-uglify"

export default {
   input: "lib/index.js",
   output: {
      file: "dist/homm3-unpacker.js",
      name: "homm3-unpacker",
      format: "iife",
      extend: true
   },
   plugins: [resolve(), cjs(), uglify()]
}