
Vue.component("app-main-pcx", {
   template:
     `<main class="pcx">
         <app-canvas :activeFrames="[file]" :box="box"></app-canvas>
      </main>`,

   props: ["file"],

   computed: {
      box() {
         return {
            x: 0,
            y: 0,
            width: this.file.width,
            height: this.file.height
         }
      }
   }
})
