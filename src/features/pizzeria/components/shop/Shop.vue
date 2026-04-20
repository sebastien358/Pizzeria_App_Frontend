<script setup lang="ts">
import ShopProductList from '@/features/pizzeria/components/shop/ShopProductList.vue'
import type { ProductInterface } from '@/shared/interfaces'

defineProps<{
  products: ProductInterface[]
  isLoading: boolean
}>()
</script>

<template>
  <div class="shop">
    <div class="d-flex flex-column shop-content">
      <ShopProductList :products="products" :isLoading="isLoading" class="shop-product-list" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.shop {
  //margin-top: 100px
}
</style>
