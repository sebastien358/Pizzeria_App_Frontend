<script setup lang="ts">
import { nextTick, onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const testimonialsGsapAnimation = async () => {
  await nextTick()

  const tl = gsap.timeline()

  tl.from('.testimonials__label', {
    opacity: 0,
    y: 30,
    duration: 0.6,
    ease: 'power3.out',
  })

  tl.from(
    '.testimonials__title',
    {
      opacity: 0,
      x: -60,
      duration: 0.6,
      ease: 'power3.out',
    },
    '-=0.25',
  )

  tl.from(
    '.testimonials__subtitle',
    {
      opacity: 0,
      x: 60,
      duration: 0.6,
      ease: 'power3.out',
    },
    '-=0.25',
  )

  tl.from(
    '.testimonials__summary',
    {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: 'power3.out',
    },
    '-=0.35',
  )

  tl.from(
    '.testimonials__filter',
    {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.4,
      ease: 'power3.out',
    },
    '-=0.35',
  )

  tl.from(
    '.testimonials__card',
    {
      opacity: 0,
      y: 40,
      stagger: 0.15,
      duration: 0.6,
      ease: 'power3.out',
    },
    '-=0.25',
  )

  tl.from(
    '.testimonials__add',
    {
      opacity: 0,
      y: 20,
      duration: 0.4,
      ease: 'power3.out',
    },
    '-=0.25',
  )

  tl.from(
    '.testimonials__modal',
    {
      opacity: 0,
      y: 0,
      scale: 1,
      repeat: 1,
      duration: 0.8,
      ease: 'power3.out',
    },
    '-=0.25',
  )
}

onMounted(async () => {
  await testimonialsGsapAnimation()
})
</script>

<template>
  <section class="testimonials">
    <div class="testimonials__header">
      <span class="testimonials__label">Avis clients</span>
      <h1 class="testimonials__title">Tous les témoignages</h1>
      <p class="testimonials__subtitle">Découvrez ce que nos clients pensent de nos pizzas.</p>
    </div>

    <div class="testimonials__summary">
      <div class="testimonials__summary-item">
        <span class="testimonials__summary-number">4.8</span>
        <span class="testimonials__summary-label">Note moyenne</span>
      </div>
      <div class="testimonials__summary-item">
        <span class="testimonials__summary-number testimonials__summary-number--red">142</span>
        <span class="testimonials__summary-label">Avis clients</span>
      </div>
      <div class="testimonials__summary-item">
        <span class="testimonials__summary-number">94%</span>
        <span class="testimonials__summary-label">Recommandent</span>
      </div>
    </div>

    <div class="testimonials__filters">
      <button class="testimonials__filter active">Tous</button>
      <button class="testimonials__filter">★★★★★ 5 étoiles</button>
    </div>

    <div class="testimonials__grid">
      <div class="testimonials__card">
        <div class="testimonials__card-stars">★★★★★</div>
        <p class="testimonials__card-text">« message »</p>
        <div class="testimonials__card-author">
          <div class="testimonials__card-avatar">Sébastien P.</div>
          <div>
            <p class="testimonials__card-name">Sébastien</p>
            <p class="testimonials__card-date">Date</p>
          </div>
        </div>
      </div>
    </div>

    <div class="testimonials__modal">
      <button class="btn btn-testimonial">Ajouter un témoignage</button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.testimonials {
  padding: 60px 20px;
  max-width: 1000px;
  margin: 0 auto;

  height: calc(100dvh - 80px);

  &__header {
    text-align: center;
    margin-bottom: 36px;
  }

  &__label {
    display: inline-block;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #e63946;
    margin-bottom: 10px;
  }

  &__title {
    font-size: 32px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 8px;
  }

  &__subtitle {
    font-size: 14px;
    color: #777;
    margin: 0;
  }

  &__summary {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;
    padding: 16px 30px;
    background: #f8f5f0;
    border-radius: 12px;
    max-width: 400px;
    margin: 0 auto 36px;
  }

  &__summary-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  &__summary-number {
    font-size: 24px;
    font-weight: 600;
    color: #1a1a1a;

    &--red {
      color: #e63946;
    }
  }

  &__summary-label {
    font-size: 11px;
    color: #999;
  }

  &__filters {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 36px;
    flex-wrap: wrap;
  }

  &__filter {
    padding: 6px 16px;
    border-radius: 50px;
    border: 1px solid #ddd;
    background: #fff;
    font-size: 13px;
    color: #555;
    cursor: pointer;
    transition: all 0.15s;

    &:hover {
      border-color: #e63946;
      color: #e63946;
    }

    &.active {
      background: #e63946;
      color: white;
      border-color: #e63946;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  &__card {
    background: #fff;
    border: 1px solid #eee;
    border-radius: 12px;
    padding: 20px;
    transition:
      transform 0.2s,
      box-shadow 0.2s;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.07);
    }
  }

  &__card-stars {
    color: #e63946;
    font-size: 13px;
    letter-spacing: 2px;
    margin-bottom: 10px;
  }

  &__card-text {
    font-size: 13px;
    color: #555;
    line-height: 1.6;
    font-style: italic;
    margin: 0 0 16px;
  }

  &__card-author {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__card-avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #fce8e9;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    color: #e63946;
    flex-shrink: 0;
  }

  &__card-name {
    font-size: 13px;
    font-weight: 500;
    color: #1a1a1a;
    margin: 0;
  }

  &__card-date {
    font-size: 11px;
    color: #aaa;
    margin: 2px 0 0;
  }

  &__modal {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }

  &__modal {
    display: flex;
    justify-content: center;
    margin-top: 40px;

    .btn-testimonial {
      background: #e63946;
      color: white;
      border: none;
      padding: 12px 28px;
      border-radius: 50px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.2s;

      &:hover {
        background: #c1121f;
      }
    }
  }
}

@media (max-width: 1024px) {
  .testimonials {
    &__grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@media (max-width: 767.98px) {
  .testimonials {
    padding: 40px 15px;

    &__title {
      font-size: 24px;
    }

    &__grid {
      grid-template-columns: 1fr;
    }

    &__summary {
      gap: 20px;
      padding: 14px 20px;
    }

    &__filters {
      gap: 6px;
    }

    &__filter {
      font-size: 12px;
      padding: 5px 12px;
    }
  }
}
</style>
