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
  <section class="pagination" :class="{ active: props.pages > 1 }">
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
  &.active {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  span {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin: 0;
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
    width: 82px;
    box-shadow: none;
  }
  .btn-pagination.disabled {
    background-color: #e0e0e0;
    color: #9e9e9e;
    cursor: not-allowed;
    opacity: 0.6;
  }
  .btn-pagination:hover:not(.disabled) {
    background-color: #0056b3;
  }
}

@media (max-width: 991.98px) {
  .pagination {
    .btn-pagination {
      font-size: 10px;
    }
  }
}

@media (max-width: 768.98px) {
  .pagination {
    &.active {
      gap: 6px;
    }
    span {
      font-size: 12px;
    }
    .btn-pagination {
      text-align: center;
      padding: 10px 14px;
      font-size: 9px;
      width: 75px;
    }
  }
}
</style>
