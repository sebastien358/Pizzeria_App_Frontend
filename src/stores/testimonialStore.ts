import { defineStore } from 'pinia'
import { axiosAddTestimonial, axiosTestimonialList } from '@/shared/services/testimonial.service.ts'

export const useTestimonialStore = defineStore('testimonialStore', {
  state: () => ({
    testimonials: [],
    isLoading: true,
    countTestimonials: 0,
  }),
  getters: {
    averageRating(state) {
      if (!state.testimonials.length) return 0
        const total = state.testimonials.reduce((acc, testimonial) => {
          return acc + testimonial.rating
      }, 0)

      return (total / state.testimonials.length).toFixed(1)
    },
  },
  actions: {
    async testimonialList() {
      try {
        this.isLoading = true

        const response = await axiosTestimonialList()
        this.testimonials = response.testimonials
        this.countTestimonials = response.countTestimonials
      } catch (e) {
        this.testimonials = []
        console.error(e)
        throw e
      } finally {
        this.isLoading = false
      }
    },
    async addTestimonial(dataTestimonial: Object) {
      try {
        const formData = new FormData()

        formData.append('firstname', dataTestimonial.firstname)
        formData.append('lastname', dataTestimonial.lastname)
        formData.append('rating', dataTestimonial.rating)
        formData.append('message', dataTestimonial.message)

        dataTestimonial.images?.map((image) => formData.append('images[]', image))

        const response = await axiosAddTestimonial(formData)
        this.testimonials.push(response)

        return response
      } catch (e) {
        console.error(e)
        throw e
      }
    },
  },
})
