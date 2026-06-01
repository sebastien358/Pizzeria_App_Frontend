<script setup lang="ts">
import ShopPizza from '@/features/pizzeria/components/shop/ShopPizza.vue'
import type { ProductInterface } from '@/shared/interfaces'
import gsap from 'gsap'

import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { computed, nextTick, onMounted, ref } from 'vue'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps<{
  products: ProductInterface[]
  isLoading: boolean
}>()

const visibleProducts = computed(() => {
  if (window.innerWidth > 1600) {
    props.products.slice(0, 4)
    return
  }
  return props.products.slice(0, 3)
})

const pizzaGridGsap = ref<HTMLElement | null>(null)
const hasAnimated = ref(false)

onMounted(async () => {
  hasAnimated.value = false
  await nextTick()

  // Attendre que les cards soient dans le DOM
  const waitForCards = () => {
    return new Promise<NodeListOf<Element>>((resolve) => {
      const check = () => {
        const cards = pizzaGridGsap.value?.querySelectorAll('.pizza__card')
        if (cards && cards.length > 0) {
          resolve(cards)
        } else {
          setTimeout(check, 50)
        }
      }
      check()
    })
  }

  setTimeout(async () => {
    const cards = await waitForCards()

    hasAnimated.value = true

    gsap.fromTo(
      cards,
      { opacity: 0, y: 45, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cards,
          start: 'top 80%',
        },
      },
    )
  }, 350)
})
</script>

<template>
  <!-- loading -->
  <section v-if="props.isLoading" class="spinner">
    <span class="loader"></span>
  </section>
  <!-- products -->
  <section v-else-if="products.length > 0">
    <div class="pizza">
      <div class="pizza__grid" ref="pizzaGridGsap">
        <ShopPizza v-for="product in visibleProducts" :key="product.id" :product="product" />
      </div>
    </div>
  </section>
  <!-- no product -->
  <section v-else class="empty-pizza">
    <p class="empty-pizza__text">Aucun produit pour le moment.</p>
  </section>
</template>

<style scoped lang="scss">
// SPINNER

.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 300px 0;
  .loader {
    width: 35px;
    height: 35px;
    border: 5px solid black;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
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

@media (max-width: 1024px) {
  .spinner {
    margin: 80px 0;
    .loader {
      width: 30px;
      height: 30px;
    }
  }
}

@media (max-width: 767.98px) {
  .spinner {
    margin: 60px 0;
  }
}

// PIZZAS

.pizza {
  background: white;
  &__grid {
    width: 100%;
    max-width: 1800px;
    margin: 0 auto;
    padding: 0 8%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    justify-content: center;
    align-items: stretch;
  }
}

@media (max-width: 1600px) {
  .pizza__grid {
    grid-template-columns: repeat(3, 1fr);
    padding: 0 9%;
  }
}

@media (max-width: 1024px) {
  .pizza__grid {
    grid-template-columns: repeat(2, 1fr);
    padding: 0 5%;
  }
}

@media (max-width: 991.98px) {
  .pizza__grid {
    padding: 0 5%;
  }
}

@media (max-width: 767.98px) {
  .pizza__grid {
    grid-template-columns: repeat(1, 1fr);
    padding: 0 20px 50px;
  }
}

// EMPTY PIZZA

.empty-pizza {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 180px 0;
  &__text {
    font-size: 15px;
  }
}

@media (max-width: 991.98px) {
  .empty-pizza {
    margin: 80px 0;
    &__text {
      font-size: 14px;
    }
  }
}

@media (max-width: 767.98px) {
  .empty-pizza {
    margin: 60px 0;
    &__text {
      font-size: 13px;
    }
  }
}
</style>
