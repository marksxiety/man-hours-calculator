import { createRouter, createWebHistory } from 'vue-router'
import Home from '../Home.vue'
import Demo from '../Demo.vue'
import NotFound from '../NotFound.vue'

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
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})

export default router
