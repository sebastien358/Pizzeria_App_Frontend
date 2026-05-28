<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import Pagination from '@/templates/pagination/Pagination.vue'
import { useCommandUserStore } from '@/stores/user/commandUserStore.ts'
import notFound from '@/assets/images/not-found.webp'
import DeleteConfirmModal from '@/templates/confirm-modal/DeleteConfirmModal.vue'
import InputSearch from '@/templates/input-search/InputSearch.vue'
const placeholder = ref<string>('Rechercher une commande')

const commandUserStore = useCommandUserStore()

const loadUserCommands = async () => {
  try {
    await commandUserStore.getCommandUser()
  } catch (e) {
    console.error(e)
  }
}

const commands = computed(() => commandUserStore.command)

// Pagination

const previousPage = async () => {
  if (commandUserStore.currentPage > 1) {
    commandUserStore.currentPage--
  }
  try {
    await commandUserStore.getCommandUser()
  } catch (e) {
    console.error(e)
  }
}

const nextPage = async () => {
  commandUserStore.currentPage++
  try {
    await commandUserStore.getCommandUser()
  } catch (e) {
    console.error(e)
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
  if (!date) return ''
  const d = new Date(date)
  return new Intl.DateTimeFormat('fr-Fr').format(d)
}

// MODAL DELETE

const open = ref<boolean>(false)
const commandId = ref<number | null>(null)

const openModal = (id: number) => {
  open.value = true
  commandId.value = id
}

const closeModal = () => {
  open.value = false
}

// REMOVE MODAL

const removeCommand = async (id: number) => {
  try {
    await commandUserStore.removeCommand(id)
    await commandUserStore.getCommandUser()

    if (commandUserStore.command.length === 0 && commandUserStore.currentPage > 1) {
      commandUserStore.currentPage--
    }

    await loadUserCommands()
  } catch (e) {
    console.error(e)
    throw e
  }
}

onMounted(async () => {
  await loadUserCommands()
})
</script>

<template>
  <DeleteConfirmModal
    :id="commandId"
    :open="open"
    @close="closeModal"
    text="commands-user"
    @delete="removeCommand"
  />
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
            v-if="item.product.pictures?.length"
            :src="item.product.pictures[0].filename || notFound"
            class="product-image"
            alt="Produit"
          />
          <img v-else :src="notFound" class="product-image" alt="Produit manquant" />
        </div>

        <div class="item-info">
          <h3>{{ item.title }}</h3>
          <p>📅 : {{ formatedDate(command.createdAt) }}</p>
          <p>💰 : {{ command.total }} €</p>
          <p>🚚 : {{ command.deliveryType }}</p>
          <p>🔢 : {{ item.quantity }}</p>
        </div>
      </div>

      <!-- Statut commande -->
      <div class="command-user__status">
        <p>
          Paiement :
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
        >
          Payé la commande
        </router-link>
        <button
          @click="openModal(command.id)"
          class="btn btn-delete"
          :class="statusCommandPaid(command)"
        >
          Supprimer
        </button>
      </div>
    </div>

    <Pagination
      v-if="commandUserStore.pages > 1"
      :currentPage="commandUserStore.currentPage"
      :pages="commandUserStore.pages"
      @previous-page="previousPage()"
      @next-Page="nextPage()"
    />
  </section>

  <!-- aucun produit -->
  <section v-else class="no-command">
    <p>Aucune commande pour le moment.</p>
  </section>
</template>
>

<style scoped lang="scss">
/* SPINNER */

.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100dvh - 80px);
  .loader {
    width: 35px;
    height: 35px;
    border: 5px solid black;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    @media (max-width: 767.98px) {
      width: 30px;
      height: 30px;
    }
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

.command-user {
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #f5f5f5;
  height: 100%;
  &__card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
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

  .command-user__image {
    width: 70px;
    height: 70px;
    flex-shrink: 0;
    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
    }
  }

  .item-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    h3 {
      font-size: 15px;
      margin: 0;
      font-weight: 600;
    }
    p {
      font-size: 14px;
      color: #666;
    }
  }
  .command-user__status {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;

    p {
      font-size: 14px;
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

  .command-user__buttons {
    display: flex;
    gap: 8px;
    margin-top: 3px;
    .btn {
      padding: 10px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      color: white;
      transition: 0.2s;
      &-command-paid {
        background: #16a34a;
        font-size: 11px;
        &:hover {
          background: #15803d;
        }
        &.no-button-payment {
          display: none;
        }
      }
      &-delete {
        font-size: 10px;
        background: #ef4444;
        &:hover {
          background: #dc2626;
        }
        &.no-button-payment {
          display: none;
        }
      }
    }
  }
}

@media (max-width: 767.98px) {
  .command-user {
    padding: 30px 15px;
    gap: 12px;
    &__card {
      padding: 15px;
      gap: 12px;
    }
    &__status {
      display: flex;
      flex-direction: column;
      row-gap: 10px;
    }

    .item-info {
      h3 {
        font-size: 14px;
      }
      p {
        font-size: 13px;
      }
    }

    .command-user__status {
      display: flex;
      justify-content: space-between;
      margin-top: 6px;

      p {
        font-size: 13px;
      }
    }

    .command-user__buttons {
      gap: 5px;
      margin-top: 0;
      .btn {
        &-command-paid {
          background: #16a34a;
          font-size: 9px;
        }
        &-delete {
          font-size: 8px;
        }
      }
    }
  }
}

/* NO COMMAND */

.no-command {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100dvh - 80px);
  p {
    font-size: 15px;
    @media (max-width: 991.98px) {
      font-size: 14px;
    }
    @media (max-width: 767.98px) {
      font-size: 13px;
    }
  }
}
</style>
