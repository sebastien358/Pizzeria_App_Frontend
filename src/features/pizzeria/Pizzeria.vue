<script setup lang="ts">
import Shop from '@/features/pizzeria/components/shop/Shop.vue'
import Cart from '@/features/pizzeria/components/cart/Cart.vue'
import { computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore.ts'
import { useCartStore } from '@/stores/cartStore.ts'
import Newsletter from '@/templates/Newsletter.vue'

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
  <main class="boutique">
    <!-- HERO -->

    <section class="hero">
      <div class="hero__content">
        <h1>Des pizzas artisanales, livrées chez vous 🍕</h1>
        <p>Commandez en quelques clics et savourez une vraie pizza italienne.</p>

        <a href="#menu" class="btn">Commander maintenant</a>
      </div>

      <img src="@/assets/images/hero-pizza.png" alt="Pizza" class="hero-pizza" />
    </section>

    <!-- ABOUT -->

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

    <!-- PIZZAS -->

    <Shop :products="products" :isLoading="productStore.isLoading" />

    <!-- INGREDIENTS SECTION -->

    <section class="ingredients-section">
      <div class="ingredients-section__container">
        <div class="ingredients-section__heading">
          <span class="ingredients-section__subtitle">NOS SAVEURS</span>
          <h2>Nos ingrédients</h2>
          <div class="ingredients-section__line"></div>
        </div>

        <div class="ingredients-section__awning">
          <img src="@/assets/images/casquette.png" alt="Auvent décoratif" class="awning-img" />
        </div>

        <div class="ingredients-section__content">
          <div class="ingredients-section__visual">
            <img
              src="@/assets/images/ingredients.png"
              alt="Illustration d'ingrédients"
              class="ingredients-img"
            />
          </div>

          <div class="ingredients-section__text">
            <p>
              Nous sélectionnons avec soin des ingrédients de qualité pour proposer des pizzas
              généreuses, savoureuses et préparées avec attention à chaque commande.
            </p>

            <p>
              Poivrons, tomates, olives, huile d’olive, herbes aromatiques, fromage et charcuterie
              s’associent pour créer des recettes gourmandes et équilibrées, inspirées d’un vrai
              savoir-faire.
            </p>

            <a href="#carte" class="ingredients-section__button">Découvrir la carte</a>
          </div>
        </div>
      </div>
    </section>

    <!-- BENEFITS SECTION -->

    <section class="benefits-section">
      <article class="benefit-item">
        <div class="benefit-item__icon">
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <path
              d="M12 10C27 8 41 11 54 18L35 54C30 49 24 46 18 44L12 10Z"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linejoin="round"
            />
            <circle cx="28" cy="24" r="2.5" fill="currentColor" />
            <circle cx="36" cy="30" r="2.5" fill="currentColor" />
            <circle cx="24" cy="35" r="2.5" fill="currentColor" />
          </svg>
        </div>
        <h3>Recettes généreuses</h3>
        <p>Des compositions gourmandes pensées pour le plaisir et la simplicité.</p>
      </article>

      <article class="benefit-item">
        <div class="benefit-item__icon">
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <path
              d="M10 42L28 20H54V48H10V42Z"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linejoin="round"
            />
            <circle cx="40" cy="30" r="3" fill="currentColor" />
            <circle cx="28" cy="37" r="2.5" fill="currentColor" />
            <circle cx="47" cy="40" r="2" fill="currentColor" />
          </svg>
        </div>
        <h3>Produits sélectionnés</h3>
        <p>Des ingrédients choisis avec soin pour garantir goût et qualité.</p>
      </article>

      <article class="benefit-item">
        <div class="benefit-item__icon">
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <path
              d="M50 14C31 14 16 26 16 42C16 50 22 54 30 54C46 54 50 39 50 14Z"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linejoin="round"
            />
            <path
              d="M24 46C30 38 38 30 48 22"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <h3>Saveurs fraîches</h3>
        <p>Des associations équilibrées avec une vraie attention portée aux saveurs.</p>
      </article>
      <article class="benefit-item">
        <div class="benefit-item__icon">
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <path
              d="M34 10C36 18 46 21 46 34C46 45 40 54 30 54C21 54 16 47 16 39C16 29 23 24 28 18C29 24 32 27 36 30C37 24 35 18 34 10Z"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <h3>Cuisson maîtrisée</h3>
        <p>Une cuisson soignée pour une pâte savoureuse et une texture réussie.</p>
      </article>
    </section>
    <Newsletter />
  </main>
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

/*=====================
  INGRÉDIENTS
=====================*/

.ingredients-section {
  background: #f5f3ef;
  overflow: hidden;
  padding: 45px 20px 0 20px;
  .ingredients-section__content {
    margin-top: -10px;
    margin-bottom: 10px;
  }
  .ingredients-section__features {
    margin-top: -10px;
  }
}

.ingredients-section__container {
  max-width: 1100px;
  margin: 0 auto;
}

.ingredients-section__heading {
  text-align: center;
  margin-bottom: 10px;
}

.ingredients-section__subtitle {
  display: inline-block;
  margin-bottom: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: #df2f2f;
}

.ingredients-section__heading h2 {
  margin: 0;
  font-size: clamp(2.1rem, 5vw, 3.4rem);
  line-height: 1;
  text-transform: uppercase;
  color: #2c2c2c;
}

.ingredients-section__line {
  width: 52px;
  height: 3px;
  margin: 10px auto 0;
  border-radius: 999px;
  background: #df2f2f;
}

.ingredients-section__awning {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0;
}

.awning-img {
  display: block;
  width: auto;
  max-width: 500px;
  height: auto;
  filter: drop-shadow(0 10px 14px rgba(0, 0, 0, 0.12));
}

.ingredients-section__content {
  margin-top: -20px;

  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
}

.ingredients-section__visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.ingredients-img {
  display: block;
  width: auto;
  max-width: 500px;
  height: auto;
  filter: drop-shadow(0 8px 14px rgba(0, 0, 0, 0.08));
}

.ingredients-section__text {
  max-width: 420px;
}

.ingredients-section__text p {
  margin: 0 0 14px;
  color: #5e5e5e;
  line-height: 1.8;
  font-size: 0.92rem;
}

.ingredients-section__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
  padding: 12px 24px;
  border-radius: 999px;
  background: #df2f2f;
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
}

/*=====================
  BENEFITS
=====================*/

.benefits-section {
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.06);

  max-width: 1100px;
  margin: 70px auto 80px;
  padding: 42px 36px;

  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;

  background: linear-gradient(180deg, #f7f3ed 0%, #f3eee7 100%);
  border: 1px solid #ece3d8;
  border-radius: 18px;

  position: relative;
  overflow: hidden;
}

.benefits-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, #df2f2f 0%, #f06b6b 100%);
  opacity: 0.9;
}

.benefit-item {
  text-align: center;
  padding: 14px 12px 10px;
  border-radius: 14px;
  transition:
    transform 0.25s ease,
    background 0.25s ease,
    box-shadow 0.25s ease;
}

.benefit-item:hover {
  transform: translateY(-3px);
  transition: all 0.25s ease;
  background: rgba(255, 255, 255, 0.45);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.05);
}

.benefit-item__icon {
  width: 54px;
  height: 54px;
  margin: 0 auto 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #df2f2f;
}

.benefit-item__icon svg {
  width: 100%;
  height: 100%;
  display: block;

  stroke-width: 1.8;
  filter: drop-shadow(0 3px 8px rgba(223, 47, 47, 0.08));
}

.benefit-item h3 {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  color: #2c2c2c;
}

.benefit-item p {
  margin: 0;
  font-size: 15px;
  line-height: 1.75;
  color: #6f6a63;
}

/* TABLETTE */
@media (max-width: 992px) {
  .benefits-section {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    padding: 36px 24px;
    margin: 55px auto 65px;
  }

  .benefit-item {
    padding: 10px 8px;
  }
}

/* MOBILE */
@media (max-width: 640px) {
  .benefits-section {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 28px 18px;
    margin: 40px 16px 50px;
    border-radius: 16px;
  }

  .benefit-item__icon {
    width: 46px;
    height: 46px;
    margin-bottom: 14px;
  }

  .benefit-item h3 {
    font-size: 1rem;
    margin-bottom: 8px;
  }

  .benefit-item p {
    font-size: 0.88rem;
    line-height: 1.65;
  }
}
</style>
