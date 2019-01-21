
import resolve from "rollup-plugin-node-resolve"
import cjs     from "rollup-plugin-commonjs"
import minify  from "rollup-plugin-babel-minify"

export default {
   input: "lib/index.js",
   output: {
      file: "dist/homm3-unpacker.js",
      name: "homm3-unpacker",
      format: "iife",
      extend: true
   },
   plugins: [resolve(), cjs(), minify({ comments: false })]
}