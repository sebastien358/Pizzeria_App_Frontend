<script setup lang="ts">
import { useProductStore } from '@/stores/productStore.ts'

const productStore = useProductStore()

/* SEARCH TERM */

const inputSearchTerm = async () => {
  try {
    const term = productStore.searchTerm
    await productStore.searchProducts(term)
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <section class="shop-filter">
    <!-- Filtration search -->
    <div class="shop-filter__search">
      <input
        @input="inputSearchTerm()"
        v-model="productStore.searchTerm"
        type="text"
        placeholder="Rechercher une pizza..."
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
  </section>
</template>

<style scoped lang="scss">
.shop-filter {
  /* CONTAINER */
  &__search {
    position: relative;
    width: auto;
  }

  /* INPUT */
  &__search input {
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
  }

  /* PLACEHOLDER */
  &__search input::placeholder {
    color: #aaa;
  }

  /* FOCUS */
  &__search input:focus {
    border-color: #e63946;
    box-shadow: 0 0 0 3px rgba(230, 57, 70, 0.1);
  }

  /* ICON */
  &__search svg {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);

    width: 18px;
    height: 18px;

    color: #aaa;
    pointer-events: none;

    transition: 0.2s;
  }

  /* ICON FOCUS */
  &__search input:focus + svg {
    color: #e63946;
  }
}
</style>
