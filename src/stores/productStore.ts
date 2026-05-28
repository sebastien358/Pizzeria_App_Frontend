import { defineStore } from 'pinia'
import {
  axiosGetProducts,
  axiosSearchProducts,
} from '@/shared/services/product.service.ts'

interface ProductState {
  products: object,
  isLoading: boolean,
  searchTerm: string,
  offset: number,
  limit: number,
  hasMore: boolean
}

export const useProductStore = defineStore('product', {
  state: (): ProductState => ({
    products: [],
    isLoading: true,
    searchTerm: '',
    offset: 0,
    limit: 0,
    hasMore: true,
  }),
  getters: {
    nbrProducts: (state) => state.products.length,
  },
  actions: {
    itemsPerPage() {
      if (window.innerWidth >= 1400) {
        return 12
      } else if (window.innerWidth >= 1024) {
        return 9
      } else if (window.innerWidth >= 767) {
        return 6
      } else {
        return 4
      }
    },
    async getProduct(append = false): Promise<void> {
      try {
        this.limit = this.itemsPerPage()

        if (!append) {
          this.offset = 0
          this.products = []
          this.hasMore = true
        }

        this.isLoading = true

        const response = await axiosGetProducts(this.offset, this.limit)
        const data = Array.isArray(response) ? response : []

        if (append) {
          this.products = [...this.products, ...data]
        } else {
          this.products = data
        }

        this.offset += data.length

        if (data.length < this.offset) {
          this.hasMore = false
        }
      } catch(e) {
        this.products = []
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },
    async loadProducts() {
      try {
        await this.getProduct(true)
        return true
      } catch (e) {
        console.error(e)
      }
    },
    async searchProducts(term: string): Promise<void> {
      const trimmed = term.trim()
      try {
        if (trimmed) {
          this.searchTerm = trimmed
        }

        if (!this.searchTerm) {
          this.offset = 0
          this.hasMore = true
          this.limit = 0
          this.searchTerm = ""
          await this.getProduct(false)
          return
        }

        if (this.searchTerm.length < 2) return

        this.isLoading = true

        const response = await axiosSearchProducts(this.searchTerm)
        const data = Array.isArray(response) ? response : []
        this.products = data
      } catch(e) {
        this.products = []
        console.error(e)
      } finally {
        this.isLoading = false
      }
    }
  }
})
