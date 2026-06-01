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
  props.product.productOption.find(
    (option) => option.name.toLowerCase().includes('grande') || props.product.productOption[0],
  ),
)

const addProductToCart = async (id: number) => {
  if (!selectedOption.value) {
    console.error('Veuillez sélectionner une option')
    return
  }
  try {
    await cartStore.addProductToCart(id, selectedOption.value.price, selectedOption.value.name)
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <section class="pizza">
    <div class="pizza__separator"></div>
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
            <label
              v-for="option in props.product.productOption"
              :key="option.id"
              class="pizza-option"
            >
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
            <span>Ajouter au panier</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.pizza {
  background: #fff;

  &__card {
    padding: 90px 18px 90px 18px;
    background: transparent;
    border: none;
    box-shadow: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: transform 0.25s ease;

    &:hover {
      transform: translateY(-6px);
    }
  }

  &__image {
    width: 190px;
    height: 190px;
    margin-bottom: 28px;
    border-radius: 50%;
    overflow: hidden;
    background: #f5f5f5;
    box-shadow: 0 16px 35px rgba(0, 0, 0, 0.08);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  &__content {
    width: 100%;
  }

  &__content h3 {
    font-weight: 800;
    text-transform: uppercase;
    color: #202020;
    line-height: 1.1;
    margin-bottom: 14px;
    font-size: 1.5rem;
  }

  &__description {
    margin-bottom: 22px;
    color: #666;
    font-size: 0.95rem;
    min-height: 36px;
  }

  &__sizes-title {
    margin-bottom: 12px;
    font-size: 0.75rem;
    font-weight: 700;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 1.3px;
  }

  &__options {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }

  &-option {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    color: #333;
    cursor: pointer;

    input {
      accent-color: #d62828;
      transform: scale(0.9);
    }
  }

  &__button {
    margin-top: 18px;
  }
}

.btn-cart {
  height: 42px;
  border: 1px solid #1f1f1f;
  border-radius: 999px;
  background: #fff;
  color: #1f1f1f;
  padding: 12px 18px;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.25s ease;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: #1f1f1f;
    color: #fff;
    transform: translateY(-2px);
  }
}

@media (max-width: 1600px) {
  .pizza {
    &__card {
      padding: 60px 14px;
    }

    &__content h3 {
      font-size: 1rem;
    }

    &__description {
      margin-bottom: 10px;
    }

    &__image {
      width: 150px;
      height: 150px;
    }
    &__button {
      margin-top: 20px;
    }

    .btn-cart {
      height: 42px;
      padding: 12px 18px;
      font-size: 0.55rem;
    }
  }
}

@media (max-width: 1024px) {
  .pizza {
    &__card {
      padding: 30px 12px;
    }

    &__image {
      width: 160px;
      height: 160px;
      margin-bottom: 20px;
    }

    &__content h3 {
      font-size: 1.2rem;
    }

    &__description {
      font-size: 0.82rem;
      margin-bottom: 18px;
    }

    &__sizes-title {
      font-size: 0.7rem;
    }

    &-option {
      font-size: 0.8rem;
    }
  }

  .btn-cart {
    height: 40px;
    padding: 0 20px;
    font-size: 0.55rem;
  }
}

@media (max-width: 991px) {
  .pizza {
    &__card {
      padding: 40px 12px 40px 12px;
    }

    &__image {
      width: 150px;
      height: 150px;
      margin-bottom: 18px;
    }

    &__content h3 {
      font-size: 1.1rem;
    }

    &__description {
      font-size: 0.82rem;
      margin-bottom: 16px;
    }

    &__sizes-title {
      font-size: 0.7rem;
    }

    &-option {
      font-size: 0.8rem;
    }
  }

  .btn-cart {
    height: 40px;
    padding: 0 20px;
    font-size: 0.55rem;
  }
}

@media (max-width: 767.98px) {
  .pizza {
    &__card {
      padding: 30px 0 30px 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    }

    &__image {
      width: 140px;
      height: 140px;
      margin-bottom: 18px;
    }

    &__content h3 {
      font-size: 0.9rem;
      line-height: 1.2;
    }

    &__description {
      font-size: 0.8rem;
      line-height: 1.5;
      margin-bottom: 14px;
    }

    &__sizes {
      margin-top: 10px;
    }

    &__sizes-title {
      margin-bottom: 8px;
      font-size: 0.68rem;
      letter-spacing: 1px;
    }

    &__options {
      gap: 4px;
    }

    &-option {
      font-size: 0.78rem;
    }

    &__button {
      margin-top: 18px;
    }
  }

  .btn-cart {
    height: 38px;
    padding: 0 18px;
    font-size: 0.50rem;
    gap: 6px;

    svg {
      width: 14px;
      height: 14px;
    }
  }
}
</style>
