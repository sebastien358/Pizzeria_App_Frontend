<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Pagination from '@/templates/pagination/Pagination.vue'
import { useCommandUserStore } from '@/stores/user/commandUserStore.ts'

const commandUserStore = useCommandUserStore()

const currentPage = ref<number>(1)
const itemPerPage = ref<number>(5)

const loadUserCommands = async () => {
  try {
    await commandUserStore.getCommandUser(currentPage.value, itemPerPage.value)
  } catch (e) {
    console.error(e)
  }
}

const commands = computed(() => commandUserStore.command)

// Pagination

const previousPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
  try {
    await commandUserStore.getCommandUser(currentPage.value, itemPerPage.value)
  } catch (e) {
    console.error(e)
  }
}

const nextPage = async () => {
  currentPage.value++
  try {
    await commandUserStore.getCommandUser(currentPage.value, itemPerPage.value)
  } catch (e) {
    console.error(e)
  }
}

const removeCommand = async (id: number) => {
  try {
    await commandUserStore.removeCommand(id)
    await commandUserStore.getCommandUser(currentPage.value, itemPerPage.value)

    if (commandUserStore.command.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }

    await loadUserCommands()
  } catch (e) {
    console.error(e)
    throw e
  }
}

// Couleurs des différents status de la commande

const paymentStatus = (command) => {
  switch (command.status) {
    case 'En attente':
      return 'status-pending'
    case 'Payé':
      return 'status-paid'
    case 'Échouée':
      return 'status-failed'
    case 'Annulée':
      return 'status-cancelled'
    default:
      return ''
  }
}

// Gstion des couleurs status de la préparation de la commande

const selectedPreparationStatus = (command) => {
  switch (command.preparationStatus) {
    case 'En cours':
      return 'status-pending'
    case 'Expédié':
      return 'status-shipped'
    case 'Livré':
      return 'status-delivered'
    default:
      return ''
  }
}

// Si la commande est payé, le boutton de redirection vers le formulaire de paiement disparait

const statusCommandPaid = (command) => {
  if (command.status === 'Payé') {
    return 'no-button-payment'
  }
}

// Récupération de la date

const formatedDate = (date: Date) => {
  if (!date) return ""
  const d = new Date(date)
  return new Intl.DateTimeFormat('fr-Fr').format(d)
}

onMounted(async () => {
  await loadUserCommands()
})
</script>

<template>
  <!-- loading -->
  <section v-if="commandUserStore.isLoading" class="spinner">
    <span class="loader"></span>
  </section>

  <!-- commandes client -->
  <section v-else-if="commandUserStore.command.length > 0" class="command-user">
    <div v-for="command in commands" :key="command.id" class="command-user__card">
      <!-- Items de la commande -->
      <div v-for="item in command.commandItems" :key="item.id" class="command-user__item">
        <div class="command-user__image">
          <img
            v-if="item.product.pictures.length"
            :src="item.product.pictures[0].filename"
            class="product-image"
            alt="Produit"
          />
        </div>

        <div class="item-info">
          <h3>{{ item.title }}</h3>
          <p>Prix : {{ item.price }} €</p>
          <p>Quantité : {{ item.quantity }}</p>
          <p>Date : {{ formatedDate(command.createdAt) }}</p>
        </div>
      </div>

      <!-- Statut commande -->
      <div class="command-user__status">
        <p>
          Paiment :
          <span :class="paymentStatus(command)">
            {{ command.status }}
          </span>
        </p>
        <p>
          Préparation commande :
          <span :class="selectedPreparationStatus(command)">
            {{ command.preparationStatus }}
          </span>
        </p>
      </div>

      <!-- Bouton : passer une commande, supprimer une commade -->
      <div class="command-user__buttons">
        <router-link
          :to="{ name: 'payment-command', params: { id: command.id } }"
          class="btn btn-command-paid"
          :class="statusCommandPaid(command)"
          >Payé</router-link
        >
        <button
          @click="removeCommand(command.id)"
          class="btn btn-delete"
          :class="statusCommandPaid(command)"
        >
          Supprimer
        </button>
      </div>
    </div>

    <Pagination
      :currentPage="currentPage"
      :pages="commandUserStore.pages"
      @previous-page="previousPage()"
      @next-Page="nextPage()"
    />
  </section>

  <!-- aucun produit -->
  <section v-else class="no-product">
    <p>Aucun produit pour le moment.</p>
  </section>
</template>
>

<style scoped lang="scss">
</style>
