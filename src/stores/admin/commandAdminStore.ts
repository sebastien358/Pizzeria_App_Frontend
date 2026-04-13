import { defineStore } from 'pinia'
import { axiosAdminCommandList, axiosAdminPreparationStatus, axiosAdminRemoveCommand } from '@/shared/services/admin/commandAdmin.service.ts'

export const useCommandAdminStore = defineStore('commandAdmin', {
  state: () => ({
    commands: [],
    isLoading: true,
    total: 0,
    pages: 0
  }),
  actions: {
    async commandAdminList(currentPage, itemPerPage) {
      try {
        this.isLoading = true

        const response = await axiosAdminCommandList(currentPage, itemPerPage)
        this.commands = response.commands

        this.total = response.total
        this.pages = response.pages
      } catch (e) {
        this.commands = []
        this.total = 0
        this.pages = 0
        console.error(e)
        throw e
      } finally {
        this.isLoading = false
      }
    },
    async preparationStatus(id: number, preparationStatus: string) {
      try {
        const command = this.commands.find((c) => c.id === id)
        command.preparationStatus = preparationStatus
        await axiosAdminPreparationStatus(id, preparationStatus)
      } catch (e) {
        console.error(e)
      }
    },
    async removeCommand(id: number) {
      try {
        const response = await axiosAdminRemoveCommand(id)
        this.commands = this.commands.filter((c) => c.id !== id)
        return response
      } catch(e) {
        console.error(e)
        throw e
      }
    }
  }
})
