import { defineStore } from 'pinia'
import {
  axiosAddProductAdmin,
  axiosAdminCurrentProduct, axiosAdminSearchProduct,
  axiosDeleteProductAdmin,
  axiosDeleteProductImage,
  axiosEditProductAdmin,
  axiosGetProductAdmin,
} from '@/shared/services/admin/productAdmin.service.ts'
import { useProductStore } from '@/stores/productStore.ts'
import type { ProductFormInterface, ProductInterface } from '@/shared/interfaces'

interface ProductAdminState {
  product: ProductInterface[]
  countProduct: number
  pages: number
  isLoading: boolean
  term: string
  currentPage: number
  limit: number
  total: number
}

export const useProductAdminStore = defineStore('productAdmin', {
  state: (): ProductAdminState => ({
    product: [],
    countProduct: 0,
    pages: 0,
    isLoading: true,
    term: "",
    currentPage: 1,
    limit: 0,
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
    async getAdminProducts(): Promise<void> {
      try {

        this.isLoading = true

        this.limit = this.getItemsPerPage()
        const data = await axiosGetProductAdmin(this.currentPage, this.limit)

        this.product = data.products
        this.pages = data.pages
        this.total = data.total
      } catch (e) {
        this.product = []
        console.error(e)
        throw e
      } finally {
        this.isLoading = false
      }
    },
    async addAdminProduct(dataProduct: ProductFormInterface): Promise<ProductInterface> {
      try {
        const formData = new FormData()

        formData.append('title', dataProduct.title)
        formData.append('description', dataProduct.description)

        dataProduct.productOption.forEach((o, index) => {
          formData.append(`productOption[${index}][name]`, o.name)
          formData.append(`productOption[${index}][price]`, o.price)
        })

        dataProduct.images?.forEach((image) => formData.append('images[]', image))

        const response: ProductInterface = await axiosAddProductAdmin(formData)

        const productStore = useProductStore()

        this.product.push(response)
        await productStore.getProduct()

        return response
      } catch (e) {
        console.error('Erreur addAdminProduct:', e)
        throw e
      }
    },
    async currentProduct(id: number) {
      try {
        return await axiosAdminCurrentProduct(id)
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    async productSearch(term: string) {
      const trimmed = term.trim()
      try {
        if (trimmed) {
          this.term = trimmed
        }

        if (!this.term) {
          this.isLoading = true
          this.term = ""
          this.limit = 0
          this.currentPage = 1
          await this.getAdminProducts()
          return
        }

        if (this.term.length < 2) return

        this.isLoading = true

        const response = await axiosAdminSearchProduct(this.term)
        const data = Array.isArray(response) ? response : []

        this.product = data

        return data
      } catch(e) {
        this.product = []
        console.error(e)
        throw e
      } finally {
        this.isLoading = false
      }
    },
    async editProduct(dataProduct, id: number) {
      try {
        const formData = new FormData()

        formData.append('title', dataProduct.title)
        formData.append('description', dataProduct.description)

        dataProduct.productOption.forEach((o, index) => {
          formData.append(`productOption[${index}][name]`, o.name)
          formData.append(`productOption[${index}][price]`, o.price)
        })

        dataProduct.images?.map((image) => formData.append('images[]', image))

        const product = await axiosEditProductAdmin(formData, id)
        // Met à jour le produit dans le store
        const index = this.product.findIndex((p) => p.id === id)
        if (index !== -1) {
          this.product[index] = { ...this.product[index], ...product }
        }
        await this.getAdminProducts() // Optionnel, si tu veux rafraîchir tout
        return product
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    async deleteProduct(id: ProductInterface) {
      try {
        await axiosDeleteProductAdmin(id)
        this.product = this.product.filter((p) => p.id !== id)
        await this.getAdminProducts()
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    async deleteProductImage(productId: number, imageId: number) {
      try {
        const response = await axiosDeleteProductImage(productId, imageId)
        await this.getAdminProducts()

        return response
      } catch (e) {
        console.error(e)
        throw e
      }
    },
  },
})
