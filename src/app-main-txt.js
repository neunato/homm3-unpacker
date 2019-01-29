
Vue.component("app-main-txt", {
   template:
     `<main class="txt" ref="main" @scroll="scrollTop = $event.target.scrollTop">
         <p>{{ text }}</p>
      </main>`,

   props: ["file"],

   data: () => ({
      scrollTop: 0
   }),

   activated() {
      this.$refs.main.scrollTop = this.scrollTop
   },

   computed: {
      text() {
         // Split into chunks due to number of parameters limit.
         const bytes = new Uint8Array(this.file)
         let result = ""
         for (let i = 0; i < bytes.length; i += 8192)
            result += String.fromCharCode(...bytes.slice(i, i + 8192))
         return result
      }
   }
})
