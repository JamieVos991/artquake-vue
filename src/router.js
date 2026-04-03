import { createRouter, createWebHistory } from 'vue-router'
import { auth } from './firebase' 
import { onAuthStateChanged } from "firebase/auth"

import Home from './views/home.vue'
const Organisatie = () => import('./views/organisatie.vue')
const Artiesten = () => import('./views/artiesten.vue')
const Crew = () => import('./views/crew.vue')
const Agenda = () => import('./views/agenda.vue')
const Activiteiten = () => import('./views/activiteiten.vue')
const Reserveren = () => import('./views/reserveren.vue')
const Login = () => import('./views/login.vue')
const Dashboard = () => import('./views/dashboard.vue')
const NotFoundPagina = () => import('./views/404.vue')

const routes = [
  { 
    path: '/', 
    name: 'Home', 
    component: Home 
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
    component: Login,
    meta: { guestOnly: true } 
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true } 
  },
  { 
    path: '/:pathMatch(.*)*', 
    name: 'NotFoundPagina', 
    component: NotFoundPagina 
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
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
  const user = await getCurrentUser();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isGuestOnly = to.matched.some(record => record.meta.guestOnly);

  if (requiresAuth && !user) {
    next('/login');
  } else if (isGuestOnly && user) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router