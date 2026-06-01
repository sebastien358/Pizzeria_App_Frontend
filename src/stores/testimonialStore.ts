import { defineStore } from 'pinia'
import { axiosAddTestimonial, axiosTestimonialList } from '@/shared/services/testimonial.service.ts'

export const useTestimonialStore = defineStore('testimonialStore', {
  state: () => ({
    testimonials: [],
    isLoading: true,
    countTestimonials: 0,
    pages: 0,
    currentPage: 1,
    limit: 6,
    totalTestimonial: 0,
    averageRating: 0
  }),
  actions: {
    getItemsPerPage() {
      if (window.innerWidth >= 1600) return 6
      if (window.innerWidth >= 767) return 6
      return 4
    },
    async testimonialList() {
      try {
        this.isLoading = true

        this.limit = this.getItemsPerPage()

        const response = await axiosTestimonialList(this.currentPage, this.limit)
        this.testimonials = response.testimonials
        this.countTestimonials = response.countTestimonials
        this.averageRating = response.averageRating

        this.pages = response.pages
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
