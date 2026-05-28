import { defineStore } from 'pinia'
import {
  axiosAdminActiveIsReadCommand,
  axiosAdminCommandList, axiosAdminPreparationStatus, axiosAdminRemoveCommand, axiosAdminSearchCommand } from '@/shared/services/admin/commandAdmin.service.ts'

export const useCommandAdminStore = defineStore('commandAdmin', {
  state: () => ({
    commands: [],
    isLoading: true,
    term: '',
    total: 0,
    pages: 0,
    limit: 0,
    currentPage: 1,
    countCommandUnread: 0,
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
    async commandAdminList() {
      try {
        this.isLoading = true

        this.limit = this.getItemsPerPage()
        const response = await axiosAdminCommandList(this.currentPage, this.limit)
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
    async countUnreadCommand() {
      try {
        const response = await axiosAdminCommandList(1, 1)
        this.countCommandUnread = response.countCommandsUnread
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    async preparationStatus(id: number, preparationStatus: string) {
      try {
        const command = this.commands.find((c) => c.id === id)
        command.preparationStatus = preparationStatus
        await axiosAdminPreparationStatus(id, preparationStatus)
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    async searchCommand(term: string) {
      const trimmed = term.trim()
      try {
        if (!trimmed) {
          this.isLoading = true
          this.limit = 0
          this.term = ''
          await this.commandAdminList()
        }

        if (trimmed.length < 2) return

        this.isLoading = true
        this.term = trimmed

        const response = await axiosAdminSearchCommand(this.term)
        this.commands = response

        return response
      } catch (e) {
        this.commands = []
        console.error(e)
        throw e
      } finally {
        this.isLoading = false
      }
    },
    async activeIsRead(id: number) {
      try {
        return await axiosAdminActiveIsReadCommand(id)
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    async removeCommand(id: number) {
      try {
        const response = await axiosAdminRemoveCommand(id)
        this.commands = this.commands.filter((c) => c.id !== id)
        return response
      } catch (e) {
        console.error(e)
        throw e
      }
    },
  },
})
