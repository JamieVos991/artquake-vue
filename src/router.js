import { createRouter, createWebHistory } from 'vue-router'
import { auth } from './firebase' // Let op: zorg dat dit pad naar je firebase config wijst!
import { onAuthStateChanged } from "firebase/auth"

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
import Contact from './views/contact.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/organisatie', name: 'Organisatie', component: Organisatie },
  { path: '/artiesten', name: 'Artiesten', component: Artiesten },
  { path: '/crew', name: 'Crew', component: Crew },
  { path: '/agenda', name: 'Agenda', component: Agenda },
  { path: '/activiteiten', name: 'Activiteiten', component: Activiteiten },
  { path: '/reserveren', name: 'Reserveren', component: Reserveren },
  { path: '/login', name: 'Login', component: Login },
  { path: '/contact', name: 'Contact', component: Contact},
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true } // Beveiligd!
  },
  { path: '/:pathMatch(.*)*', name: 'NotFoundPagina', component: NotFoundPagina },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      auth,
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const user = await getCurrentUser();
    if (user) {
      next(); 
    } else {
      next('/login'); 
    }
  } else {
    next(); 
  }
});

export default router