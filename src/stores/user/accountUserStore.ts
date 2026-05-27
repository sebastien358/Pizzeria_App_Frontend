import { defineStore } from 'pinia'
import { axiosRemoveAccountUser } from '@/shared/services/user/accountUser.service.ts'

export const useAccountUserStore = defineStore('accountUser', {
  state: () => ({

  }),
  actions: {
    async removeAccount() {
      try {
        return await axiosRemoveAccountUser()
      } catch(e) {
        console.error(e)
        throw e
      }
    }
  }
})
