<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore.ts'
import type { CartProductInterface } from '@/shared/interfaces'

defineProps<{
  item: CartProductInterface
}>()

const cartStore = useCartStore()

/* Ajouter un article depuis le panier */

async function addItemToCart(id: number) {
  try {
    await cartStore.addItemToCart(id)
  } catch (e) {
    console.error(e)
  }
}

/* Retirer un article depuis le panier */

async function deleteItemToCart(id: number) {
  try {
    await cartStore.deleteItemToCart(id)
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div class="d-flex align-items-center space-between cart-product">
    <div class="cart-product__image">
      <img :src="item.image" class="img-cart" />
      <h4>{{ item.title }}</h4>
      <p class="option-name">({{ item.name }})</p>
    </div>
    <div class="d-flex align-items-center">
      <font-awesome-icon @click="deleteItemToCart(item.id)" icon="fa-solid fa-minus" />
      <p class="quantity">{{ item.quantity }}</p>
      <font-awesome-icon @click="addItemToCart(item.id)" icon="fa-solid fa-plus" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.cart-product {
  border: var(--border);
  padding: 10px 6px;
  border-radius: var(--border-radius);
  background-color: var(--text-primary-color);
  &__image {
    display: flex;
    align-items: center;
    column-gap: 6px;
    .img-cart {
      height: 45px;
      width: auto;
    }
    .no-img-cart {
      height: 45px;
      width: 57px;
    }
  }
  h4 {
    font-size: 13px;
  }
  .option-name {
    font-size: 9px;
    margin-top: 3px;
  }
  .fa-minus {
    cursor: pointer;
    font-size: 15px;
    color: red;
  }
  .quantity {
    font-size: 14px;
    margin: 0 7px;
  }
  .fa-plus {
    cursor: pointer;
    font-size: 15px;
    color: green;
  }
}
</style>
