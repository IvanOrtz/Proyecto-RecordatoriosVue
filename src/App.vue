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
/* 1. Reset global para que los paddings no sumen ancho */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* 2. Ajuste para pantallas curvas y evitar scroll lateral */
html, body {
  width: 100%;
  overflow-x: hidden;
  /* El color de fondo aquí evita destellos blancos al cargar */
  background-color: #1a1a1a; 
}

body {
  margin: 0;
  /* 'viewport-fit=cover' en el HTML junto con esto 
     hace que el contenido respete los bordes curvos */
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
  
  min-height: 100dvh; /* Altura dinámica para móviles */
  position: relative;
}

#app {
  width: 100%;
  overflow-x: hidden;
}
</style>