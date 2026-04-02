import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/home.vue'
import Organisatie from './views/organisatie.vue'
import Crew from './views/crew.vue'
import Reserveren from './views/reserveren.vue'
import Agenda from './views/agenda.vue'
import Activiteiten from './views/activiteiten.vue'
import NotFoundPagina from './views/404.vue'
import Login from './views/login.vue'
import Dashboard from './views/dashboard.vue'
import Artiesten from './views/artiesten.vue'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFoundPagina',
    component: NotFoundPagina
  },
  {
    path: '/organisatie',
    name: 'Organisatie',
    component: Organisatie
  },
  {
    path: '/artiesten',
    name: 'Artiesten',
    component: Artiesten
  },
  {
    path: '/crew',
    name: 'Crew',
    component: Crew
  },
  {
    path: '/agenda',
    name: 'Agenda',
    component: Agenda
  },
  {
    path: '/activiteiten',
    name: 'Activiteiten',
    component: Activiteiten
  },
  {
    path: '/reserveren',
    name: 'Reserveren',
    component: Reserveren
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router