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

    <section class="about-section">
      <div class="about-container">
        <div class="about-intro">
          <span class="about-subtitle">PIZZERIA ARTISANALE</span>
          <h2>Le goût de l’Italie,<br />à deux pas de chez vous</h2>
          <p>
            Nous préparons des pizzas généreuses avec des ingrédients soigneusement sélectionnés,
            une pâte travaillée avec attention et une cuisson maîtrisée pour un résultat savoureux à
            chaque commande.
          </p>
        </div>

        <div class="about-signature">
          <span class="signature-text">Fait avec passion</span>
        </div>

        <div class="about-stats">
          <div class="stat-item">
            <h3>100%</h3>
            <p>Ingrédients sélectionnés</p>
          </div>

          <div class="stat-item">
            <h3>30 min</h3>
            <p>Livraison rapide</p>
          </div>

          <div class="stat-item">
            <h3>7j/7</h3>
            <p>Commande en ligne</p>
          </div>

          <div class="stat-item">
            <h3>4.8/5</h3>
            <p>Avis clients</p>
          </div>
        </div>
      </div>
    </section>

    <Shop :products="products" :isLoading="productStore.isLoading" />
    <!--<Cart :cart="cart" :total="cartStore.total" :itemToCart="cartStore.itemsToCartExisting" />-->
  </div>
</template>

<style scoped lang="scss">
/*=====================
  HERO
=====================*/

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

/*=====================
  ABOUT
=====================*/

.about-section {
  background: #f8f6f2;
  padding: 110px 20px 90px;
}

.about-container {
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
}

.about-intro {
  max-width: 760px;
  margin: 0 auto 50px;
}

.about-subtitle {
  display: inline-block;
  margin-bottom: 14px;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 3px;
  color: #d62828;
}

.about-intro h2 {
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1.1;
  color: #1f1f1f;
  margin-bottom: 22px;
}

.about-intro p {
  font-size: 1rem;
  line-height: 1.8;
  color: #5a5a5a;
  max-width: 700px;
  margin: 0 auto;
}

.about-signature {
  margin: 35px 0 55px;
}

.signature-text {
  display: inline-block;
  font-size: 2rem;
  font-style: italic;
  color: #b8b0a8;
  border: 2px solid rgba(0, 0, 0, 0.08);
  border-radius: 999px;
  padding: 14px 28px;
}

.about-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
  margin-top: 20px;
}

.stat-item {
  padding: 10px;
}

.stat-item h3 {
  font-size: clamp(2rem, 3vw, 3rem);
  color: #1f1f1f;
  margin-bottom: 8px;
  font-weight: 800;
}

.stat-item p {
  font-size: 0.9rem;
  color: #7a7a7a;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

@media (max-width: 900px) {
  .about-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .about-section {
    padding: 80px 20px 70px;
  }

  .about-stats {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .signature-text {
    font-size: 1.5rem;
    padding: 12px 22px;
  }
}
</style>
