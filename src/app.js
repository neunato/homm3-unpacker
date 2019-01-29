
new Vue({
   el: "#root",

   template:
     `<div id="root" :class="{ dragging, splash: !tabs.length }" @drop.prevent="onDrop($event)" @dragover.prevent @dragenter="dragCounter++" @dragleave="dragCounter--">

         <header>
            <h1>HOMM3 UNPACKER</h1>
            <template v-if="activeTab">
               <h2>{{ activeTab.name }}</h2>
               <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" @click="removeTab(activeTab)"><title>Close</title><path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm0 10.293l5.293-5.293.707.707-5.293 5.293 5.293 5.293-.707.707-5.293-5.293-5.293 5.293-.707-.707 5.293-5.293-5.293-5.293.707-.707 5.293 5.293z"/></svg>
               <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" @click="download(activeTab.name, activeTab.buffer)"><title>Download</title><path d="M16.965 2.381c3.593 1.946 6.035 5.749 6.035 10.119 0 6.347-5.153 11.5-11.5 11.5s-11.5-5.153-11.5-11.5c0-4.37 2.442-8.173 6.035-10.119l.608.809c-3.353 1.755-5.643 5.267-5.643 9.31 0 5.795 4.705 10.5 10.5 10.5s10.5-4.705 10.5-10.5c0-4.043-2.29-7.555-5.643-9.31l.608-.809zm-4.965-2.381v14.826l3.747-4.604.753.666-5 6.112-5-6.101.737-.679 3.763 4.608v-14.828h1z"/></svg>
            </template>
         </header>

         <nav v-show="tabs.length">
            <div id="tabs" ref="tabs">
               <ol>
                  <li v-for="tab of tabs" :class="{ active: tab === activeTab }" @click.stop="openTab(tab)" >{{ tab.name }}<span class="close" @click.stop="removeTab(tab)">&#x2716;</span></li>
               </ol>
            </div>
            <span id="upload-button" @click="selectFiles" title="Upload files"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M11.5 0c6.347 0 11.5 5.153 11.5 11.5s-5.153 11.5-11.5 11.5-11.5-5.153-11.5-11.5 5.153-11.5 11.5-11.5zm0 1c5.795 0 10.5 4.705 10.5 10.5s-4.705 10.5-10.5 10.5-10.5-4.705-10.5-10.5 4.705-10.5 10.5-10.5zm.5 10h6v1h-6v6h-1v-6h-6v-1h6v-6h1v6z"/></svg></span>
         </nav>
         
         <keep-alive>
            <app-main-message v-if="!activeTab && !tabs.length" message="Select or drop game files (lod, def, pcx, txt)" @click="selectFiles" class="clickable"></app-main-message>
            <app-main-message v-else-if="activeTab.error" message="Unexpected error"></app-main-message>
            <app-main-message v-else-if="!activeTab.file" message="Loading..."></app-main-message>
            <component v-else :is="'app-main-' + activeTab.type" :file="activeTab.file" @add-file="addTab(...arguments)" :key="activeTab.name"></component>
         </keep-alive>

         <a id="github-link" href="https://github.com/independentgeorge/homm3-unpacker" title="View on GitHub"><svg version="1.1" width="20" height="20" viewBox="0 0 16 16" class="octicon octicon-mark-github" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg></a>

         <transition name="disappear">
            <div v-if="note" id="note"><p>{{ this.note }}</p></div>
         </transition>

         <input type="file" ref="file-upload" class="hidden" @change="onSelectFiles" multiple>

         <div id="small-screen-message" class="message"><p>Screen too small</p></div>

      </div>`,

   data: {
      activeTab: null,          // Currently open tab.
      tabs: [],                 // All added tabs.
      note: null,               // Briefly shown message.
      dragCounter: 0            // Used to detect file dragging.
   },

   mounted() {
      OverlayScrollbars(this.$refs.tabs, { overflowBehavior: { x: "hidden" } })   // eslint-disable-line new-cap
      document.addEventListener("drop", (e) => e.preventDefault())
      document.addEventListener("keydown", (e) => {
         if (e.key === "Escape" && this.activeTab)
            this.removeTab(this.activeTab)
      })
   },

   computed: {
      dragging() {
         return this.dragCounter > 0
      }
   },

   methods: {
      openTab(tab) {
         this.activeTab = tab
      },

      addTab(name, buffer) {
         const existing = this.tabs.find((tab) => tab.name === name)
         if (existing) {
            this.openTab(existing)
            return
         }

         const type = name.slice((name.lastIndexOf(".") + 1) || name.length).toLowerCase()
         if (!["lod", "def", "pcx", "txt"].includes(type)) {
            this.note = "File not supported"
            Vue.nextTick(() => (this.note = null))
            return
         }

         const tab = {
            name,
            type,
            buffer,
            file: null,
            error: null
         }
         this.tabs.push(tab)
         this.openTab(tab)

         const worker = this.createWorker(({ data: [type, buffer] }) => {
            const { unpackLOD, unpackDEF, unpackPCX } = self["homm3-unpacker"]
            let data
            let transfer = []
            if (type === "lod") {
               data = unpackLOD(buffer)
               transfer = Object.values(data.files)
            }
            else if (type === "def") {
               data = unpackDEF(buffer, { format: "bitmap", padding: false })
               const images = Object.values(data.images)
               transfer = [...images.map(({ data }) => data), ...images.filter(({ selection }) => selection).map(({ selection }) => selection)]
            }
            else if (type === "pcx") {
               data = unpackPCX(buffer, { format: "bitmap", padding: false })
               transfer = data.selection ? [data.data, data.selection] : [data.data]
            }
            else {
               data = buffer
            }
            self.postMessage(data, transfer)
         }, ["https://cdn.jsdelivr.net/npm/homm3-unpacker@0.3.0/dist/homm3-unpacker.js"])

         worker.onmessage = (e) => { tab.file = e.data }
         worker.onerror = (e) => { tab.error = true }
         worker.postMessage([type, buffer], [buffer])
      },

      download(name, buffer) {
         const a = document.createElement("a")
         document.body.appendChild(a)
         a.href = window.URL.createObjectURL(new Blob([buffer]))
         a.download = name
         a.click()
         document.body.removeChild(a)
      },

      removeTab(tab) {
         const i = this.tabs.indexOf(tab)
         this.tabs.splice(i, 1)

         if (tab === this.activeTab)
            this.openTab(this.tabs[i] || this.tabs[i - 1] || null)
      },

      openFiles(files) {
         for (const file of files) {
            const reader = new FileReader()
            reader.onload = (e) => this.addTab(file.name, e.target.result)
            reader.readAsArrayBuffer(file)
         }
      },

      selectFiles() {
         this.$refs["file-upload"].click()
      },

      onSelectFiles(event) {
         this.openFiles(event.target.files)
         event.target.value = null
      },

      onDrop(event) {
         this.openFiles(event.dataTransfer.files)
         this.dragCounter = 0
      },

      createWorker(onmessage, scripts) {
         const parts = []
         if (scripts)
            parts.push("self.importScripts(" + scripts.map((s) => `"${s}"`).join(", ") + ")\n")
         parts.push("self.onmessage = " + onmessage.toString())
         return new Worker(URL.createObjectURL(new Blob(parts, { type: 'text/javascript' })))
      }
   }
})
