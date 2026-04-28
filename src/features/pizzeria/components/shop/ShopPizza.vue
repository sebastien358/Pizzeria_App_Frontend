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
  <section class="pizza">
    <div class="pizza__card">
      <div class="pizza__image">
        <img
          :src="product.pictures[0]?.filename || notFound"
          class="img-product"
          :alt="props.product.title"
        />
      </div>

      <div class="pizza__content">
        <h3>{{ props.product.title }}</h3>
        <p class="pizza__description">
          {{ props.product.description }}
        </p>
        <div class="pizza__sizes">
          <p class="pizza__sizes-title">Choisissez une taille</p>

          <div class="pizza__options">
            <label v-for="option in props.product.productOption" :key="option.id" class="pizza-option">
              <input type="radio" name="productOption" :value="option" v-model="selectedOption" />
              <span>{{ option.name }} / {{ option.price }} €</span>
            </label>
          </div>
        </div>
        <div class="pizza__button">
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
    </div>
  </section>
</template>

<style scoped lang="scss">
.pizza {
  &__card {
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
  &__image {
    width: 190px;
    height: 190px;
    margin: 0 auto 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__image .img-product {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    filter: grayscale(100%);
    transition: filter 0.4s ease, transform 0.3s ease;
  }
  &__image:hover .img-product {
    filter: grayscale(0%);
    transform: scale(1.05);
  }

  &__content h3 {
    margin: 0 0 14px;
    font-size: 2rem;
    font-weight: 700;
    text-transform: uppercase;
    color: #2a2a2a;
  }
  &__description {
    max-width: 340px;
    margin: 0 auto 22px;
    font-size: 0.95rem;
    line-height: 1.7;
    color: #7b7b7b;
  }
  &__sizes {
    margin-bottom: 28px;
  }
  &__sizes-title {
    position: relative;
    display: inline-block;
    margin-bottom: 28px;
    font-size: 0.95rem;
    color: #2f2f2f;
  }
  &__sizes-title::before,
  &__sizes-title::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 90px;
    height: 1px;
    background: #d8d8d8;
  }
  &__sizes-title::before {
    right: calc(100% + 14px);
  }
  &__sizes-title::after {
    left: calc(100% + 14px);
  }
  &__options {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 14px;
  }
  &__options .pizza-option {
    display: inline-flex;
    align-items: center;
    font-size: 0.95rem;
    color: #3a3a3a;
    cursor: pointer;
    gap: 6px;
  }
  &__options .pizza-option span {
    font-size: 16px;
  }
  &__option input[type='radio'] {
    accent-color: #222;
    cursor: pointer;
  }
  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__button .btn-cart {
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
  &__button .btn-cart:hover {
    background: #2a2a2a;
    color: #fff;
  }
}

@media (max-width: 991.98px) {
  .pizza {
    &__card {
      height: auto;
      padding: 40px 60px 40px 60px;
    }
    &__content h3 {
      margin: 8px 0 14px 0;
      font-size: 1.6rem;
    }
    &__button {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__image .img-product {
      width: 160px;
      height: 160px;
    }

    &__description {
      margin: 0 auto 28px;
    }
    &__options .pizza-option span {
      font-size: 14px;
    }
    &__button .btn-cart {
      font-size: 10px;
      padding: 12px 30px;
    }
  }
}
</style>
