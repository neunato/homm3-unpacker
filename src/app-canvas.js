
Vue.component("app-canvas", {
   template:
     `<section class="canvas">
         <canvas ref="canvas"></canvas>
         <span class="scale">{{ scale }}x</span>
      </section>`,

   props: ["box", "activeFrames"],

   data: () => ({
      context: null,
      width: null,
      height: null,
      running: null,
      scale: 2,                // Square pixels per .pcx pixel.
      fpaf: 8,                 // Frames per animation frame.
      image: null              // Currently drawn frame.
   }),

   activated() {
      this.start()
   },

   deactivated() {
      this.stop()
   },

   mounted() {
      const { canvas } = this.$refs
      this.context = canvas.getContext("2d")

      window.addEventListener("resize", () => {
         if (!this.image)
            return

         canvas.width = canvas.clientWidth
         canvas.height = canvas.clientHeight
         this.width = canvas.width
         this.height = canvas.height

         this.rescale(this.scale)
         this.draw(this.image)
      })

      canvas.addEventListener("wheel", (e) => {
         if (e.deltaY < 0)
            this.rescale(this.scale + 1)
         else
            this.rescale(this.scale - 1)
      })
   },

   computed: {
      maxScale() {
         return Math.floor(Math.min(this.width / (this.box.width + 2), this.height / (this.box.height + 2)))
      }
   },

   watch: {
      activeFrames() {
         this.start()
      }
   },

   methods: {
      start() {
         // Stop previous animation.
         this.stop()

         const { canvas } = this.context
         canvas.width = canvas.clientWidth
         canvas.height = canvas.clientHeight
         this.width = canvas.width
         this.height = canvas.height

         this.rescale(this.scale)

         // Start drawing (single image or animation).
         if (this.activeFrames.length === 1)
            this.draw(this.activeFrames[0])
         else
            this.animate(this.activeFrames)
      },

      stop() {
         this.image = null
         if (this.running) {
            window.cancelAnimationFrame(this.running)
            this.running = null
         }
      },

      rescale(value) {
         value = Math.max(1, Math.min(this.maxScale, value))
         if (value === this.scale)
            return
         this.scale = value
         this.draw(this.image)
      },

      animate(images, at = 0) {
         const { fpaf } = this
         if (at % fpaf === 0) {
            if (at / fpaf === images.length)
               at = 0
            this.draw(images[at / fpaf])
         }

         this.running = window.requestAnimationFrame(() => this.animate(images, at + 1))
      },

      draw(image) {
         if (!image)
            return

         this.clear()
         this.image = image

         const { context } = this
         const { box } = this
         const { scale } = this

         const rows = context.canvas.height / scale
         const cols = context.canvas.width / scale
         const row = Math.floor((rows / 2) - (box.height / 2) + (image.y || 0) - box.y)
         const col = Math.floor((cols / 2) - (box.width / 2) + (image.x || 0) - box.x)

         const view = new Uint8Array(image.data)

         let i = 0
         while (i < view.byteLength) {
            const r = view[i++]
            const g = view[i++]
            const b = view[i++]
            const a = view[i++]
            context.fillStyle = `rgba(${r},${g},${b},${a / 255})`

            const at = (i / 4) - 1
            const x = col + (at % image.width)
            const y = row + Math.floor(at / image.width)
            context.fillRect(x * scale, y * scale, scale, scale)
         }
      },

      clear() {
         const { width, height } = this.context.canvas
         this.context.clearRect(0, 0, width, height)
      }

   }

})
