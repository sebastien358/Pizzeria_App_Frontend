<script setup lang="ts">
import ShopPizza from '@/features/pizzeria/components/shop/ShopPizza.vue'
import type { ProductInterface } from '@/shared/interfaces'

const props = defineProps<{
  products: ProductInterface[]
  isLoading: boolean
}>()
</script>

<template>
  <!-- loading -->
  <section v-if="props.isLoading" class="spinner">
    <span class="loader"></span>
  </section>
  <!-- products -->
  <section v-else-if="products.length > 0">
    <div class="pizza">
      <div class="pizza__grid">
        <ShopPizza v-for="product in products.slice(0, 4)" :key="product.id" :product="product" />
      </div>
    </div>
  </section>
  <!-- no product -->
  <section v-else class="empty-pizza">
    <p class="empty-pizza__text">Aucun produit pour le moment.</p>
  </section>
</template>

<style scoped lang="scss">
.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 300px 0;
  @media (max-width: 1024px) {
    margin: 80px 0;
  }
  @media (max-width: 767.98px) {
    margin: 60px 0;
  }
  .loader {
    width: 35px;
    height: 35px;
    border: 5px solid black;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    @media (max-width: 767.98px) {
      width: 30px;
      height: 30px;
    }
  }
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

// PIZZA

.pizza {
  background: white;
  height: 600px;
  &__grid {
    max-width: 1600px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    align-items: stretch;
  }
}

@media (max-width: 1400px) {
  .pizza {
    height: auto;
    &__grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 0;
    }
  }
}

@media (max-width: 1024px) {
  .pizza {
    height: auto;
    &__grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@media (max-width: 767.98px) {
  .pizza {
    &__grid {
      grid-template-columns: 1fr;
    }
  }
}

// EMPTY PIZZA

.empty-pizza {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 100px 0;
  &__text {
    font-size: 15px;
  }
}

@media (max-width: 991.98px) {
  .empty-pizza {
    margin: 50px 0;
    &__text {
      font-size: 14px;
    }
  }
}

@media (max-width: 767.98px) {
  .empty-pizza {
    margin: 30px 0;
    &__text {
      font-size: 13px;
    }
  }
}
</style>
