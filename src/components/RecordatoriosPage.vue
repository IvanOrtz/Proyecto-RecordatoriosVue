<script setup>
import { ref, computed } from 'vue';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import ListaRecordatorios from './ListaRecordatorios.vue';
import { useCollection, useFirestore } from 'vuefire';
import { 
  collection, query, where, orderBy, 
  addDoc, deleteDoc, doc, serverTimestamp, updateDoc 
} from 'firebase/firestore';
import { supabase } from '../supabase.js'; 

const props = defineProps({
  user: { type: Object, default: () => ({ nombre: "", id: "" }) }
});

const router = useRouter();
const auth = getAuth();
const db = useFirestore();

const text = ref("");
const fileInput = ref(null); 
let archivoSeleccionado = null;

const listaRecordatorios = useCollection(() => 
  props.user.id 
    ? query(
        collection(db, 'Recordatorios'), 
        where('usuario', '==', props.user.id),
        orderBy('prioridad', 'asc')
      )
    : null
);

// Propiedades computadas para estadísticas
const numTareas = computed(() => listaRecordatorios.value?.length || 0);
const numPendientes = computed(() => 
  listaRecordatorios.value?.filter(t => !t.completado).length || 0
);

const nombreArchivo = ref("Ningún archivo seleccionado");

function adjuntarArchivo(e) {
  const file = e.target.files[0];
  if (file) {
    archivoSeleccionado = file;
    nombreArchivo.value = file.name;
  } else {
    nombreArchivo.value = "Ningún archivo seleccionado";
  }
}

async function subirArchivo(nombreFinal) {
  if (!archivoSeleccionado) return null;

  const { data, error } = await supabase.storage
    .from('Recordatorios')
    .upload(nombreFinal, archivoSeleccionado);

  if (error) {
    console.error("Error subiendo a Supabase:", error.message);
    return null;
  }
 const { data: link } = supabase.storage
    .from('Recordatorios')
    .getPublicUrl(nombreFinal); 

  return link.publicUrl; // Esto devuelve el string "https://..."

}

async function anadir() {
  if (text.value.trim()) {
    try {
      let publicURL = null;

      if (archivoSeleccionado) {
        // Creamos un nombre único para evitar duplicados en Supabase
        const timestamp = Date.now();
        const nombreUnico = `${timestamp}-${archivoSeleccionado.name}`;
        publicURL = await subirArchivo(nombreUnico);
      }

      await addDoc(collection(db, 'Recordatorios'), {
        texto: text.value,
        completado: false,
        añadido: serverTimestamp(),
        prioridad: 2,
        usuario: props.user.id,
        archivo: publicURL // Guardamos la URL
      });

      // Limpieza
      text.value = "";
      archivoSeleccionado = null;
      nombreArchivo.value = "Ningún archivo seleccionado";
      if (fileInput.value) fileInput.value.value = ""; 
      
    } catch (e) {
      console.error("Error al añadir documento: ", e);
    }
  }
}


async function cerrarSesion() {
  try {
    await signOut(auth);
    router.push('/');
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
}

async function eliminarRecordatorio(id, urlCompleta) {
  try {
    // Borrar de Firestore
    await deleteDoc(doc(db, 'Recordatorios', id));

    if (urlCompleta) {
      // Limpiamos la URL de parámetros y decodificamos los caracteres especiales
      const urlLimpia = urlCompleta.split('?')[0];
      const nombreCodificado = urlLimpia.split('/').pop();
      const nombreReal = decodeURIComponent(nombreCodificado);

      const { data, error } = await supabase.storage
        .from('Recordatorios')
        .remove([nombreReal]);

    }
  } catch (error) {
    console.error("Error en el proceso:", error);
  }
}
async function vaciarCompletados() {
  const tareasABorrar = listaRecordatorios.value.filter(t => t.completado);
  for (const t of tareasABorrar) {
    await eliminarRecordatorio(t.id, t.archivo);
  }
}

async function alternarCompletado(tarea) {
  try {
    await updateDoc(doc(db, 'Recordatorios', tarea.id), {
      completado: !tarea.completado
    });
  } catch (error) {
    console.error("Error al actualizar estado:", error);
  }
}

async function actualizarPrioridad({ id, prioridad }) {
  try {
    await updateDoc(doc(db, 'Recordatorios', id), { prioridad: prioridad });
  } catch (error) {
    console.error("Error al cambiar prioridad:", error);
  }
}

async function actualizarTexto({ id, nuevoTexto }) {
  try {
    await updateDoc(doc(db, 'Recordatorios', id), { texto: nuevoTexto });
  } catch (error) {
    console.error("Error al actualizar el texto:", error);
  }
}
</script>

<template>
  <div class="main-wrapper">
    <header class="header">
      <h1>Proyecto Recordatorios<span class="color">Vue</span></h1>
      <h2>Bienvenido <span class="user-name">{{ user.nombre }}</span></h2>
      <nav class="nav-btns">
        <RouterLink 
          to="/administracion" 
          class="btn-admn" 
          v-if="user.id === 'jPW14sWmJpNMeVhaJURSIbLEVj72'"
        >
          Administración
        </RouterLink>
        <button @click="cerrarSesion" class="btn-logout">
          <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
        </button>
      </nav>
    </header>

    <main class="content">
      <div class="input-container">
        <input 
          type="text" 
          v-model="text" 
          @keyup.enter="anadir" 
          placeholder="¿Qué quieres recordar?" 
        >
        <div class="file-upload">
          <label for="file-input">Adjuntar archivo:</label>
          <input 
            id="file-input"
            type="file" 
            ref="fileInput"
            @change="adjuntarArchivo"
          >
        </div>
        <span class="file-name-display">{{ nombreArchivo }}</span>
      </div>

      <div class="stats-bar">
        <p>
          <i class="fas fa-chart-bar"></i> 
          {{ numPendientes }} Tareas pendientes de un total de {{ numTareas }} 
          <span class="divider">|</span> 
          <button class="btn-clear" @click="vaciarCompletados">
            <i class="fas fa-times"></i> Borrar tareas completadas
          </button>
        </p>
      </div>

      <div class="list-container">
        <ListaRecordatorios 
          :listaRecordatorios="listaRecordatorios" 
          @eliminar="eliminarRecordatorio"
          @toggle-completado="alternarCompletado"
          @cambiar-prioridad="actualizarPrioridad"
          @editar-texto="actualizarTexto"
        />
      </div>
    </main>

    <footer class="footer">
      <p>Desarrollado por "Iván Ortiz Santos"</p>
      <p>Código disponible en <a href="https://github.com/IvanOrtz/Proyecto-RecordatoriosVue.git"><i class="fab fa-github"></i> GitHub</a></p>
    </footer>
  </div>
</template>

<style scoped>

.main-wrapper {
  min-height: 100vh;
  background-color: #1a1a1a;
  color: #ffffff;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.color{
color: #42b883;
}
.header {
  width: 100%;
  max-width: 900px;
  margin-bottom: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.header-text { flex-grow: 1; }

.header h1 {
  font-size: 2.2rem;
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.5px;
}

.header h2 {
  font-size: 1.2rem;
  font-weight: 400;
  color: #aaa;
  margin: 0.4rem 0 0 0;
}

.user-name { color: #42b883; font-weight: 600; }

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-shrink: 0;
}

.btn-admn {
  text-decoration: none;
  background-color: transparent;
  color: #ffca28;
  border: 1px solid #ffca28;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-admn:hover {
  background-color: #ffca28;
  color: #1a1a1a;
  box-shadow: 0 0 15px rgba(255, 202, 40, 0.3);
}

.btn-logout {
  background-color: transparent;
  color: #ff5252;
  border: 1px solid #ff5252;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.btn-logout:hover {
  background-color: #ff5252;
  color: #fff;
  box-shadow: 0 0 12px rgba(255, 82, 82, 0.3);
}

.content { width: 100%; max-width: 900px; }

.input-container { margin-bottom: 1.5rem; }

.input-container input {
  width: 100%;
  padding: 1.2rem 1.5rem;
  font-size: 1.1rem;
  background-color: #ffffff;
  border: 2px solid transparent;
  border-radius: 10px;
  color: #333;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  transition: border-color 0.3s ease;
  outline: none;
  box-sizing: border-box;
}

.input-container input:focus { border-color: #42b883; }

.stats-bar {
  border-top: 1px solid #333;
  padding-top: 1.2rem;
  margin-bottom: 1.5rem;
}

.stats-bar p {
  font-size: 0.95rem;
  color: #bbb;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  flex-wrap: wrap;
}

.divider { color: #444; font-weight: 300; }

.btn-clear {
  background: none;
  border: none;
  color: #ff9f43;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.btn-clear:hover { opacity: 0.8; text-decoration: underline; }
.btn-clear i { font-size: 0.8rem; }

.list-container {
  background-color: #242424;
  border-radius: 12px;
  border: 1px solid #333;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.file-upload {
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.file-upload input[type="file"] { display: none; }

.file-upload label {
  background-color: #333;
  color: #42b883;
  border: 1px solid #42b883;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.file-upload label:hover {
  background-color: #42b883;
  color: #1a1a1a;
}

.file-name-display {
  font-size: 0.85rem;
  color: #888;
  font-style: italic;
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.footer {
  margin-top: auto;
  padding: 3rem 0;
  text-align: center;
  color: #666;
  font-size: 0.85rem;
  width: 100%;
}

.footer p { margin: 5px 0; }
.footer a { color: #42b883; text-decoration: none; font-weight: 500; }
.footer a:hover { text-decoration: underline; }

/* ── Tablet (≤768px) ── */
@media (max-width: 768px) {
  .main-wrapper { padding: 1rem; }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .header h1 { font-size: 1.6rem; }
  .header h2 { font-size: 1rem; }

  .header-actions { width: 100%; flex-wrap: wrap; }

  .btn-admn,
  .btn-logout {
    flex: 1;
    justify-content: center;
    padding: 0.75rem;
    font-size: 0.85rem;
    min-width: 120px;
  }

  .input-container input { padding: 1rem 1.2rem; font-size: 1rem; }
  .stats-bar p { font-size: 0.85rem; }
  .file-upload { flex-direction: column; align-items: flex-start; }
  .file-name-display { max-width: 100%; }
  .footer { padding: 2rem 0; }
}

/* ── Móvil pequeño (≤480px) ── */
@media (max-width: 480px) {
  .main-wrapper { padding: 0.75rem; }
  .header h1 { font-size: 1.4rem; }
  .header h2 { font-size: 0.9rem; }
  .header-actions { flex-direction: column; }
  .btn-admn, .btn-logout { width: 100%; }
  .input-container input { padding: 0.9rem 1rem; font-size: 0.95rem; }
  .footer { font-size: 0.8rem; }
}
</style>