<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Pagination from '@/templates/pagination/Pagination.vue'
import { useCommandUserStore } from '@/stores/user/commandUserStore.ts'

const commandUserStore = useCommandUserStore()

const currentPage = ref<number>(1)
const itemPerPage = ref<number>(6)

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
          v-if="statusCommandPaid(command)"
          :to="{ name: 'payment-command', params: { id: command.id } }"
          class="btn btn-command-paid"
          :class="statusCommandPaid(command)"
          >
          Payé la commande
        </router-link
        >
        <button
          @click="removeCommand(command.id)"
          v-if="statusCommandPaid(command)"
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
// Variables globales

$primary: #4f46e5;
$success: #10b981;
$error: #ef4444;
$light-bg: #f9fafb;
$card-bg: #ffffff;
$text-dark: #111827;
$text-muted: #6b7280;
$radius: 12px;
$shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

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

.command-user {
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
  .command-user__status {
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

  .command-user__buttons {
    display: flex;
    gap: 10px;
    margin-top: 10px;

    .btn {
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      color: white;
      transition: 0.2s;
      &-command-paid {
        background: #16a34a;
        &:hover {
          background: #15803d;
        }
        &.no-button-payment {
          display: none;
        }
      }
      &-delete {
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

/* NO PRODUCT */

.no-product {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150px;
  p {
    font-size: 15px;
  }
}
</style>
