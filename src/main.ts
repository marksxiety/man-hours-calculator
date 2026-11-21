import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

async function bootstrap(): Promise<void> {
  if (import.meta.env.MODE === 'demo') {
    const { seedDemoData } = await import('./demo/seed')
    seedDemoData()
  }
  app.mount('#app')
}

void bootstrap()
