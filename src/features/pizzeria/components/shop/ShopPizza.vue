<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore.ts'
import type { ProductInterface } from '@/shared/interfaces'
import notFound from '@/assets/images/not-found.webp'
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
    <div class="shop-product__card">
      <div class="shop-product__image">
        <img
          :src="product.pictures[0]?.filename || notFound"
          class="img-product"
          :alt="props.product.title"
        />
      </div>

      <div class="shop-product__content">
        <h3>{{ props.product.title }}</h3>

        <p class="shop-product__description">
          {{ props.product.description }}
        </p>

        <div class="shop-product__sizes">
          <p class="shop-product__sizes-title">Choisissez une taille</p>

          <div class="shop-product__options">
            <label
              v-for="option in props.product.productOption"
              :key="option.id"
              class="shop-product__option"
            >
              <input type="radio" name="productOption" :value="option" v-model="selectedOption" />
              <span>{{ option.name }} / {{ option.price }} €</span>
            </label>
          </div>
        </div>

        <button @click="addProductToCart(product.id)" class="btn-cart">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span> Ajouter au panier</span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.shop-product {
  width: 100%;
  display: flex;
}

.shop-product__card {
  transition: transform 0.3s ease;
  height: 600px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  padding: 50px 60px 55px 60px;
  border-radius: 12px;
  background: white;
  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
  }
}

.shop-product__image {
  width: 190px;
  height: 190px;
  margin: 0 auto 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.img-product {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;

  filter: grayscale(100%);
  transition:
    filter 0.4s ease,
    transform 0.3s ease;
}

.shop-product__image:hover .img-product {
  filter: grayscale(0%);
  transform: scale(1.05);
}

.shop-product__content h3 {
  margin: 0 0 14px;
  font-size: 2rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #2a2a2a;
}

.shop-product__description {
  max-width: 340px;
  margin: 0 auto 22px;
  font-size: 0.95rem;
  line-height: 1.7;
  color: #7b7b7b;
}

.shop-product__sizes {
  margin-bottom: 28px;
}

.shop-product__sizes-title {
  position: relative;
  display: inline-block;
  margin-bottom: 18px;
  font-size: 0.95rem;
  color: #2f2f2f;
}

.shop-product__sizes-title::before,
.shop-product__sizes-title::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 90px;
  height: 1px;
  background: #d8d8d8;
}

.shop-product__sizes-title::before {
  right: calc(100% + 14px);
}

.shop-product__sizes-title::after {
  left: calc(100% + 14px);
}

.shop-product__options {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 14px;
}

.shop-product__option {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95rem;
  color: #3a3a3a;
  cursor: pointer;
}

.shop-product__option input[type='radio'] {
  accent-color: #222;
  cursor: pointer;
}

.btn-cart {
  border: 1.5px solid #3a3a3a;
  background: transparent;
  color: #2a2a2a;
  padding: 14px 34px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s ease;

  font-size: 11px;
  text-transform: uppercase;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  span {
    margin: 0;
    padding: 0;
  }
}

.btn-cart:hover {
  background: #2a2a2a;
  color: #fff;
}
</style>
