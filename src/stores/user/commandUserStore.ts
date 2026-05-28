import { defineStore } from 'pinia'
import { axiosAddCommandUser, axiosGetCommandUserList, axiosGetCurrentUserId,
  axiosRemoveCommandUser
} from '@/shared/services/user/command.service.ts'
import { useCartStore } from '@/stores/cartStore.ts'

export const useCommandUserStore = defineStore('commandUser', {
  state: () => ({
    pendingCommand: null,
    commandId: 0,
    command: [],
    term: '',
    isLoading: true,
    total: 0,
    pages: 0,
    limit: 0,
    currentPage: 1
  }),
  actions: {
    getItemsPerPage() {
      if (window.innerWidth >= 1600) {
        return 4
      } else if (window.innerWidth >= 1024) {
        return 3
      } else {
        return 2
      }
    },
    async getCommandUser() {
      try {
        this.isLoading = true

        this.limit = this.getItemsPerPage()
        const response = await axiosGetCommandUserList(this.currentPage, this.limit)

        const data = response || { commands: [], total: 0, pages: 0 }

        this.command = data.commands
        this.pages = data.pages
      } catch (e) {
        this.command = []
        this.total = 0
        this.pages = 0
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },
    async addCommandAddress(dataClient) {
      try {
        const cartStore = useCartStore()
        const cartItems = cartStore.cart

        const response = await axiosAddCommandUser(dataClient, cartItems)

        if (!response?.success || !response?.pendingCommand) {
          throw new Error('Réponse commande invalide')
        }

        this.pendingCommand = response.pendingCommand
        this.command.push(response.pendingCommand)

        cartStore.resetCart()

        return response
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    async getCurrentCommand(id: number) {
      try {
        return await axiosGetCurrentUserId(id)
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    async removeCommand(id: number) {
      try {
        const response = await axiosRemoveCommandUser(id)
        this.command = this.command.filter((command) => command.id !== id)
        return response
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    resetCommand() {
      this.commandId = 0
    },
  },

  persist: {
    key: 'commandUser',
    storage: localStorage,
    path: ['pendingCommand'],
  },
})
