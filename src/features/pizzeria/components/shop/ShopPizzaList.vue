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
  <div v-else-if="products.length > 0" class="d-flex flex-column">
    <section class="products-section">
      <div class="products-grid">
        <ShopPizza v-for="product in products.slice(0, 4)" :key="product.id" :product="product" />
      </div>
    </section>
  </div>
  <!-- no product -->
  <section v-else class="no-product">
    <p>Aucun produit pour le moment.</p>
  </section>
</template>

<style scoped lang="scss">
.products-section {
  background: white;
  height: 600px;

  //padding: 90px 40px;
}

.products-grid {
  max-width: 1600px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 60px;
  align-items: stretch;
}

@media (max-width: 1400px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1000px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 680px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
