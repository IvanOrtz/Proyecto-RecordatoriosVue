import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initializeApp } from "firebase/app";
import { VueFire, VueFireAuth } from 'vuefire'; // Importa VueFireAuth para la sesión

const firebaseConfig = {
  apiKey: "AIzaSyCfrNkpZLAkf_NeNVgW-klo9lPjM0Zowfo",
  authDomain: "recordatoriosvue-c4271.firebaseapp.com",
  projectId: "recordatoriosvue-c4271",
  storageBucket: "recordatoriosvue-c4271.firebasestorage.app",
  messagingSenderId: "850345674118",
  appId: "1:850345674118:web:029404a8053abfaf8c1807"
};

const firebaseApp = initializeApp(firebaseConfig);
const app = createApp(App)

app.use(router)

app.use(VueFire, {
  firebaseApp,
  modules: [
    VueFireAuth(),
  ],
})

app.mount('#app')
