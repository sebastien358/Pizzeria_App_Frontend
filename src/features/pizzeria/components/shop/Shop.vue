<script setup lang="ts">
import ShopPizzaList from '@/features/pizzeria/components/shop/ShopPizzaList.vue'
import type { ProductInterface } from '@/shared/interfaces'

defineProps<{
  products: ProductInterface[]
  isLoading: boolean
}>()
</script>

<template>
  <div class="shop">
    <div class="d-flex flex-column shop-content">
      <ShopPizzaList :products="products" :isLoading="isLoading" class="shop-product-list" />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
