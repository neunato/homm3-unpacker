import resolve  from "rollup-plugin-node-resolve"
import cjs      from "rollup-plugin-commonjs"
import {terser} from "rollup-plugin-terser"

export default {
   input: "lib/index.js",
   output: {
      file: "dist/homm3-unpacker.js",
      name: "homm3-unpacker",
      format: "iife",
      extend: true,
      exports: "named"
   },
   plugins: [resolve(), cjs(), terser()]
}
