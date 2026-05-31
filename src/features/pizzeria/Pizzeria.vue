<script setup lang="ts">
import Shop from '@/features/pizzeria/components/shop/Shop.vue'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useProductStore } from '@/stores/productStore.ts'
import Newsletter from '@/templates/newsletter/Newsletter.vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollToTop } from '@/shared/scroll-top/.scrollTop.ts'
const { showScrollTop, scrollToTop } = useScrollToTop()

gsap.registerPlugin(ScrollTrigger)

const productStore = useProductStore()
const products = computed(() => productStore.products)

async function productLoad() {
  try {
    await productStore.getProduct()
  } catch (e) {
    console.error(e)
  }
}

/*=======================
  HERO GSAP
=======================*/

async function heroGsapAnimation() {
  const tl = gsap.timeline()

  await nextTick()

  tl.from('.hero__text h1', {
    opacity: 0,
    y: 40,
    duration: 1,
  })

    .from(
      '.hero__text p',
      {
        opacity: 0,
        y: 30,
        duration: 0.8,
      },
      '-=0.6',
    )

    .from(
      '.btn-hero',
      {
        opacity: 0,
        y: 20,
        duration: 0.8,
      },
      '-=0.5',
    )

    .from(
      '.hero-pizza',
      {
        opacity: 0,
        x: 80,
        rotate: -20,
        duration: 1,
        ease: 'power3.out',
      },
      '-=1',
    )
}

/*=======================
  ABOUT GSAP
=======================*/

const aboutGsap = ref<HTMLElement | null>(null)

async function aboutGsapAnimation() {
  const about = aboutGsap.value

  if (!about) return

  await nextTick()

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: about,
      start: 'top 75%',
      once: true,
    },
  })

  tl.from(about.querySelector('.about-subtitle'), {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power3.out',
  })

    .from(
      about.querySelector('.about-intro h2'),
      {
        opacity: 0,
        y: 35,
        duration: 0.8,
        ease: 'power3.out',
      },
      '-=0.3',
    )

    .from(
      about.querySelector('.about-intro p'),
      {
        opacity: 0,
        y: 25,
        duration: 0.7,
        ease: 'power3.out',
      },
      '-=0.35',
    )

    .from(
      about.querySelector('.about-signature'),
      {
        opacity: 0,
        scale: 0.85,
        duration: 0.7,
        ease: 'back.out(1.7)',
      },
      '-=0.2',
    )

    .from(
      about.querySelectorAll('.stat-item'),
      {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out',
      },
      '-=0.25',
    )
}

/*=======================
  INGREDIENTS GSAP
=======================*/

const ingredientsGsap = ref<HTMLElement | null>(null)

async function ingredientGsapAnimation() {
  const ingredients = ingredientsGsap.value

  if (!ingredients) return

  await nextTick()

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ingredients,
      start: 'top 80%',
      once: true,
    },
  })

  tl.from('.ingredients__subtitle', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power2.out',
  })

    .from(
      '.ingredients__heading h2',
      {
        opacity: 0,
        y: 25,
        duration: 0.8,
        ease: 'power3.out',
      },
      '-=0.35',
    )

    .from(
      '.ingredients__line',
      {
        opacity: 0,
        y: 25,
        duration: 0.6,
        ease: 'power3.out',
      },
      '-=0.35',
    )

    .from(
      '.ingredients__visual',
      {
        opacity: 0,
        x: -40,
        duration: 1,
        ease: 'power3.out',
      },
      '-=0.25',
    )

    .from(
      '.ingredients__text',
      {
        opacity: 0,
        x: 40,
        duration: 1,
        ease: 'power3.out',
      },
      '-=0.9',
    )
}

/*=======================
  BENEFITS GSAP
=======================*/

const benefitsGsap = ref<HTMLElement | null>(null)

async function benefitsGsapAnimation() {
  const benefits = benefitsGsap.value

  await nextTick()

  if (!benefits) return

  const items = benefits.querySelectorAll('.benefits__item')

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: benefits,
      start: 'top 85%',
      once: true,
    },
  })

  tl.from(benefits, {
    opacity: 0,
    y: 35,
    duration: 0.8,
    ease: 'power3.out',
  })

  if (items.length) {
    tl.from(
      items,
      {
        opacity: 0,
        y: 25,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out',
      },
      '-=0.45',
    )
  }
}

// Gsap animation reviews

const reviewsGsap = ref<HTMLElement | null>(null)

const reviewsGsapAnimation = async () => {
  const reviews = reviewsGsap.value

  if (!reviews) return

  await nextTick()

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: reviews,
      start: 'top 80%',
      once: true
    }
  })

  tl.from('.reviews__label', {
    opacity: 0,
    y: 30,
    duration: 0.6,
    ease: 'power3.out',
  })

  tl.from(
    '.reviews__title',
    {
      opacity: 0,
      y: 0,
      x: -60,
      duration: 0.6,
      ease: 'power3.out',
    },
    '-=0.25',
  )

  tl.from(
    '.reviews__subtitle',
    {
      opacity: 0,
      y: 0,
      x: 60,
      duration: 0.6,
      ease: 'power3.out',
    },
    '-=0.25',
  )

  tl.from(
    '.reviews__summary',
    {
      opacity: 0,
      y: 30,
      x: 0,
      duration: 0.6,
      ease: 'power3.out',
    },
    '-=0.35',
  )

  tl.from(
    '.reviews__card',
    {
      opacity: 0,
      y: 40,
      x: 0,
      stagger: 0.2,
      duration: 0.6,
      ease: 'power3.out',
    },
    '-=0.35',
  )

  tl.from(
    '.reviews__link',
    {
      opacity: 0,
      y: 12,
      x: 0,
      duration: 0.6,
      ease: 'power3.out',
    },
    '-=0.25',
  )
}

onMounted(async () => {
  await productLoad()
  await reviewsGsapAnimation()
  await heroGsapAnimation()
  await aboutGsapAnimation()
  await ingredientGsapAnimation()
  await benefitsGsapAnimation()
})
</script>

<template>
  <main class="boutique">
    <!-- HERO -->

    <section class="hero">
      <div class="hero__content">
        <div class="hero__text">
          <h1>Des pizzas artisanales, livrées chez vous 🍕</h1>
          <p>Commandez en quelques clics et savourez une vraie pizza italienne.</p>
          <router-link to="/pizzas" class="btn-hero">Commander maintenant</router-link>
        </div>
      </div>
      <img src="../../assets/images/hero-pizza.png" alt="Pizza" class="hero-pizza" />
    </section>

    <!-- ABOUT -->

    <section class="about-section" ref="aboutGsap">
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

    <section class="ingredients" ref="ingredientsGsap">
      <div class="ingredients__container">
        <div class="ingredients__heading">
          <span class="ingredients__subtitle">NOS SAVEURS</span>
          <h2>Nos ingrédients</h2>
          <div class="ingredients__line"></div>
        </div>

        <div class="ingredients__content">
          <div class="ingredients__visual">
            <img
              src="@/assets/images/ingredients.png"
              alt="Illustration d'ingrédients"
              class="ingredients-img"
            />
          </div>

          <div class="ingredients__text">
            <p>
              Nous sélectionnons avec soin des ingrédients de qualité pour proposer des pizzas
              généreuses, savoureuses et préparées avec attention à chaque commande.
            </p>

            <p>
              Poivrons, tomates, olives, huile d’olive, herbes aromatiques, fromage et charcuterie
              s’associent pour créer des recettes gourmandes et équilibrées, inspirées d’un vrai
              savoir-faire.
            </p>

            <div class="ingredients__button">
              <router-link to="/pizzas" class="ingredients-button">Découvrir la carte</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BENEFITS SECTION -->

    <section class="benefits" ref="benefitsGsap">
      <section class="benefits__list">
        <article class="benefits__item">
          <div class="benefits__item__icon">
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

        <article class="benefits__item">
          <div class="benefits__item__icon">
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

        <article class="benefits__item">
          <div class="benefits__item__icon">
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

        <article class="benefits__item">
          <div class="benefits__item__icon">
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
    </section>

    <!-- REVIEWS -->

    <section class="reviews" ref="reviewsGsap">
      <div class="reviews__header">
        <span class="reviews__label">Témoignages</span>
        <h2 class="reviews__title">Ce que disent nos clients</h2>
        <p class="reviews__subtitle">Plus de 150 commandes, des clients satisfaits.</p>

        <div class="reviews__summary">
          <span class="reviews__score">4.8</span>
          <div class="reviews__summary-detail">
            <div class="reviews__stars">★★★★★</div>
            <span class="reviews__count">Basé sur 142 avis</span>
          </div>
        </div>
      </div>

      <div class="reviews__grid">
        <div class="reviews__card">
          <div class="reviews__card-stars">★★★★★</div>
          <p class="reviews__card-text">
            « La meilleure pizza que j'ai commandée en ligne. La pâte est incroyable, livrée bien
            chaude. »
          </p>
          <div class="reviews__card-author">
            <div class="reviews__card-avatar">ML</div>
            <div>
              <p class="reviews__card-name">Marie L.</p>
              <p class="reviews__card-date">Il y a 3 jours</p>
            </div>
          </div>
        </div>

        <div class="reviews__card">
          <div class="reviews__card-stars">★★★★★</div>
          <p class="reviews__card-text">
            « Commande facile, livraison rapide et pizzas vraiment artisanales. Je recommande ! »
          </p>
          <div class="reviews__card-author">
            <div class="reviews__card-avatar">TM</div>
            <div>
              <p class="reviews__card-name">Thomas M.</p>
              <p class="reviews__card-date">Il y a 1 semaine</p>
            </div>
          </div>
        </div>

        <div class="reviews__card">
          <div class="reviews__card-stars">★★★★☆</div>
          <p class="reviews__card-text">
            « Très bonne pizza Savoyarde. La prochaine fois j'essaie la Burrata. »
          </p>
          <div class="reviews__card-author">
            <div class="reviews__card-avatar">SC</div>
            <div>
              <p class="reviews__card-name">Sophie C.</p>
              <p class="reviews__card-date">Il y a 2 semaines</p>
            </div>
          </div>
        </div>
      </div>

      <div class="reviews__link">
        <router-link to="/testimonials">Liste des commentaires</router-link>
      </div>
    </section>

    <!-- NEWSLETTER -->

    <Newsletter />

    <!-- SCROLL TO TOP -->
    <button class="scroll-top" :class="{ 'is-visible': showScrollTop }" @click="scrollToTop()">
      ↑
    </button>
  </main>
</template>

<style scoped lang="scss">
/*==========================
  SCROLL TO TOP
==========================*/

.scroll-top {
  z-index: 100;
  opacity: 0;
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 60px;
  height: 60px;
  font-size: 19px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e63030, #c42828);
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(230, 48, 48, 0.35);
  pointer-events: none;
  transform: translateY(10px);
  transition: all 0.3s ease;
  @media (max-width: 1600px) {
    width: 56px;
    height: 56px;
    font-size: 18px;
    right: 20px;
    bottom: 24px;
  }
  @media (max-width: 991.98px) {
    width: 54px;
    height: 54px;
    font-size: 17px;
    right: 15px;
    bottom: 20px;
  }
  @media (max-width: 767.98px) {
    width: 44px;
    height: 44px;
    font-size: 16px;
    right: 15px;
    bottom: 20px;
  }
  &.is-visible {
    opacity: 1;
    pointer-events: auto;
  }
}

/* ===== HERO ===== */

.hero {
  z-index: 1;
  position: relative;
  height: calc(100dvh - 80px);
  min-height: 620px;
  padding: 0 6% 0 8%;
  background-image: url('@/assets/images/1000034631.jpg');
  background-size: cover;
  background-position: center;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

/* Overlay sombre */
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.58);
  z-index: 1;
}

/* Lueur orangée subtile côté pizza */
.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at 75% 50%, rgba(255, 160, 70, 0.09), transparent 40%);
  z-index: 1;
}

/* ===== CONTENU TEXTE ===== */
.hero__content {
  position: relative;
  z-index: 3;
  color: #fff;
}

.hero__text h1 {
  font-size: clamp(2.6rem, 4.2vw, 5rem);
  line-height: 1;
  margin-bottom: 1.4rem;
  letter-spacing: -1px;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.hero__text p {
  max-width: 420px;
  margin-bottom: 2.2rem;
  line-height: 1.8;
  font-size: clamp(0.95rem, 1.1vw, 1.1rem);
  color: rgba(255, 255, 255, 0.85);
}

/* ===== BOUTON ===== */
.btn-hero {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0.9rem 1.8rem;
  background: #d62828;
  color: #fff;
  text-decoration: none;
  border-radius: 999px;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.5px;
  box-shadow: 0 12px 28px rgba(214, 40, 40, 0.38);
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease;
}

.btn-hero:hover {
  background: #e33434;
  transform: translateY(-3px);
  box-shadow: 0 18px 36px rgba(214, 40, 40, 0.48);
}

.btn-hero:active {
  transform: translateY(0) scale(0.97);
}

/* ===== IMAGE PIZZA ===== */
.hero-pizza {
  position: relative;
  z-index: 2;
  width: clamp(360px, 42vw, 680px);
  max-width: 100%;
  justify-self: end;
  pointer-events: none;
  transform: rotate(-8deg);
  filter: drop-shadow(0 38px 55px rgba(0, 0, 0, 0.55));
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgba(0, 0, 0, 0.58);
}

.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: radial-gradient(circle at 70% 50%, rgba(255, 160, 70, 0.08), transparent 30%);
}

/* RESPONSIVE */

/* ===== RESPONSIVE 1280px ===== */
@media (max-width: 1600px) {
  .hero {
    padding: 0 0 0 100px;
  }
  .hero__text h1 {
    font-size: 3rem;
    line-height: 1.2;
    margin-bottom: 0.9rem;
  }
  .hero-pizza {
    width: 500px;
    justify-self: center;
  }
}

/* ===== RESPONSIVE 1280px ===== */
@media (max-width: 1280px) {
  .hero {
    padding: 60px 20px 40px;
  }
  .hero-pizza {
    width: clamp(320px, 38vw, 560px);
  }
}

/* ===== RESPONSIVE TABLETTE (1024px) ===== */
@media (max-width: 1024px) {
  .hero {
    height: auto;
    min-height: calc(100dvh - 80px);
    padding: 60px 20px 40px;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    justify-items: center;
    text-align: center;
    row-gap: 2rem;
  }

  .hero::after {
    display: none;
  }

  .hero__content {
    width: 100%;
    max-width: 560px;
  }

  .hero__text p {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-pizza {
    width: min(340px, 70vw);
    transform: rotate(0deg);
  }
}

/* ===== RESPONSIVE MOBILE (768px) ===== */
@media (max-width: 768.98px) {
  .hero {
    min-height: calc(100dvh - 80px);
    padding: 40px 16px 32px;
    row-gap: 1.2rem;
    align-content: center;
  }

  .hero__text h1 {
    font-size: 2rem;
    line-height: 1.2;
    margin-bottom: 0.9rem;
  }

  .hero__text p {
    font-size: 1rem;
    line-height: 1.65;
    margin-bottom: 1.4rem;
    max-width: 300px;
  }

  .hero-pizza {
    width: min(280px, 80vw);
  }
}

@media (max-width: 430px) {
  .hero {
    padding: 50px 14px 24px 14px;
    row-gap: 1rem;
  }
  .hero__text h1 {
    font-size: 1.8rem;
    line-height: 1.3;
  }

  .hero__text p {
    font-size: 0.9rem;
    line-height: 1.55;
    max-width: 260px;
  }

  .hero-pizza {
    width: min(240px, 72vw);
  }

  /* ===== BOUTON ===== */
  .btn-hero {
    gap: 8px;
    padding: 1rem 1.8rem;
    font-size: 13px;
  }
}

@media (max-width: 380px) {
  .hero {
    padding: 50px 14px 24px 14px;
    row-gap: 1rem;
  }

  .hero__text h1 {
    font-size: 1.8rem;
    line-height: 1.3;
  }

  .hero__text p {
    font-size: 0.76rem;
  }

  .btn-hero {
    padding: 12px 18px;

    font-size: 11px;
  }

  .hero-pizza {
    width: min(210px, 68vw);
  }

  /* ===== BOUTON ===== */
  .btn-hero {
    gap: 8px;
    padding: 1rem 1.8rem;
    font-size: 13px;
  }
}
/*=====================
ABOUT
=====================*/

.about-section {
  background: #f8f6f2;
  padding: 110px 20px 90px 20px;
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

@media (max-width: 1600px) {
  .about-section {
    padding: 70px 20px 60px 20px;
  }

  .about-intro h2 {
    font-size: 49px;
    line-height: 1.1;
    color: #1f1f1f;
    margin-bottom: 22px;
  }
  .about-stats .stat-item h3 {
    font-size: 34px;
  }
  .about-stats .stat-item p {
    font-size: 14px;
  }
}

@media (max-width: 1024px) {
  .about-section {
    padding: 70px 20px 70px 20px;
  }
}

@media (max-width: 991.98px) {
  .about-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768.98px) {
  .about-section {
    padding: 50px 20px 50px 20px;
    h2 {
      font-size: 30px;
      line-height: 1.2;
    }
  }
  .about-stats {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .about-signature {
    margin: -10px 0 50px 0;
  }
  .signature-text {
    font-size: 1.2rem;
    padding: 12px 22px;
  }
  .about-intro p {
    font-size: 1rem;
    line-height: 1.6;
  }

  .about-stats {
    margin-top: 0;
  }
  .about-stats .stat-item h3 {
    font-size: 26px;
  }
  .about-stats .stat-item p {
    font-size: 14px;
  }
}

/*=====================
INGRÉDIENTS
=====================*/

.ingredients {
  background: #f5f3ef;
  overflow: hidden;
  padding: 70px 20px 0 20px;
  &__content {
    margin-top: -10px;
    margin-bottom: 10px;
  }
  &__features {
    margin-top: -10px;
  }
  &__container {
    max-width: 1100px;
    margin: 0 auto;
  }
  &__heading {
    text-align: center;
    margin-bottom: 10px;
  }
  &__subtitle {
    display: inline-block;
    margin-bottom: 6px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #df2f2f;
  }
  &__heading h2 {
    margin: 0;
    font-size: 3.4rem;
    line-height: 1;
    text-transform: uppercase;
    color: #2c2c2c;
  }
  &__line {
    width: 52px;
    height: 3px;
    margin: 10px auto 0;
    border-radius: 999px;
    background: #df2f2f;
  }
  &__awning {
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
  &__content {
    margin-top: -20px;
    display: grid;
    grid-template-columns: 1.07fr 1fr;
    align-items: center;
    margin-bottom: 30px;
  }
  &__visual {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .ingredients-img {
    display: block;
    width: 100%;
    max-width: 1000px;
    height: 320px;
    filter: drop-shadow(0 8px 14px rgba(0, 0, 0, 0.08));
    position: relative;
    left: 35px;
  }
  &__text {
    max-width: 420px;
  }
  &__text p {
    margin: 0 0 14px;
    color: #5e5e5e;
    line-height: 1.8;
    font-size: 0.92rem;
  }
  &__button {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  &__button .ingredients-button {
    margin-top: 4px;
    padding: 12px 24px;
    border-radius: 999px;
    background: #df2f2f;
    color: #fff;
    text-decoration: none;
    font-weight: 700;
    font-size: 0.9rem;
  }
}

@media (max-width: 1600px) {
  .ingredients {
    &__heading h2 {
      font-size: 3rem;
    }
    &__content {
      margin-top: -20px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      margin-bottom: 30px;
    }
    &__text p {
      margin: 0 0 14px;
      line-height: 1.6;
    }
  }
}

@media (max-width: 991.98px) {
  .ingredients {
    &__heading h2 {
      font-size: 2.8rem;
    }

    &__content {
      grid-template-columns: 1fr;
      margin-top: -20px;
    }
    //&__text p {
    //  margin: 0 0 10px;
    //  line-height: 1.2;
    //}
    &__text {
      margin-top: -10px;
      text-align: center;
      max-width: initial;
    }
    .ingredients-img {
      width: 450px;
    }
    &__button {
      justify-content: center;
    }
  }
}

@media (max-width: 767.98px) {
  .ingredients {
    padding: 40px 20px 0 20px;
    margin-top: 40px;
    &__heading h2 {
      font-size: 1.8rem;
    }
    &__content {
      grid-template-columns: 1fr;
      margin-top: -20px;
      gap: 0;
    }
    &__text {
      margin-top: -10px;
      text-align: center;
      max-width: initial;
    }
    .ingredients-img {
      width: 90%;
      height: auto;
      position: relative;
      left: 0;
    }

    &__text p {
      margin: 0 0 14px;
      color: #5e5e5e;
      line-height: 1.6;
      font-size: 0.92rem;
    }
    &__button {
      justify-content: center;
    }
  }
}

/*=====================
BENEFITS
=====================*/
.benefits {
  display: flex;
  align-items: center;
  justify-content: center;
}

.benefits__list {
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.06);
  max-width: 1100px;
  margin: 70px auto 80px auto;
  padding: 0 36px 50px 36px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;

  background: linear-gradient(180deg, #f7f3ed 0%, #f3eee7 100%);
  border: 1px solid #ece3d8;
  border-radius: 18px;
  position: relative;
  overflow: hidden;
}

.benefits__List::before {
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

.benefits__item {
  text-align: center;
  padding: 14px 12px 10px;
  border-radius: 14px;
  transition:
    transform 0.25s ease,
    background 0.25s ease,
    box-shadow 0.25s ease;
}

.benefits__item:hover {
  transform: translateY(-3px);
  transition: all 0.25s ease;
  background: rgba(255, 255, 255, 0.45);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.05);
}

.benefits__item__icon {
  width: 54px;
  height: 54px;
  margin: 0 auto 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #df2f2f;
}

.benefits__item__icon svg {
  width: 100%;
  height: 100%;
  display: block;
  stroke-width: 1.8;
  filter: drop-shadow(0 3px 8px rgba(223, 47, 47, 0.08));
}

.benefits__item h3 {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  color: #2c2c2c;
}

.benefits__item p {
  margin: 0;
  font-size: 15px;
  line-height: 1.75;
  color: #6f6a63;
}

@media (max-width: 1600px) {
  .benefits__list {
    margin: 70px auto 80px auto;
  }
}

@media (max-width: 1024px) {
  .benefits__list {
    margin: 50px 20px 60px 20px;
  }
}

/* TABLETTE */
@media (max-width: 991.98px) {
  .benefits__list {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin: 50px 20px 60px 20px;
  }
  .benefits__item {
    padding: 10px 8px;
  }
}

/* MOBILE */
@media (max-width: 767.98px) {
  .benefits__list {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 0 18px 50px 18px;
    margin: 40px 20px 40px 20px;

    border-radius: 16px;
  }

  .benefits__item__icon {
    width: 46px;
    height: 46px;
    margin-bottom: 14px;
  }

  .benefits__item h3 {
    font-size: 1rem;
    margin-bottom: 8px;
  }

  .benefits__item p {
    font-size: 0.88rem;
    line-height: 1.65;
  }
}

// REVIEWS

.reviews {
  padding: 80px 20px;
  background: #fafaf8;
  text-align: center;

  &__header {
    max-width: 600px;
    margin: 0 auto 50px;
  }

  &__label {
    display: inline-block;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #e63946;
    margin-bottom: 12px;
  }

  &__title {
    font-size: 36px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 12px;
    line-height: 1.2;
  }

  &__subtitle {
    font-size: 15px;
    color: #777;
    margin: 0 0 30px;
  }

  &__summary {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 50px;
    padding: 10px 24px;
  }

  &__score {
    font-size: 32px;
    font-weight: 700;
    color: #1a1a1a;
    line-height: 1;
  }

  &__summary-detail {
    text-align: left;
  }

  &__stars {
    color: #e63946;
    font-size: 16px;
    letter-spacing: 2px;
  }

  &__count {
    font-size: 12px;
    color: #999;
    display: block;
    margin-top: 2px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    max-width: 1000px;
    margin: 0 auto;
  }

  &__card {
    background: #fff;
    border: 1px solid #eee;
    border-radius: 12px;
    padding: 24px;
    text-align: left;
    transition:
      transform 0.2s,
      box-shadow 0.2s;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
    }
  }

  &__card-stars {
    color: #e63946;
    font-size: 14px;
    letter-spacing: 2px;
    margin-bottom: 12px;
  }

  &__card-text {
    font-size: 14px;
    color: #555;
    line-height: 1.7;
    font-style: italic;
    margin: 0 0 18px;
  }

  &__card-author {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__card-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: #fce8e9;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    color: #e63946;
    flex-shrink: 0;
  }

  &__card-name {
    font-size: 13px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
  }

  &__card-date {
    font-size: 12px;
    color: #aaa;
    margin: 2px 0 0;
  }

  &__link {
    margin-top: 60px;
    a {
      font-size: 13px;
      color: #e63946;
      text-decoration: none;
      border-bottom: 1px solid #e63946;
      padding-bottom: 2px;
      transition: opacity 0.2s;
      &:hover {
        opacity: 0.7;
      }
    }
  }
}

@media (max-width: 1024px) {
  .reviews {
    &__grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@media (max-width: 767.98px) {
  .reviews {
    padding: 50px 15px;

    &__title {
      font-size: 26px;
    }

    &__grid {
      grid-template-columns: 1fr;
    }

    &__summary {
      padding: 8px 18px;
    }

    &__score {
      font-size: 26px;
    }
  }
}
</style>
