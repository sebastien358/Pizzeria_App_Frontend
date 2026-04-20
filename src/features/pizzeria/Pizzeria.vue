<script setup lang="ts">
import Shop from '@/features/pizzeria/components/shop/Shop.vue'
import Cart from '@/features/pizzeria/components/cart/Cart.vue'
import { computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore.ts'
import { useCartStore } from '@/stores/cartStore.ts'

const productStore = useProductStore()

const products = computed(() => productStore.product)

onMounted(async () => {
  try {
    await productStore.getProduct()
  } catch (e) {
    console.error(e)
  }
})

// Récupératiopn du panier

const cartStore = useCartStore()

const cart = computed(() => cartStore.cart)
</script>

<template>
  <div class="boutique">
    <section class="hero">
      <div class="hero__content">
        <h1>Des pizzas artisanales, livrées chez vous 🍕</h1>
        <p>Commandez en quelques clics et savourez une vraie pizza italienne.</p>

        <a href="#menu" class="btn">Commander maintenant</a>
      </div>

      <img src="@/assets/images/hero-pizza.png" alt="Pizza" class="hero-pizza" />
    </section>

    <Shop :products="products" :isLoading="productStore.isLoading" />
    <!--<Cart :cart="cart" :total="cartStore.total" :itemToCart="cartStore.itemsToCartExisting" />-->
  </div>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8%;

  /* TON IMAGE BOIS */
  background-image: url('@/assets/images/1000034631.jpg');
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

/* Petit filtre pour lisibilité */
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
}

/* TEXTE */
.hero__content {
  position: relative;
  z-index: 2;
  max-width: 500px;
  color: #fff;
}

.hero__content h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: 1rem;
}

.hero__content p {
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* BOUTON */
.btn {
  padding: 1rem 1.5rem;
  background: #d62828;
  color: white;
  text-decoration: none;
  border-radius: 999px;
  font-weight: bold;
}

/* PIZZA */
.hero-pizza {
  position: absolute;
  right: 2%;
  top: 55%;
  width: 650px;
  transform: translateY(-50%) rotate(-8deg) scale(1.05);
  filter: drop-shadow(0 25px 40px rgba(0, 0, 0, 0.3));
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  .hero-pizza {
    position: relative;
    right: auto;
    bottom: auto;
    margin-top: 2rem;
    width: 300px;
    transform: rotate(0);
  }
}
</style>
