import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import LandingPage from '@/components/LandingPage.vue'
import RecordatoriosPage from '@/components/RecordatoriosPage.vue'
import AdministracionPage from '@/components/AdministracionPage.vue'
import LoginPage from '@/components/LoginPage.vue'
import RegisterPage from '@/components/RegisterPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
  { path: '/', component: LandingPage, meta: {requireAuth: false} },
  { path: '/login', component: LoginPage, meta: {requireAuth: false}},
  { path: '/register', component: RegisterPage, meta: {requireAuth: false}},
  { path: '/recordatorios', component: RecordatoriosPage, meta: {requireAuth: true}},
  { path: '/administracion', component: AdministracionPage, meta: {requireAuth: true, onlyAdmin: true}},
  ],
})

const esperarUsuario = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      unsubscribe(); // Deja de escuchar en cuanto recibe la primera respuesta
      resolve(user);
    });
  });
};

router.beforeEach(async (to, from) => {
  const usuarioLogueado = await esperarUsuario();
  const ADMIN_ID = "jPW14sWmJpNMeVhaJURSIbLEVj72";

  if (to.meta.onlyAdmin && usuarioLogueado?.uid !== ADMIN_ID) {
    return '/recordatorios'; 
  }

  if (to.meta.requireAuth && !usuarioLogueado) {
    return '/login';
  }

  if (!to.meta.requireAuth && usuarioLogueado) {
    return '/recordatorios';
  }
});
export default router
