import { defineStore } from 'pinia'
import { axiosAdminActiveIsRead,
  axiosAdminContactCurrent, axiosAdminContactList, axiosAdminContactSearch, axiosAdminRemoveContact } from '@/shared/services/admin/contactAdmin.service.ts'

interface ContactState {
  contacts: object
  isLoading: boolean
  term: string
  offset: number
  limit: number
  pages: number
  currentPage: number
  total: number
  countContactsUnread: number
}

export const useContactAdminStore = defineStore('contactAdmin', {
  state: (): ContactState => ({
    contacts: [],
    isLoading: true,
    term: '',
    offset: 0,
    limit: 0,
    pages: 0,
    currentPage: 1,
    total: 0,
    countContactsUnread: 0,
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
    async currentContact(id: number) {
      try {
        this.isLoading = true
        return await axiosAdminContactCurrent(id)
      } catch(e) {
        console.error(e)
        throw e
      } finally {
        this.isLoading = false
      }
    },
    async axiosCountUnread() {
      try {
        const data = await axiosAdminContactList(1, 1)
        this.countContactsUnread = data.countContactsUnread
      } catch(e) {
        console.error(e)
        throw e
      }
    },
    async contactSearch(term: string) {
      const trimmed = term.trim()
      try {
        if (!trimmed) {
          this.isLoading = true
          this.term = ''
          this.offset = 0
          this.limit = 0
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
      } catch (e) {
        this.contacts = []
        console.error(e)
        throw e
      } finally {
        this.isLoading = false
      }
    },
    async removeAdminContact(id: number) {
      try {
        return await axiosAdminRemoveContact(id)
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    async activeIsRead(id: number) {
      try {
        return await axiosAdminActiveIsRead(id)
      } catch (e) {
        console.error(e)
        throw e
      }
    },
  },
})
