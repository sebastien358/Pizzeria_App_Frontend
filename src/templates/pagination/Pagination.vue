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
  <div class="pagination" :class="{ 'active-pagination': props.pages > 0 }">
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
  </div>
</template>

<style scoped lang="scss">
.pagination {
  margin: auto;
  gap: 10px;
  font-family: 'Segoe UI', Tahoma, sans-serif;
  display: none;
  &.active-pagination {
    display: block;
  }
  span {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin: 0 10px;
  }
  .btn-pagination {
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
    &:hover:not(.disabled) {
      background-color: #0056b3;
    }
    &.disabled {
      background-color: #ccc;
      color: #666;
      cursor: not-allowed;
    }
    &:focus {
      outline: 2px solid #0056b3;
      outline-offset: 2px;
    }
  }
}
</style>
