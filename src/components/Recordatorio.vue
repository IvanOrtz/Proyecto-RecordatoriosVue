<script setup>
import { ref, nextTick } from 'vue';

const props = defineProps({ recordatorio: {} });

const emit = defineEmits(['toggle-completado', 'eliminar', 'cambiar-prioridad', 'editar-texto']);

// Estados para la edición
const editando = ref(false);
const textoEditado = ref(props.recordatorio.texto);
const inputRef = ref(null);

// Activa el modo edición
const habilitarEdicion = async () => {
  editando.value = true;
  await nextTick(); // Espera a que el input aparezca
  inputRef.value?.focus();
};

// Guarda el cambio y emite el evento
const guardarEdicion = () => {
  if (textoEditado.value.trim() !== "" && textoEditado.value !== props.recordatorio.texto) {
    emit('editar-texto', { id: props.recordatorio.id, nuevoTexto: textoEditado.value });
  }
  editando.value = false;
};

const formatearFecha = (fecha) => {
  if (!fecha) return 'Recién añadido';
  const fechaDate = fecha.toDate ? fecha.toDate() : new Date(fecha);
  const ahora = new Date();
  const diferenciaSegundos = Math.floor((ahora - fechaDate) / 1000);

  if (diferenciaSegundos < 60) return `Añadido hace menos de un minuto`;
  const minutos = Math.floor(diferenciaSegundos / 60);
  if (minutos < 60) return `Añadido hace ${minutos} minutos`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `Añadido hace ${horas} horas`;
  return fechaDate.toLocaleDateString();
};
</script>

<template>
  <li class="item-recordatorio" :class="{ 'is-completed': recordatorio.completado }">
    <div class="status-icon" @click="$emit('toggle-completado', recordatorio)">
      <i :class="recordatorio.completado ? 'fas fa-check-circle' : 'far fa-circle'"></i>
    </div>

    <div class="content-wrapper">

      <div v-if="!editando" class="main-text" @dblclick="habilitarEdicion">
        {{ recordatorio.texto }}
        <a v-if="recordatorio.archivo" 
     :href="recordatorio.archivo" 
     target="_blank" 
     class="attachment-link"
     title="Ver archivo adjunto"> <i class="fas fa-paperclip"></i>
  </a>
      </div>
      <input 
        v-else 
        ref="inputRef"
        v-model="textoEditado" 
        class="edit-input"
        @keyup.enter="guardarEdicion"
        @blur="guardarEdicion"
      >

      <div class="meta-info">
        <span class="label">Prioridad:</span>
        <div class="priority-badges">
          <span class="badge low" :class="{ active: recordatorio.prioridad === 3 }" @click="$emit('cambiar-prioridad', { id: recordatorio.id, prioridad: 3 })">
            <i class="fas fa-chevron-down"></i> Low
          </span>
          <span class="badge normal" :class="{ active: recordatorio.prioridad === 2 }" @click="$emit('cambiar-prioridad', { id: recordatorio.id, prioridad: 2 })">
            Normal
          </span>
          <span class="badge high" :class="{ active: recordatorio.prioridad === 1 }" @click="$emit('cambiar-prioridad', { id: recordatorio.id, prioridad: 1 })">
            High <i class="fas fa-chevron-up"></i>
          </span>
        </div>

        <span class="time-stamp">
          <i class="far fa-clock"></i> {{ formatearFecha(recordatorio.añadido) }}
        </span>
      </div>
    </div>

    <div class="actions">
  <button 
    class="btn-edit-action" 
    @mousedown.prevent="editando ? guardarEdicion() : habilitarEdicion()"
  >
    <i :class="editando ? 'fas fa-save' : 'fas fa-pen'"></i>
  </button>

  <button class="btn-delete-action" @click="$emit('eliminar', recordatorio.id, recordatorio.archivo)">
    <i class="fas fa-minus-circle"></i>
  </button>
</div>
  </li>
</template>

<style scoped>
.item-recordatorio {
  display: flex;
  align-items: center;
  padding: 1.2rem;
  background-color: #2a2a2a;
  border-bottom: 1px solid #333;
  gap: 15px;
  position: relative;
  flex-wrap: nowrap;
}

.status-icon {
  font-size: 1.5rem;
  cursor: pointer;
  color: #42b883;
  flex-shrink: 0;
}

.content-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.main-text {
  font-size: 1.4rem;
  color: #42b883;
  transition: all 0.3s;
  word-break: break-word;
}

.is-completed .main-text {
  text-decoration: line-through;
  text-decoration-color: rgba(66, 184, 131, 0.8);
  text-decoration-thickness: 2px;
  opacity: 0.6;
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  color: #888;
  flex-wrap: wrap;
}

.priority-badges { display: flex; gap: 5px; flex-wrap: wrap; }

.badge {
  padding: 2px 8px;
  border-radius: 4px;
  background-color: #383838;
  color: #666;
  font-weight: bold;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  user-select: none;
  transition: transform 0.1s ease;
  font-size: 0.8rem;
  white-space: nowrap;
}

.badge.low.active    { background-color: #444; color: #aaa; transform: scale(0.95); }
.badge.normal.active { background-color: #307910; color: #eee; }
.badge.high.active   { background-color: #e74c3c; color: white; }

.time-stamp {
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
}

.actions { display: flex; gap: 8px; flex-shrink: 0; }

.btn-edit-action {
  background-color: #3498db;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.btn-delete-action {
  background-color: #e74c3c;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  transition: background 0.2s;
  flex-shrink: 0;
}

.btn-delete-action:hover { background-color: #c0392b; }

.edit-input {
  background: #333;
  color: #42b883;
  border: 1px solid #42b883;
  padding: 4px 8px;
  font-size: 1.4rem;
  border-radius: 4px;
  width: 100%;
  outline: none;
  box-sizing: border-box;
}

.attachment-link {
  margin-left: 10px;
  color: #42b883;
  font-size: 0.9rem;
  transition: transform 0.2s;
  display: inline-block;
}

.attachment-link:hover { color: #ffca28; transform: scale(1.2); }
.is-completed .attachment-link { color: #666; }

/* ── Tablet (≤768px) ── */
@media (max-width: 768px) {
  .item-recordatorio { padding: 1rem; gap: 10px; flex-wrap: wrap; }
  .main-text { font-size: 1.1rem; }
  .meta-info { font-size: 0.8rem; gap: 6px; }
  .time-stamp { margin-left: 0; }
  .actions { width: 100%; justify-content: flex-end; }
}

/* ── Móvil pequeño (≤480px) ── */
@media (max-width: 480px) {
  .item-recordatorio { padding: 0.75rem; gap: 8px; }
  .main-text { font-size: 1rem; }
  .status-icon { font-size: 1.2rem; }
  .btn-edit-action,
  .btn-delete-action { width: 36px; height: 36px; font-size: 1rem; }
  .badge { font-size: 0.75rem; padding: 2px 6px; }
  .edit-input { font-size: 1rem; }
}
</style>