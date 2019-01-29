
Vue.component("app-main-lod", {
   template:
     `<main class="lod" ref="main" @scroll="scrollTop = $event.target.scrollTop">
         <ol id="lod-types"><li v-for="(ext, i) of extensions"><input type="checkbox" :id="'type' + (i + 1)" :value="ext" v-model="checkboxes"><label :for="'type' + (i + 1)">.{{ ext }}</label></li></ol>
         <ol id="lod-files"><li v-for="({name, buffer, ext}) of files" v-show="selectedExtensions[ext]" @click="$emit('add-file', name, buffer)">{{ name }}</li></ol>
      </main>`,

   props: ["file"],

   data: () => ({
      scrollTop: 0,
      checkboxes: []
   }),

   computed: {
      files() {
         return Object.entries(this.file.files).map(([name, buffer]) => ({
            name,
            buffer,
            ext: name.slice((name.lastIndexOf(".") + 1) || name.length).toLowerCase()
         }))
      },

      extensions() {
         const extensions = [...new Set(this.files.map(({ ext }) => ext))]
         this.checkboxes = extensions
         return extensions
      },

      selectedExtensions() {
         return this.extensions.reduce((r, c) => (r[c] = this.checkboxes.includes(c), r), {})    // eslint-disable-line no-return-assign, no-sequences
      }
   },

   activated() {
      this.$refs.main.scrollTop = this.scrollTop
   }
})
