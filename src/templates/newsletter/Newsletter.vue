<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { nextTick, onMounted, ref } from 'vue'

gsap.registerPlugin(ScrollTrigger)

const newsletterGsap = ref<HTMLElement | null>(null)

async function newsletterGsapAnimation() {
  const newsletter = newsletterGsap.value
  if (!newsletter) return

  await nextTick()

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: newsletter,
      start: 'top 85%',
      once: false,
    },
  })

  tl.fromTo(
    '.newsletter__text span',
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
  )
    .fromTo(
      '.newsletter__text h2',
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.35',
    )
    .fromTo(
      '.newsletter__form',
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' },
      '-=0.45',
    )
}

onMounted(async () => {
  setTimeout(async () => {
    await newsletterGsapAnimation()
  }, 350)
})
</script>

<template>
  <section class="newsletter" ref="newsletterGsap">
    <div class="newsletter__container">
      <div class="newsletter__text">
        <span>NEWSLETTER</span>
        <h2>Rejoignez notre newsletter</h2>
      </div>

      <form class="newsletter__form">
        <input type="email" placeholder="Votre adresse e-mail" />
        <button type="button">Envoyer</button>
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
/* NEWSLETTER */

.newsletter {
  overflow-x: hidden;
  background: #df2f2f;
  padding: 80px 20px;
  &__container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    //flex-direction: column;
    align-items: flex-end;

    column-gap: 40px;
    row-gap: 3.5rem;
    flex-wrap: wrap;
  }
  &__text span {
    display: block;
    font-size: 0.8rem;
    letter-spacing: 3px;
    color: rgba(255, 255, 255, 0.85);
    margin-bottom: 10px;
  }
  &__text h2 {
    margin: 0;
    font-size: clamp(2rem, 4vw, 3.2rem);
    color: white;
    text-transform: uppercase;
    line-height: 1;
  }
  &__form {
    display: flex;
    align-items: center;
    gap: 18px;
    flex: 1;
    justify-content: flex-end;
    width: 520px;
  }
  &__form input {
    width: 360px;
    background: transparent;
    border: none;
    border-bottom: 2px solid rgba(255, 255, 255, 0.8);
    padding: 14px 4px;
    color: white;
    font-size: 1rem;
    outline: none;
  }
  &__form input::placeholder {
    color: rgba(255, 255, 255, 0.75);
  }
  &__form button {
    border: none;
    background: white;
    color: #df2f2f;
    padding: 14px 34px;
    border-radius: 999px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.25s ease;
  }
  &__form button:hover {
    transform: translateY(-2px);
  }
}

@media (max-width: 1600px) {
  .newsletter {
    padding: 60px 60px;

    &__container {
      max-width: 1000px;
      row-gap: 20px;
    }
    &__text h2 {
      font-size: 40px;
    }
    &__form input {
      width: 280px;
      background: transparent;
      padding: 15px 4px;
      font-size: 13px;
    }
    &__form button {

      padding: 12px 30px;
      font-size: 12px;


    }
  }
}

@media (max-width: 991.98px) {
  .newsletter {
    padding: 60px 30px;
    &__text h2 {
      font-size: 35px;
    }
    &__form {
      //margin-top: 150px;
    }
    &__form input {
      width: 280px;
      background: transparent;
      padding: 15px 4px;
      font-size: 13px;
    }
  }
}

@media (max-width: 767.98px) {
  .newsletter {
    padding: 40px 20px;
    &__container {
      width: 100%;
      column-gap: 0;
      flex-direction: column;
      align-items: flex-start;
      row-gap: 20px;
    }

    &__text h2 {
      font-size: 1.2rem;
      margin-bottom: 4px;
      line-height: 1.2;
    }

    &__form {
      width: 100%;
      flex-wrap: nowrap;
      gap: 12px;

      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    &__form input {
      flex: 1; /* ← prend tout l'espace dispo */
      padding: 11px 4px;
      width: 100%;
      max-width: 190px;
      font-size: 12px;
    }

    &__form button {
      flex-shrink: 0; /* ← ne rétrécit pas */
      padding: 12px 20px;
      font-size: 11px;
      white-space: nowrap;
    }
  }
}
</style>
