
Vue.component("app-main-def", {
   template:
      `<main class="def">
         <dl class="def-groups" ref="nav" @scroll="scrollTop = $event.target.scrollTop">
            <template v-for="(group, name) of file.groups">
               <dt :class="{ selected: selected === group }" @click="selected = group">
                  {{ name }}<span class="toggle" @click.stop="collapsed[name] = !collapsed[name]">{{ collapsed[name] ? "&#x2795;" : "  &#x2796;" }}</span>
               </dt>
               <dd v-show="!collapsed[name]">
                  <ol><li v-for="filename of group" :class="{ selected: selected === filename }" @click="selected = filename">{{ filename }}</li></ol>
               </dd>
            </template>
         </dl>
      <app-canvas :activeFrames="activeFrames" :box="box"></app-canvas>
      </main>`,

   props: ["file"],

   data: ({ file }) => ({
      selected: file.groups[Object.keys(file.groups)[0]],
      collapsed: Object.keys(file.groups).reduce((r, n) => (r[n] = true, r), {}),        // eslint-disable-line no-return-assign, no-sequences
      scrollTop: 0
   }),

   activated() {
      this.$refs.nav.scrollTop = this.scrollTop
   },

   mounted() {
      OverlayScrollbars(this.$refs.nav, { overflowBehavior: { x: "hidden" } })           // eslint-disable-line new-cap
   },

   computed: {
      activeFrames() {
         if (!this.selected)
            return null

         const { images } = this.file
         if (typeof this.selected === "string")
            return [images[this.selected]]
         else
            return this.selected.map((name) => images[name])
      },

      // Drawing "box" for centering; all images considered.
      box() {
         let top = Infinity
         let left = Infinity
         let bottom = 0
         let right = 0

         const names = Object.keys(this.file.images)
         for (const name of names) {
            const image = this.file.images[name]
            if (image.y < top)
               top = image.y
            if (image.y + image.height > bottom)
               bottom = image.y + image.height
            if (image.x < left)
               left = image.x
            if (image.x + image.width > right)
               right = image.x + image.width
         }

         return {
            x: left,
            y: top,
            width: right - left,
            height: bottom - top
         }
      }
   }
})
