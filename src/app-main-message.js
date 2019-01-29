
Vue.component("app-main-message", {
   template: "<main class=\"message\" @click=\"$emit('click')\"><p>{{ message }}</p></main>",
   props: ["message"]
})
