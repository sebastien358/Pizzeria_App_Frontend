<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore.ts'
import type { ProductInterface } from '@/shared/interfaces'
import { ref } from 'vue'

const cartStore = useCartStore()

const props = defineProps<{
  product: ProductInterface
}>()
// Affichage du prix en fçnction de la taille de la pizza

const selectedOption = ref(
  props.product.productOption.find((option) => option.name.includes('Grande') || null),
)

const addProductToCart = async (id: number) => {
  if (!selectedOption.value) {
    console.error('Veuillez sélectionner une option')
    return
  }
  try {
    await cartStore.addProductToCart(id, selectedOption.value.price, selectedOption.value.name)

    console.log(selectedOption.value.name)
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <section class="shop-product">
    <div class="shop-product__image">
      <img :src="product.pictures[0]?.filename" class="img-product" />
      <div class="shop-product__content">
        <h3>{{ props.product.title }}</h3>
        <p>{{ props.product.description }}</p>
        <div class="d-flex align-items-center space-between">
          <p>Prix : {{ selectedOption.price }} €</p>
          <div class="shop-product__price">
            <select name="productOption" class="productOption" v-model="selectedOption">
              <option
                v-for="option in props.product.productOption"
                :key="option.id"
                :value="option"
              >
                {{ option.name }}
              </option>
            </select>
            <button @click="addProductToCart(product.id)" class="btn btn-primary">
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">

</style>
