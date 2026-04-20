<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useCommandAdminStore } from '@/stores/admin/commandAdminStore.ts'
import Pagination from '@/templates/pagination/Pagination.vue'

const commandAdminStore = useCommandAdminStore()

const commands = computed(() => commandAdminStore.commands)

const currentPage = ref<number>(1)
const itemPerPage = ref<number>(5)

const loadCommands = async () => {
  try {
    await commandAdminStore.commandAdminList(currentPage.value, itemPerPage.value)
  } catch (e) {
    console.error(e)
    throw e
  }
}

// Pagination

const previousPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
  try {
    await commandAdminStore.commandAdminList(currentPage.value, itemPerPage.value)
  } catch (e) {
    console.error(e)
  }
}

const nextPage = async () => {
  currentPage.value++
  try {
    await commandAdminStore.commandAdminList(currentPage.value, itemPerPage.value)
  } catch (e) {
    console.error(e)
  }
}

// Suppression commande

const removeCommand = async (id: number) => {
  try {
    await commandAdminStore.removeCommand(id)
    await commandAdminStore.commandAdminList(currentPage.value, itemPerPage.value)

    if (commandAdminStore.commands.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }

    await loadCommands()
  } catch (e) {
    console.error(e)
    throw e
  }
}

// Status commande

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

const commandDelivered = (command) => {
  return command.preparationStatus === 'Livré'
}

// Couleurs des différents status de la commande

const selectedPreparationStatus = (command) => {
  switch (command.preparationStatus) {
    case 'En cours':
      return 'status-pending'
    case 'Expédié':
      return 'status-shipped'
    case 'Livré':
      return 'status-delivered'
    case 'Annulée':
      return 'status-cancelled'
    default:
      return ''
  }
}

const statusPreparation = ref<string | null>(null)

const selectedPreparation = async (id: number, e: Event) => {
  try {
    const preparation = (e.target as HTMLInputElement).value
    statusPreparation.value = preparation
    await commandAdminStore.preparationStatus(id, statusPreparation.value)
  } catch (e) {
    console.error(e)
    throw e
  }
}

const formatedAt = (date: Date) => {
  if (!date) return ''
  const d = new Date(date)
  return Intl.DateTimeFormat('fr-FR').format(d)
}

onMounted(async () => {
  await loadCommands()
})
</script>

<template>
  <!-- loading -->
  <section v-if="commandAdminStore.isLoading" class="spinner">
    <span class="loader"></span>
  </section>

  <!-- commandes client -->
  <section v-else-if="commandAdminStore.commands.length > 0" class="command-user">
    <div v-for="command in commands" :key="command.id" class="command-user__card">
      <!-- Items de la commande -->
      <div v-for="item in command.commandItems" :key="item.id" class="command-user__item">
        <div class="item-image">
          <img
            v-if="item.product.pictures.length"
            :src="item.product.pictures[0].filename"
            class="img-product"
            alt="Produit"
          />
          <img
            v-else
            src="@/assets/images/not-found.webp"
            class="img-product"
            alt="Produit manquant"
          />
        </div>

        <div class="item-info">
          <h3>{{ item.title }}</h3>
          <p>Prix : {{ item.price }} €</p>
          <p>Quantité : {{ item.quantity }}</p>
          <p>Date : {{ formatedAt(command.createdAt) }}</p>
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
          Préparation de la commande :
          <span :class="selectedPreparationStatus(command)">
            {{ command.preparationStatus }}
          </span>
        </p>

        <p><strong>Client : </strong>{{ command.firstName }} {{ command.lastName }}</p>
        <p><strong>Rue : </strong>{{ command.address }}</p>
        <p><strong>Ville : </strong>{{ command.zipCode }} {{ command.city }}</p>
      </div>

      <!-- Bouton préparation de la commande -->

      <div class="command-user__preparation__status">
        <select
          @click="selectedPreparation(command.id, $event)"
          name="preparation-status"
          id="preparation-status"
        >
          <option value="">
            {{ statusPreparation ? statusPreparation : ' - Status de la commande - ' }}
          </option>
          <option value="Annulée">Annulée</option>
          <option value="En cours">En cours</option>
          <option value="Expédié">Expédié</option>
          <option value="Livré">Livré</option>
        </select>
      </div>

      <!-- Bouton supprimer commande -->

      <button
        @click="removeCommand(command.id)"
        :class="commandDelivered(command) ? 'active-button' : 'no-button'"
      >
        Supprimer
      </button>
    </div>
    <Pagination
      :currentPage="currentPage"
      :pages="commandAdminStore.pages"
      @previous-page="previousPage()"
      @next-Page="nextPage()"
    />
  </section>

  <!-- aucun produit -->
  <section v-else class="no-product">
    <p>Aucun produit pour le moment.</p>
  </section>
</template>

<style scoped lang="scss">

</style>
