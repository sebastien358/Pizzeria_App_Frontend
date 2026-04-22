<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useProductStore } from '@/stores/productStore.ts'
import notFound from '@/assets/images/not-found.webp'
import { useCartStore } from '@/stores/cartStore.ts'
import PizzaFilter from '@/features/pizzeria/components/shop/PizzaFilter.vue'

const productStore = useProductStore()
const cartStore = useCartStore()

onMounted(async () => {
  try {
    await productStore.getProduct()
  } catch (e) {
    console.error(e)
  }
})

const pizzas = computed(() => productStore.product)

const selectedOptions = ref<{ [key: number]: any }>({})

watch(
  pizzas,
  (newPizzas) => {
    newPizzas.forEach((pizza) => {
      selectedOptions.value[pizza.id] =
        pizza.productOption.find((option) => option.name.toLowerCase().includes('grande')) ||
        pizza.productOption[0]
    })
  },
  { immediate: true },
)

const addPizzaToCart = (id: number) => {
  if (!selectedOptions.value) {
    console.error('Veuillez sélectionner une option')
    return
  }
  cartStore.addProductToCart(id, selectedOptions.value[id].price, selectedOptions.value[id].name)
  console.log(id, selectedOptions.value[id].price, selectedOptions.value[id].name)
}
</script>

<template>
  <!-- Pizzas Filter -->
  <section class="pizza-filter">
    <div class="pizza-filter__sidebar">
      <PizzaFilter />
    </div>
    <!-- Pizzas -->
    <div class="cards-grid">
      <div v-for="pizza in pizzas" :key="pizza.id">
        <!-- Card 1 -->
        <div class="pizza-card">
          <img
            :src="pizza.pictures[0]?.filename || notFound"
            alt="Pizza Margherita"
            class="pizza-card__image"
          />
          <h3 class="pizza-card__title">{{ pizza.title }}</h3>
          <p class="pizza-card__description">{{ pizza.description }}</p>
          <p class="pizza-card__size-label">Choisir une taille</p>

          <div class="pizza-card__sizes">
            <div
              v-for="option in pizza.productOption"
              :key="option.id"
              class="pizza-card__size-row"
            >
              <input
                type="radio"
                :name="'size-' + pizza.id"
                :id="'size-' + pizza.id + '-' + option.id"
                :value="option"
                v-model="selectedOptions[pizza.id]"
              />
              <label :for="'size-' + pizza.id + '-' + option.id">
                <span>{{ option.name }}</span>
                <span class="price">{{ option.price }} €</span>
              </label>
            </div>
          </div>

          <button @click="addPizzaToCart(pizza.id)" class="pizza-card__btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
// Pizzas

.pizza-filter {
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto 0 auto;
}

/* sidebar */
.pizza-filter__sidebar {
  width: 320px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin: 0 auto 25px auto;
}

.cards-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin: 0 auto;
  @media (max-width: 991.98px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 767.98px) {
     grid-template-columns: repeat(1, 1fr);
  }
}

.pizza-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &__image {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 16px;
  }

  &__title {
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #1a1a1a;
    margin-bottom: 8px;
  }

  &__description {
    font-size: 13px;
    color: #888;
    line-height: 1.5;
    margin-bottom: 16px;
  }

  &__size-label {
    font-size: 12px;
    color: #aaa;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__sizes {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    margin-bottom: 20px;
  }

  &__size-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #555;
  }

  &__size-row input[type='radio'] {
    accent-color: #e63946;
    cursor: pointer;
  }

  &__size-row label {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  &__size-row span.price {
    color: #e63946;
    font-weight: 600;
  }

  &__btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: 2px solid #1a1a1a;
    color: #1a1a1a;
    padding: 10px 20px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    cursor: pointer;
    letter-spacing: 0.5px;
    transition:
      background 0.2s,
      color 0.2s;
    width: 100%;
    justify-content: center;
  }

  &__btn:hover {
    background: #1a1a1a;
    color: #fff;
  }

  &__btn svg {
    width: 16px;
    height: 16px;
  }
}

.pizza-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
</style>
