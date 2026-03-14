import { createRouter, createWebHistory } from 'vue-router'
import Home from '../Home.vue'
import Demo from '../Demo.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/demo',
      component: Demo
    }
  ]
})

export default router
