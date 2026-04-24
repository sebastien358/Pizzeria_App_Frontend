<script setup lang="ts">
const props = defineProps<{
  currentPage: number
  pages: number
}>()

const emit = defineEmits<{
  (e: 'previousPage'): void
  (e: 'nextPage'): void
}>()
</script>

<template>
  <section class="pagination" :class="{ 'active-pagination': props.pages > 1 }">
    <button
      @click="emit('previousPage')"
      class="btn btn-pagination"
      :class="{ disabled: props.currentPage === 1 }"
      :disabled="props.currentPage === 1"
      aria-label="Page précédente"
    >
      Précédent
    </button>
    <span>{{ props.currentPage }} - {{ props.pages }}</span>
    <button
      @click="emit('nextPage')"
      class="btn btn-pagination"
      :class="{ disabled: props.currentPage === props.pages }"
      :disabled="props.currentPage === props.pages"
      aria-label="Page suivante"
    >
      Suivant
    </button>
  </section>
</template>

<style scoped lang="scss">
.pagination {
  display: none;

  &.active-pagination {
    display: flex; // 🔥 obligatoire
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
}

.pagination span {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.pagination .btn-pagination {
  padding: 10px 14px;
  border: none;
  border-radius: 6px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  transition: all 0.2s ease;
  outline: none;
  width: 80px;
}

.pagination .btn-pagination:hover:not(.disabled) {
  background-color: #0056b3;
}

.pagination .btn-pagination.disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}

.pagination .btn-pagination:focus {
  outline: 2px solid #0056b3;
  outline-offset: 2px;
}
</style>
