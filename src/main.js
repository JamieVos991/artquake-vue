import './assets/stylesheets/styleguide.css'
import './assets/stylesheets/animations.css'

import router from './router'

import { createApp } from 'vue'
import App from './app.vue'

createApp(App)
  .use(router)
  .mount('#app')