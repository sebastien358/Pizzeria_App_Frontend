import { defineStore } from 'pinia'
import { axiosAdminContactList, axiosAdminContactSearch, axiosAdminRemoveContact } from '@/shared/services/admin/contactAdmin.service.ts'

interface ContactState {
  contacts: object,
  isLoading: boolean,
  term: string,
  offset: number,
  limit: number
  pages: number
  currentPage: number
  total: number
}

export const useContactAdminStore = defineStore('contactAdmin', {
  state: (): ContactState => ({
    contacts: [],
    isLoading: true,
    term: "",
    offset: 0,
    limit: 0,
    pages: 0,
    currentPage: 1,
    total: 0
  }),
  actions: {
    getItemsPerPage() {
      if (window.innerWidth >= 1600) {
        return 12
      } else if (window.innerWidth >= 1024) {
        return 8
      } else if (window.innerWidth >= 767) {
        return 6
      } else {
        return 4
      }
    },
    async contactAdminList() {
      try {
        this.isLoading = true

        this.limit = this.getItemsPerPage()
        const data = await axiosAdminContactList(this.currentPage, this.limit)

        this.contacts = data.contacts
        this.pages = data.pages
        this.total = data.total
      } catch (e) {
        this.contacts = []
        console.error(e)
        throw e
      } finally {
        this.isLoading = false
      }
    },
    async contactSearch(term: string) {
      const trimmed = term.trim()
      try {
        if (!trimmed) {
          this.isLoading = true
          this.term = ""
          this.offset = 0
          this.limit =  0
          this.pages = 0
          this.currentPage = 1
          await this.contactAdminList()
        }

        if (trimmed.length < 2) return

        this.isLoading = true
        this.term = trimmed

        const data = await axiosAdminContactSearch(this.term)
        this.contacts = data
        return data
      } catch(e) {
        this.contacts = []
        console.error(e)
        throw e
      } finally {
        this.isLoading = false
      }
    },
    async removeAdminContact(id: number) {
      try {
        const response = await axiosAdminRemoveContact(id)
        this.contacts = this.contacts.filter((contact) => contact.id !== id)
        return response
      } catch (e) {
        console.error(e)
        throw e
      }
    },
  },
})
