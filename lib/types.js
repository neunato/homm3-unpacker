"use strict"


const fileTypes = {
   1: "h3m",
   2: "txt",
   16: "pcx (indexed)",
   17: "pcx (bgr)",
   64: "def (spell)",
   65: "def (spritedef)",             // ???
   66: "def (creature)",
   67: "def (adventure object)",
   68: "def (adventure hero)",
   69: "def (terrain)",
   70: "def (cursor)",
   71: "def (interface)",             // Interface buttons and town screen buildings.
   72: "def (sprite frame)",          // ???
   73: "def (combat hero)",
   79: "msk",
   80: "fnt",
   96: "pal",
   200: "lod (vanilla)",
   500: "lod (expansion)"
}

const defGroups = {

   "def (creature)": {
      0: "moving",
      1: "mouse over",
      2: "standing",
      3: "getting hit",
      4: "defend",
      5: "death",
      6: "???",
      7: "turn left",
      8: "turn right",
      9: "turn left",               // Twice???
      10: "turn right",             // Twice???
      11: "attack up",
      12: "attack straight",
      13: "attack down",
      14: "shoot up",
      15: "shoot straight",
      16: "shoot down",
      17: "hex attack up",          // ???
      18: "hex attack straight",    // ???
      19: "hex attack down",        // ???
      20: "start moving",
      21: "stop moving"
   },

   "def (adventure hero)": {
      0: "turn north",
      1: "turn northeast",
      2: "turn east",
      3: "turn southeast",
      4: "turn south",
      5: "move north",
      6: "move northeast",
      7: "move east",
      8: "move southeast",
      9: "move south"
   },

   "def (combat hero)": {
      0: "standing",
      1: "standing",
      2: "failure",
      3: "success",
      4: "spellcasting"
   }

}

function defineFileType(type) {

   const result = fileTypes[type]
   if (!result)
      throw new Error("Unknown file type.")
   return result

}

function defineDEFGroup(defType, type) {

   if (!defGroups[defType]) {
      if (type === 0)
         return "all"
      throw new Error("Unknown animation type.")
   }

   const result = defGroups[defType][type]
   if (!result)
      throw new Error("Unknown animation type.")
   return result

}


module.exports = {
   defineFileType,
   defineDEFGroup
}
