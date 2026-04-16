import { createRouter, createWebHashHistory } from 'vue-router'
import { auth } from './firebase' 
import { onAuthStateChanged } from "firebase/auth"

// Importeer je views
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
import Privacypolicy from './views/privacypolicy.vue'
import Termsandconditions from './views/termsandconditions.vue'

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
  { path: '/privacypolicy', name: 'Privacy Policy', component: Privacypolicy},
  { path: '/termsandconditions', name: 'Terms & Conditions', component: Termsandconditions},
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    // meta: { requiresAuth: true }
  },
  { path: '/:pathMatch(.*)*', name: 'NotFoundPagina', component: NotFoundPagina },
]

const router = createRouter({
  history: createWebHashHistory('/artquake-vue/'),
  routes,
  // DIT IS DE FIX: Zorgt dat je altijd bovenaan de pagina begint
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
})

// Helper functie voor Firebase
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

// Navigation Guard
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