import { defineStore } from 'pinia'
import type { CartProductInterface } from '@/shared/interfaces'
import { useProductStore } from '@/stores/productStore.ts'

interface CartProductState {
  cart: CartProductInterface[]
}

export const useCartStore = defineStore('cart', {
  state: (): CartProductState => ({
    cart: [],
  }),
  getters: {
    itemsToCartExisting(state) {
      return state.cart.length > 0 ? '' : 'Le panier est vide...'
    },
    total: (state) => {
      return state.cart.reduce((acc, product) => acc + product.price * product.quantity, 0)
    }
  },
  actions: {
    async addProductToCart(id: number, selectedOptionPrice: number, selectedOptionName: string): Promise<void> {
      try {
        const productStore = useProductStore()
        const product = productStore.product.find((p) => p.id === id)
        if (product) {
          const productToCart = this.cart.find((p) => p.id === id && p.name === selectedOptionName)
          if (productToCart) {
            productToCart.quantity++
          } else {
            this.cart.push({
              id: product.id,
              title: product.title,
              price: selectedOptionPrice,
              quantity: 1,
              name: selectedOptionName,
              image: product.pictures?.[0]?.filename ?? null,
            })
          }
        }
      } catch (e) {
        console.error(e)
      }
    },
    async addItemToCart(id: number): Promise<void> {
      try {
        const itemToCart = this.cart.find((p) => p.id === id)
        if (itemToCart) itemToCart.quantity++
      } catch (e) {
        console.error(e)
      }
    },
    async removeItemToCart(id: number) {
      try {
        this.cart = this.cart.filter((p) => p.id !== id)
      } catch(e) {
        console.error(e)
      }
    },
    async deleteItemToCart(id: number): Promise<void> {
      try {
        const itemToCart = this.cart.find((p) => p.id === id)
        if (itemToCart.quantity > 1) {
          itemToCart.quantity--
        } else {
          this.cart = this.cart.filter((p) => p.id !== id)
        }
      } catch (e) {
        console.error(e)
      }
    },
    resetCart() {
      this.cart = []
    },
  },

  persist: {
    key: 'cart',
    storage: localStorage,
    paths: ['cart'],
  },
})
