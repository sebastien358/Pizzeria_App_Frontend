import { defineStore } from 'pinia'
import { axiosAddContact } from '@/shared/services/contact.service.ts'

export const useContactStore = defineStore('contact', {
  state: () => ({
    contacts: []
  }),
  actions: {
    async addContact(data: Object) {
      try {
        return await axiosAddContact(data)
      } catch(e) {
        console.error(e)
        throw e
      }
    }
  }
})
