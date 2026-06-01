<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TestimonialModal from '@/templates/modal-testimonial/TestimonialModal.vue'
import { useTestimonialStore } from '@/stores/testimonialStore.ts'
import Pagination from '@/templates/pagination/Pagination.vue'

gsap.registerPlugin(ScrollTrigger)

const testimonialStore = useTestimonialStore()

const testimonialLoad = async () => {
  try {
    await testimonialStore.testimonialList()
  } catch (e) {
    console.error(e)
  }
}

const testimonials = computed(() => testimonialStore.testimonials)

const dateTimeDisplay = (date: Date) => {
  if (!date) return

  const d = new Date(date)

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }

  return new Intl.DateTimeFormat('fr-FR', options).format(d)
}

type ActiveModal = {
  isActive: boolean
}

const state = reactive<ActiveModal>({
  isActive: false,
})

const openModalTestimonial = () => {
  state.isActive = true
}

const closeModalTestimonial = () => {
  state.isActive = false
}

// Pagination

const previousPage = async () => {
  try {
    if (testimonialStore.currentPage > 1) {
      testimonialStore.currentPage--
      await testimonialStore.testimonialList()
    }
  } catch (e) {
    console.error(e)
  }
}

const newtPage = async () => {
  try {
    testimonialStore.currentPage++
    await testimonialStore.testimonialList()
  } catch (e) {
    console.error(e)
  }
}

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
    '.testimonials__list',
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

  tl.from(
    '.testimonials__pagination',
    {
      opacity: 0,
      y: 20,
      duration: 1.2,
      ease: 'power3.out',
    },
    '-=0.15',
  )
}

const isLoadingVisible = ref<boolean>(true)

onMounted(async () => {
  window.scrollTo({ top: 0 })
  await testimonialLoad()

  setTimeout(async () => {
    isLoadingVisible.value = false
    await testimonialsGsapAnimation()
  }, 600)
})
</script>

<template>
  <section class="testimonials">
    <div class="spinner" v-if="isLoadingVisible">
      <div class="loader"></div>
    </div>

    <div v-else-if="testimonials.length > 0">
      <div class="testimonials__header">
        <span class="testimonials__label">Avis clients</span>
        <h1 class="testimonials__title">Tous les témoignages</h1>
        <p class="testimonials__subtitle">Découvrez ce que nos clients pensent de nos pizzas.</p>
      </div>

      <div class="testimonials__summary">
        <div class="testimonials__summary-item">
          <span class="testimonials__summary-number">{{ testimonialStore.averageRating }}</span>
          <span class="testimonials__summary-label">Note moyenne</span>
        </div>
        <div class="testimonials__summary-item">
          <span class="testimonials__summary-number testimonials__summary-number--red">
            {{ testimonialStore.countTestimonials }}</span
          >
          <span class="testimonials__summary-label">Avis clients</span>
        </div>
        <div class="testimonials__summary-item">
          <span class="testimonials__summary-number">94%</span>
          <span class="testimonials__summary-label">Recommandent</span>
        </div>
      </div>

      <div class="testimonials__modal">
        <button @click="openModalTestimonial()" class="btn btn-testimonial">
          Ajouter un témoignage
        </button>
      </div>

      <div class="testimonials__grid">
        <div v-for="t in testimonials" :key="t.id" class="testimonials__list">
          <div class="testimonials__card">
            <div class="testimonials__card-stars" v-for="n in t.rating" :key="n">★</div>
            <p class="testimonials__card-text">« {{ t.message }} »</p>
            <div class="testimonials__card-author">
              <div class="testimonials__card-avatar">
                <img
                  v-if="t.pictures[0]?.filename"
                  :src="t.pictures[0]?.filename"
                  class="img"
                  height="60"
                />
                <span>{{ t.firstname.slice(0, 1) }} {{ t.lastname.slice(0, 1) }}</span>
              </div>

              <div>
                <p class="testimonials__card-name">
                  {{ t.firstname }} {{ t.lastname.slice(0, 1) }}.
                </p>
                <p class="testimonials__card-date">{{ dateTimeDisplay(t.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="testimonialStore.pages > 1" class="testimonials__pagination">
        <Pagination
          :current-page="testimonialStore.currentPage"
          :pages="testimonialStore.pages"
          @previous-page="previousPage()"
          @next-page="newtPage()"
        />
      </div>
    </div>

    <div class="testimonials__empty" v-else>
      <p>Aucun témoignage pour le moment.</p>
    </div>
  </section>

  <TestimonialModal :isActive="state.isActive" @close-modal-testimonial="closeModalTestimonial" />
</template>

<style scoped lang="scss">
// Spinner

.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  //padding: 30px 0 70px 0;
  height: calc(100dvh - 80px);
  @media (max-width: 767.98px) {
    padding: 10px 0 40px 0;
  }
  .loader {
    width: 32px;
    height: 32px;
    border: 5px solid black;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    @media (max-width: 767.98px) {
      width: 28px;
      height: 28px;
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

.testimonials {
  padding: 60px 20px;
  max-width: 1300px;
  margin: 0 auto;

  height: calc(100dvh - 80px);

  &__header {
    text-align: center;
    margin-bottom: 36px;
  }

  &__label {
    display: inline-block;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #e63946;
    margin-bottom: 10px;
    font-size: 13px;
  }

  &__title {
    font-size: 40px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 8px 0;
  }

  &__subtitle {
    font-size: 16px;
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
    font-size: 25px;
    font-weight: 600;
    color: #1a1a1a;
    &--red {
      color: #e63946;
    }
  }

  &__summary-label {
    font-size: 13px;
    color: #999;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: stretch;
    gap: 16px;
  }

  &__card {
    height: 100%;
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
    font-size: 26px;
    letter-spacing: 2px;
    margin-bottom: 10px;
    display: inline-block;
  }

  &__card-text {
    font-size: 18px;
    color: #555;
    line-height: 1.6;
    font-style: italic;
    margin: 10px 0 25px 0;
    word-break: break-word;
  }

  &__card-author {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__card-avatar {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: #fce8e9;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    color: #e63946;
    flex-shrink: 0;
    position: relative;
    .img {
      border-radius: 50%;
      width: 48px;
      height: 48px;
    }
    span {
      position: absolute;
    }
  }

  &__card-name {
    font-size: 15px;
    font-weight: 500;
    color: #1a1a1a;
    margin: 0;
  }

  &__card-date {
    font-size: 13px;
    color: #aaa;
    margin: 4px 0 0;
  }

  &__modal {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 60px;
    margin-top: 40px;
    .btn-testimonial {
      background: #e63946;
      color: white;
      border: none;
      padding: 12px 28px;
      border-radius: 50px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.2s;
      &:hover {
        background: #c1121f;
      }
    }
  }
  &__empty {
    color: #555;
    font-size: 14px;
    padding: 20px;
    background: #f8f5f0;
    border-radius: 8px;
    width: 100%;
    max-width: 250px;
    margin: 0 auto 60px auto;
  }
  &__pagination {
    margin-top: 25px;
  }
}

@media (max-width: 1600px) {
  .testimonials {
    height: 100%;
  }
}

@media (max-width: 1024px) {
  .testimonials {
    height: 100%;
    &__grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@media (max-width: 767.98px) {
  .testimonials {
    padding: 30px 15px;
    &__title {
      font-size: 24px;
    }

    &__summary-number {
      font-size: 23px;
    }

    &__summary-label {
      font-size: 12px;
    }

    &__modal {
      margin-bottom: 40px;
      margin-top: 30px;
    }

    &__modal .btn-testimonial {
      font-size: 11px;
    }

    &__grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    &__summary {
      gap: 20px;
      padding: 14px 20px;
    }

    &__card-stars {
      font-size: 19px;
      letter-spacing: 2px;
      margin-bottom: 10px;
    }

    &__card-text {
      font-size: 15px;
      margin: 5px 0 15px 0;
    }

    &__empty {
      color: #555;
      font-size: 14px;
      padding: 20px;
      background: #f8f5f0;
      border-radius: 8px;
      width: 100%;
      max-width: 250px;
      margin: 0 auto 60px auto;
    }
    &__pagination {
      margin-top: 15px;
    }
  }
}
</style>
