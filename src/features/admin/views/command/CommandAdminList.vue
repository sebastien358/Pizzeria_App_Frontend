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
  <section v-else-if="commandAdminStore.commands.length > 0" class="command-admin">
    <div v-for="command in commands" :key="command.id" class="command-admin__card">
      <!-- Items de la commande -->
      <div v-for="item in command.commandItems" :key="item.id" class="command-admin__item">
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
      <div class="command-admin__status">
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

      <div class="command-admin__preparation__status">
        <select
          @click="selectedPreparation(command.id, $event)"
          name="preparation-status"
          class="select-status"
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
        v-if="command.preparationStatus === 'Livré'"
        @click="removeCommand(command.id)"
        class="btn-delete"
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
  <section v-else class="no-command">
    <p>Aucune commande pour le moment.</p>
  </section>
</template>

<style scoped lang="scss">
/* SPINNER */

.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  .loader {
    width: 35px;
    height: 35px;
    border: 5px solid black;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

// commande

.command-admin {
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #f5f5f5;
  height: calc(100vh - 80px);

  &__card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.08);
    display: flex;
    flex-direction: column;
    gap: 15px;
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-3px);
    }
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }
  }

  .item-image {
    width: 70px;
    height: 70px;
    flex-shrink: 0;

    .img-product {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
    }
  }

  .item-info {
    h3 {
      font-size: 16px;
      margin: 0;
      font-weight: 600;
    }

    p {
      font-size: 13px;
      color: #666;
      margin: 2px 0;
    }
  }

  &__status {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;

    p {
      font-size: 13px;
    }

    span {
      margin-left: 5px;
      padding: 4px 8px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 12px;
    }

    .status-pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status-paid {
      background: #d1fae5;
      color: #065f46;
    }

    .status-shipped {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-delivered {
      background: #dcfce7;
      color: #166534;
    }

    .status-failed,
    .status-cancelled {
      background: #fee2e2;
      color: #991b1b;
    }
  }

  &__preparation__status {
    margin-top: 10px;

    select {
      width: 100%;
      padding: 8px;
      border-radius: 8px;
      border: 1px solid #ddd;
      font-size: 13px;
      cursor: pointer;
      background: #fff;
    }

    .select-status {
      width: 220px;
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid #ddd;
      font-size: 13px;
      font-weight: 500;
      background: #fff;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        border-color: #bbb;
      }

      &:focus {
        outline: none;
        border-color: #16a34a;
        box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.15);
      }
    }
  }

  .btn-delete {
    margin-top: 10px;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    color: white;
    background: #ef4444;
    transition: 0.2s;

    &:hover {
      background: #dc2626;
    }
  }
}

// Responsive

@media (max-width: 768px) {
  .command-admin {
    padding: 15px 10px;
    height: auto;
  }

  .command-admin__card {
    padding: 15px;
  }

  .command-admin__item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .item-image {
    width: 100%;
    height: 140px;

    .img-product {
      border-radius: 10px;
    }
  }

  .item-info {
    width: 100%;
  }

  .command-admin__status {
    flex-direction: column;
    gap: 8px;

    p {
      display: flex;
      justify-content: space-between;
    }
  }

  .command-admin__preparation__status {
    select {
      width: 100%;
    }
  }

  .btn-delete {
    width: 100%;
    text-align: center;
  }
}

/* NO PRODUCT */

.no-command {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150px;
  p {
    font-size: 15px;
  }
}
</style>
