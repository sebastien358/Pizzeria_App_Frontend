<script setup lang="ts">
const props = defineProps<{
  term: string | null
  placeholder: string | null
  total?: number
}>()

const emit = defineEmits<{
  (e: 'update:term', value: string | null): void
}>()

const searchTerm = (e: Event) => {
  emit('update:term', (e.target as HTMLInputElement).value)
}
</script>

<template>
  <section class="search">
    <div class="search__container" :class="{ active: props.total }">
      <!-- Filtration search -->
      <div class="search__input">
        <input
          :value="props.term"
          @input="searchTerm"
          type="text"
          :placeholder="props.placeholder || 'Rechercher une pizza...'"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      <!-- Counter -->
      <div v-if="props.total" class="search__counter">
        <span class="search__total">{{ props.total }} au total</span>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.search {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  box-sizing: border-box;
  &__container {
    width: 380px;

    box-sizing: border-box;

    display: flex;

    align-items: center;
    justify-content: center;
    gap: 12px;
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    margin: 0 auto;
    flex-direction: row;

    &.active {
      width: 400px;
    }
    @media (max-width: 768px) {
      gap: 20px;
      width: 100%;

      &.active {
        width: 100%;
        flex-direction: column;
      }
    }
  }

  &__input {
    box-sizing: border-box;
    position: relative;
    width: 380px;
    @media (max-width: 767.98px) {
      width: 100%;
    }
    input {
      box-sizing: border-box;
      width: 100%;
      height: 42px;
      padding: 0 40px 0 16px;
      border-radius: 10px;
      border: 1px solid #e5e5e5;
      background: #fff;
      font-size: 14px;
      color: #333;
      transition: 0.2s;
      outline: none;
      @media (max-width: 767.98px) {
        font-size: 12px;
      }
      &::placeholder {
        color: #aaa;
      }

      &:focus {
        border-color: #e63946;
        box-shadow: 0 0 0 3px rgba(230, 57, 70, 0.1);
      }

      &:focus + svg {
        color: #e63946;
      }
    }

    svg {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 18px;
      height: 18px;
      color: #aaa;
      pointer-events: none;
      transition: 0.2s;
      @media (max-width: 767.98px) {
        width: 16px;
        height: 16px;
      }
    }
  }

  &__counter {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
  }

  &__total {
    background: #f5f5f5;
    color: #666;
    padding: 6px 12px;
    border-radius: 20px;
    font-weight: 500;
    white-space: nowrap;
    @media (max-width: 767.98px) {
      font-size: 11px;
    }
  }
}
</style>
