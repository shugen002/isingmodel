import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './route'
import App from './App.vue'

const router = createRouter({
  routes,
  history: createWebHashHistory()
})

createApp(App).use(router).mount('#app')
