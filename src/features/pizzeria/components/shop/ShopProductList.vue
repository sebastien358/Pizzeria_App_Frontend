<script setup lang="ts">
import ShopProduct from '@/features/pizzeria/components/shop/ShopProduct.vue'
import { useProductStore } from '@/stores/productStore.ts'
import type { ProductInterface } from '@/shared/interfaces'

const productStore = useProductStore()

const props = defineProps<{
  products: ProductInterface[]
  isLoading: boolean
}>()

const loadProducts = async () => {
  try {
    await productStore.loadProducts()
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <!-- loading -->
  <section v-if="props.isLoading" class="spinner">
    <span class="loader"></span>
  </section>
  <!-- products -->
  <div v-else-if="products.length > 0" class="d-flex flex-column">
    <div class="shop-list">
      <ShopProduct
        v-for="product in products"
        :product="product"
        :isLoading="isLoading"
        :key="product.id"
      />
    </div>
    <div v-if="products.length > 0" class="d-flex align-items-center justify-content-center mt-10">
      <button @click="loadProducts()" class="btn btn-primary">Charger plus...</button>
    </div>
  </div>
  <!-- no product -->
  <section v-else class="no-product">
    <p>Aucun produit pour le moment.</p>
  </section>
</template>

<style>
</style>
