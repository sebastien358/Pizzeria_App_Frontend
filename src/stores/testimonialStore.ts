import { defineStore } from 'pinia'
import { axiosAddTestimonial, axiosTestimonialList } from '@/shared/services/testimonial.service.ts'

export const useTestimonialStore = defineStore('testimonialStore', {
  state: () => ({
    testimonials: [],
  }),
  actions: {
    async testimonialList() {
      try {
        const response = await axiosTestimonialList()
        const testimonials = Array.isArray(response) ? response : []

        console.log(testimonials)

        this.testimonials = testimonials
      } catch(e) {
        console.error(e)
        throw e
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
