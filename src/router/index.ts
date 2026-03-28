import { createRouter, createWebHistory } from 'vue-router'
import Home from '../Home.vue'
import Demo from '../Demo.vue'
import ProjectsList from '../ProjectsList.vue'
import NotFound from '../NotFound.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/projects',
      component: ProjectsList
    },
    {
      path: '/demo/:id',
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
