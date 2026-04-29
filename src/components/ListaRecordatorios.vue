<script setup>
import Recordatorio from './Recordatorio.vue';
const props = defineProps({listaRecordatorios: []});
defineEmits(['eliminar', 'toggle-completado', 'cambiar-prioridad', 'editar-texto']);
</script>
<template>
    <p v-if="listaRecordatorios.length === 0">La lista está vacía</p>
  
  <TransitionGroup name="list" tag="ul" class="recordatorios-list" v-else>
    <Recordatorio 
      v-for="recordatorio in listaRecordatorios" 
      :key="recordatorio.id" 
      :recordatorio="recordatorio" 
        @eliminar="(id, url) => $emit('eliminar', id, url)"
        @toggle-completado="$emit('toggle-completado', $event)"
        @cambiar-prioridad="$emit('cambiar-prioridad', $event)"
        @editar-texto="$emit('editar-texto', $event)"
    />
  </TransitionGroup>
</template>
<style scoped>
.recordatorios-list {
  position: relative;
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.list-enter-from { opacity: 0; transform: translateX(-30px); }
.list-leave-to   { opacity: 0; transform: translateX(30px); }

.list-enter-active,
.list-leave-active { transition: all 0.4s ease; }

.list-move { transition: transform 0.4s ease; }

.list-leave-active { position: absolute; width: 100%; }

@media (prefers-reduced-motion: reduce) {
  .list-enter-from,
  .list-leave-to { transform: none; }
}
</style>