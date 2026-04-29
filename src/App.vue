<script setup>
import { ref} from 'vue'; // Importante importar ref
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'vue-router';

const auth = getAuth();
const router = useRouter();

// Inicializamos el objeto de sesión
const userSession = ref({ nombre: "", foto: "", id: "" });

// Escuchamos los cambios de sesión
onAuthStateChanged(auth, (user) => {
  if (user) {
    userSession.value = {
      nombre: user.displayName || user.email,
      foto: user.photoURL || "",
      id: user.uid
    };
      
  } else {
    userSession.value = { nombre: "", foto: "", id: "" };
    
  }
});
</script>

<template>
  <main>
    <!-- Aquí es donde se renderizan tus vistas (Login, Register, Recordatorios) -->
    <RouterView :user="userSession" />
  </main>
</template>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  width: 100%;
  overflow-x: hidden;
}
body {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden; /* Esto evita el scroll horizontal "fantasma" */
  position: relative;
  background-color: #1a1a1a
}
#app {
  width: 100%;
  overflow-x: hidden;
}</style>
