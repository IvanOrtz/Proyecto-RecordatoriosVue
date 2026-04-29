<script setup>
import { useFirestore, useCollection } from 'vuefire';
import { collection, query, doc, deleteDoc, updateDoc, orderBy } from 'firebase/firestore';
import ListaRecordatorios from './ListaRecordatorios.vue';

const db = useFirestore();

// Consulta base
const consulta = query(collection(db, 'Recordatorios'), orderBy('prioridad', 'asc'));
const listaRecordatorios = useCollection(consulta);


async function eliminarRecordatorio(id) {
  try {
    await deleteDoc(doc(db, 'Recordatorios', id));
  } catch (e) {
    console.error("Error:", e);
  }
}

async function alternarCompletado(tarea) {
  try {
    await updateDoc(doc(db, 'Recordatorios', tarea.id), {
      completado: !tarea.completado
    });
  } catch (e) {
    console.error(e);
  }
}

async function actualizarPrioridad({ id, prioridad }) {
  try {
    await updateDoc(doc(db, 'Recordatorios', id), { prioridad });
  } catch (e) {
    console.error(e);
  }
}

async function actualizarTexto({ id, nuevoTexto }) {
  try {
    await updateDoc(doc(db, 'Recordatorios', id), { texto: nuevoTexto.trim() });
  } catch (e) {
    console.error(e);
  }
}
</script>

<template>
  <div class="admin-wrapper">
    <header class="admin-header">
      <RouterLink to="/recordatorios" class="btn-back">
        <i class="fas fa-arrow-left"></i> Volver
      </RouterLink>
      <h1>Panel Global</h1>
      <p>Gestionando <strong>{{ listaRecordatorios?.length || 0 }}</strong> notas.</p>
    </header>

    <main class="content">
      <ListaRecordatorios 
        v-if="listaRecordatorios && listaRecordatorios.length > 0"
        :listaRecordatorios="listaRecordatorios" 
        @eliminar="eliminarRecordatorio"
        @toggle-completado="alternarCompletado"
        @cambiar-prioridad="actualizarPrioridad"
        @editar-texto="actualizarTexto"
      />
      <p v-else class="loading-msg">Cargando notas o lista vacía...</p>
    </main>
  </div>
</template>

<style scoped>
.admin-wrapper {
  min-height: 100vh;
  background-color: #1a1a1a;
  color: #ffffff;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.admin-header {
  width: 100%;
  max-width: 800px;
  margin-bottom: 2rem;
  border-bottom: 2px solid #42b883;
  padding-bottom: 1rem;
}

.content {
  width: 100%;
  max-width: 800px;
}

.btn-back { color: #42b883; text-decoration: none; font-weight: bold; }

.loading-msg { color: #888; text-align: center; margin-top: 2rem; }

/* ── Móvil grande ── */
@media (max-width: 768px) {
  .admin-wrapper { padding: 1rem; }
  .admin-header { margin-bottom: 1.5rem; }
}

/* ── Móvil pequeño ── */
@media (max-width: 480px) {
  .admin-wrapper { padding: 0.75rem; }
}
</style>