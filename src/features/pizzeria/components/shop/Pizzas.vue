<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useProductStore } from '@/stores/productStore.ts'
import notFound from '@/assets/images/not-found.webp'
import { useCartStore } from '@/stores/cartStore.ts'
import InputSearch from '@/templates/input-search/InputSearch.vue'

gsap.registerPlugin(ScrollTrigger)

const productStore = useProductStore()
const cartStore = useCartStore()

const loadPizzas = async () => {
  try {
    await productStore.getProduct()
  } catch (e) {
    console.error(e)
  }
}

const pizzas = computed(() => productStore.products)

const selectedOptions = ref<{ [key: number]: any }>({})

watch(
  pizzas,
  (newPizzas) => {
    newPizzas.forEach((pizza) => {
      if (!selectedOptions.value[pizza.id]) {
        selectedOptions.value[pizza.id] =
          pizza.productOption.find((option) => option.name.toLowerCase().includes('grande')) ||
          pizza.productOption[0]
      }
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
}

// GSAP ANIMATION

const searchGsap = ref<HTMLElement | null>(null)
const pizzasGsap = ref<HTMLElement | null>(null)

const pizzaGsapAnimation = async () => {
  await nextTick()

  const pizza = pizzasGsap.value
  const search = searchGsap.value

  if (!pizza || !search) return

  const isDesktop = window.innerWidth >= 767.98

  const tl = gsap.timeline()

  tl.from(search, {
    opacity: 0,
    y: isDesktop ? 20 : 0,
    filter: 'blur(8px)',
    duration: isDesktop ? 0.6 : 0.8,
    ease: 'power3.out',
  })

  const cardsGrid = pizza.querySelectorAll('.grid-pizzas')
  if (!cardsGrid.length) return

  tl.from(cardsGrid, {
    opacity: 0,
    y: isDesktop ? 15 : 10,
    filter: 'blur(8px)',
    duration: isDesktop ? 0.6 : 0.8,
    ease: 'power3.out',
    stagger: isDesktop ? 0.2 : 0.4,
    clearProps: 'filter',
  })
}

watch(
  () => productStore.searchTerm,
  (term: string) => {
    productStore.searchProducts(term)
  },
)

onMounted(async () => {
  await loadPizzas()
  await pizzaGsapAnimation()
})
</script>

<template>
  <section v-if="productStore.isLoading" class="spinner">
    <span class="loader"></span>
  </section>

  <!-- Pizzas Filter -->
  <section v-else-if="productStore.products.length > 0" class="pizza">
    <div class="pizza__search" ref="searchGsap">
      <InputSearch
        :term="productStore.searchTerm"
        @update:term="productStore.searchTerm = $event"
      />
    </div>
    <!-- Pizzas -->
    <div class="cards-grid" ref="pizzasGsap">
      <div v-for="pizza in pizzas" :key="pizza.id" class="grid-pizzas">
        <!-- Card -->
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
              <input type="radio" :value="option" v-model="selectedOptions[pizza.id]" />

              <label>
                <span>{{ option.name }}</span>
                <span class="price">{{ option.price }} €</span>
              </label>
            </div>
          </div>

          <div class="pizza-card__button">
            <button @click="addPizzaToCart(pizza.id)" class="btn-command">
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
    </div>
    <!-- Pizzas Load -->

    <div class="pizza-load" v-if="productStore.hasMore">
      <button @click="productStore.loadProducts()" type="button" class="btn btn-load">
        Plus de pizzas
      </button>
    </div>
  </section>
  <!-- Empty Pizzas -->

  <section v-else class="empty-pizza">
    <span class="empty-pizza__text">Aucune pizza.</span>
  </section>
</template>

<style scoped lang="scss">
// Spinner

.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100dvh - 80px);
  .loader {
    width: 35px;
    height: 35px;
    border: 5px solid black;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    @media (max-width: 767.98px) {
      width: 30px;
      height: 30px;
    }
  }
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

// PIZZAS

.pizza {
  padding: 40px 20px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto 0 auto;
  @media (max-width: 1600px) {
    max-width: 1100px;
  }
  @media (max-width: 767.98px) {
    padding: 30px 20px;
  }
}

/* Search */
.pizza__search {
  margin: 0 auto 35px auto;
  @media (max-width: 767.98px) {
    margin: 0 auto 30px auto;
  }
}

.cards-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin: 0 auto;
  @media (max-width: 1600px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  @media (max-width: 991.98px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  @media (max-width: 767.98px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  @media (max-width: 575.98px) {
    grid-template-columns: repeat(1, 1fr);
    gap: 15px;
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

  &__button {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__button .btn-command {
    display: flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: 1px solid #1a1a1a;
    color: #1a1a1a;
    padding: 10px 14px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    cursor: pointer;
    letter-spacing: 0.5px;
    transition:
      background 0.2s,
      color 0.2s;
    width: 100%;
    justify-content: center;
    max-width: 250px;
  }
  &__button .btn-command:hover {
    background: #1a1a1a;
    color: #fff;
  }
  &__button .btn-command svg {
    width: 16px;
    height: 16px;
  }
}
.pizza-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

// Pizzas Load

.pizza-load {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  @media (max-width: 767.98px) {
    margin-top: 20px;
  }
  .btn-load {
    height: 44px;
    min-width: 180px;
    padding: 0 24px;
    border: 1px solid #1a1a1a;
    border-radius: 6px;
    background: #fff;
    color: #1a1a1a;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition:
      background 0.25s ease,
      color 0.25s ease,
      transform 0.2s ease,
      box-shadow 0.2s ease;
    @media (max-width: 767.98px) {
      padding: 0;
      height: 40px;
      font-size: 10px;
    }
    &:hover {
      background: #1a1a1a;
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    }
    &:active {
      transform: translateY(0);
      box-shadow: none;
    }
  }
}

// Empty pizza

.empty-pizza {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100dvh - 80px);
  &__text {
    font-size: 15px;
    color: black;
    @media (max-width: 991.98px) {
      font-size: 14px;
    }
    @media (max-width: 767.98px) {
      font-size: 13px;
    }
  }
}
</style>
