import { defineStore } from 'pinia'
import { axiosAddCommandUser, axiosGetCommandUserList, axiosGetCurrentUserId,
  axiosRemoveCommandUser
} from '@/shared/services/user/command.service.ts'
import { useCartStore } from '@/stores/cartStore.ts'

export const useCommandUserStore = defineStore('commandUser', {
  state: () => ({
    commandId: 0,
    command: [],
    isLoading: true,
    total: 0,
    pages: 0,
  }),
  actions: {
    async getCommandUser(currentPage: number, itemPerPage: number) {
      try {
        this.isLoading = true

        const response = await axiosGetCommandUserList(currentPage, itemPerPage)

        const data = response || { commands: [], total: 0, pages: 0 }

        this.command = data.commands
        this.total = data.total
        this.pages = data.pages

        return data
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

        this.commandId = response.commandId

        this.command.push(response)
        return response
      } catch (e) {
        console.error(e)
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
    }
  },

  persist: {
    'key': 'commandUser',
    storage: localStorage,
    path: ['commandId']
  }
})
