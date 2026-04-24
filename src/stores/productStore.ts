import { defineStore } from 'pinia'
import {
  axiosFilteredCategoryProducts,
  axiosFilteredPriceProducts,
  axiosGetProducts,
  axiosSearchProducts,
} from '@/shared/services/product.service.ts'

interface ProductState {
  product: object,
  isLoading: boolean,
  searchTerm: string,
  priceRange: [[number, number], [number, number], [number, number], [number, number], [number, number]],
  initPriceRange: [number, number],
  category: [string, string, string, string],
  initCategory: [string],
  offset: number,
  limit: number
}

export const useProductStore = defineStore('product', {
  state: (): ProductState => ({
    product: [],
    isLoading: true,
    searchTerm: '',
    priceRange: [
      [0, 40],
      [5, 10],
      [10, 15],
      [15, 20],
      [20, 40],
    ],
    initPriceRange: [0, 30],
    category: ['all', 'desktop', 'gamer', 'streaming'],
    initCategory: ['all'],
    offset: 0,
    limit: 20,
  }),
  getters: {
    nbrProducts: (state) => state.product.length,
  },
  actions: {
    async getProduct(append = false): Promise<void> {
      try {
        this.isLoading = true

        if (!append) {
          this.offset = 0
          this.product = []
        }

        const response = await axiosGetProducts(this.offset, this.limit)
        const products = Array.isArray(response) ? response : []

        this.product.push(...products)
        this.offset += products.length
      } catch (e) {
        this.product = []
        console.error('Erreur getProduct:', e)
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

      // 🔹 Cas : input vide → on recharge tout
      if (!trimmed) {
        this.searchTerm = ''
        this.offset = 0
        await this.getProduct()
        return
      }

      // 🔹 Cas : trop court → on fait rien
      if (trimmed.length < 2) return

      try {
        this.isLoading = true
        this.searchTerm = trimmed

        const response = await axiosSearchProducts(trimmed)
        this.product = Array.isArray(response) ? response : []
      } catch (e) {
        this.product = []
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },
    async filteredPrice(priceRange: number[]): Promise<void> {
      try {
        const [minPrice, maxPrice] = priceRange
        const response = await axiosFilteredPriceProducts(minPrice, maxPrice)
        this.product = Array.isArray(response) ? response : []
      } catch (e) {
        this.product = []
        console.error(e)
      }
    },
    async filteredCategory(category: string): Promise<void> {
      try {
        const response = await axiosFilteredCategoryProducts(category)
        if (category === 'all') {
          await this.getProduct()
        } else if (response) {
          this.product = response
        } else {
          this.product = []
        }
      } catch (e) {
        this.product = []
        console.error(e)
      }
    },
    async initFilteredProducts(): Promise<void> {
      try {
        this.searchTerm = ''
        this.initPriceRange = [0, 4000]
        this.initCategory = ['all']
        this.offset = 0
        await this.getProduct()
      } catch (e) {
        console.error(e)
        this.product = []
      }
    },
  },
})
