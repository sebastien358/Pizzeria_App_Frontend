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
    <p>Aucun produit pour le moment.</p>
  </section>
</template>

<style scoped lang="scss">
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
    &__grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 0;
    }
  }
}

@media (max-width: 991.98px) {
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
  margin-top: 200px;
}
</style>
