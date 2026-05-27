<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore.ts'
import { useCommandUserStore } from '@/stores/user/commandUserStore'
import { computed, onMounted, ref } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import { useRoute } from 'vue-router'
import axios from 'axios'
import OrderSummary from '@/templates/order-summary/OrderSummary.vue'
import router from '@/router'

const BASE_URL = import.meta.env.VITE_APP_API_URL as string

const route = useRoute()

const cartStore = useCartStore()
const commandStore = useCommandUserStore()

const stripe = ref(null)
const cardStripe = ref(null)
const cardElement = ref(null)

type CommandItems = {
  title: string
  quantity: number
  total: number
}

// Commande en cours : ID

type PendingCommand = {
  id: number
  firstName: string
  lastName: string
  address: string
  zipCode: string
  status: string
  CommandItems: CommandItems[]
}

const pendingCommand = ref<PendingCommand[]>([])

// Commande depuis le profil user : ID

type CommandProfile = {
  id: number
  firstName: string
  lastName: string
  address: string
  zipCode: string
  status: string
  CommandItems: CommandItems[]
}

const commandProfile = ref<CommandProfile[]>([])

onMounted(async () => {
  try {
    // Commande depuis le profil user
    const id = Number(route.params.id)
    if (id) {
      // Commande depuis le profil User
      const command = await commandStore.getCurrentCommand(id)
      commandProfile.value = [command]
    } else {
      // Commande depuis le panier
      pendingCommand.value = commandStore.pendingCommand
    }
  } catch (e) {
    console.error(e)
    throw e
  }
})

const selectedCommand = computed(() => {
  if (commandProfile.value && commandProfile.value.length) {
    return commandProfile.value[0]
  }

  return pendingCommand.value
})

// Configuration de Strype

const strypePayment = async () => {
  try {
    stripe.value = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
    const elements = stripe.value.elements()
    cardStripe.value = elements.create('card', {
      style: {
        base: {
          fontSize: '14px',
          color: '#c0392b',
        },
      },
    })
    cardStripe.value.mount(cardElement.value)
  } catch (e) {
    console.error(e)
  }
}

onMounted(async () => {
  await strypePayment()
})

// Réinitialisation du state de la command : Command => commandId
// Réinitialisation du state du panier : Card

const resetCheckout = () => {
  cartStore.resetCart()
  commandStore.resetCommand()
}

// Validation du formulaire

const handleSubmit = async () => {
  try {
    if (!stripe.value || !cardStripe.value) {
      setErrorMessage('Stripe non chargé correctement')
      return
    }

    const { token, error } = await stripe.value.createToken(cardStripe.value)
    if (error || !token) {
      setErrorMessage(error?.message || 'Erreur création token')
      return
    }

    // ✅ Condition selon le type de commande

    let payload = { token: token.id }

    if (commandProfile.value[0]?.id) {
      payload.profileId = commandProfile.value[0].id
    } else {
      payload.pendingId = pendingCommand.value?.id
    }

    // Envoi au back-end
    const response = await axios.post(`${BASE_URL}/api/payment`, payload)

    switch (response.data.type) {
      case 'SUCCESS_PAYMENT':
        setSuccessMessage(response.data.message)
        resetCheckout()
        break
      case 'ERROR_PAYMENT':
        setErrorMessage(response.data.message)
        break
      default:
        setErrorMessage('Erreur inconnue')
    }
  } catch (e: any) {
    setErrorMessage('Erreur serveur, paiement non effectué')
  }
}

// MESSAGE DE CONFIRMATION

const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

const setSuccessMessage = (message: string) => {
  errorMessage.value = null
  successMessage.value = message
  setTimeout(() => {
    router.push({ path: '/finish' })
    closeAlert()
  }, 4000)
}

const setErrorMessage = (message: string) => {
  successMessage.value = null
  errorMessage.value = message
  setTimeout(() => {
    errorMessage.value = null
    closeAlert()
  }, 4000)
}

const closeAlert = () => {
  successMessage.value = null
  errorMessage.value = null
}
</script>

<template>
  <div class="page">
    <!-- Alert message -->
    <section class="alert">
      <div v-if="successMessage">
        <p class="alert__success">{{ successMessage }}</p>
      </div>
      <div v-if="errorMessage">
        <p class="alert__error">{{ errorMessage }}</p>
      </div>
    </section>

    <section class="payment">
      <!-- Form -->
      <div class="container-form">
        <h2 class="payment__title">Paiement sécurisé</h2>
        <p class="payment__subtitle">
          Entrez vos informations de carte de crédit pour effectuer le paiement
        </p>
        <!-- Component Order Summary -->
        <OrderSummary :command="selectedCommand" />
        <!-- FIN AJOUT -->
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="card-element" class="payment__label"> Numéro de carte bancaire </label>
            <p class="payment__hint">Carte Visa, Mastercard acceptées</p>
            <div id="card-element" ref="cardElement"></div>
          </div>
          <div class="d-flex flex-column">
            <button class="btn btn-primary" type="submit">Payer</button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.page {
  background: #f7f7f7;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.alert {
  width: 100%;
  text-align: center;
  &__success {
    background: #2e7d32;
    text-align: center;
    color: white;
    font-size: 14px;
    padding: 18px 0;
    font-weight: 500;
    @media (max-width: 767.98px) {
      padding: 12px 0;
      font-size: 13px;
    }
  }
  &__error {
    background: #c62828;
    text-align: center;
    color: white;
    font-size: 14px;
    padding: 18px 0;
    font-weight: 500;
    @media (max-width: 767.98px) {
      font-size: 13px;
      padding: 12px 0;
    }
  }
}

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

.payment {
  background: #f7f7f7;
  padding: 30px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100dvh - 80px);
}

.container-form {
  width: 100%;
  max-width: 500px;
  background: #fff;
  border-radius: 14px;
  padding: 28px 24px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.06);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.container-form:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.08);
}

.payment__title {
  margin: 0 0 10px 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c2c2c;
  text-align: center;
  line-height: 1.1;
}

.payment__subtitle {
  margin: 0 0 22px 0;
  color: #727272;
  line-height: 1.6;
  font-size: 0.92rem;
  text-align: center;
}

.payment__label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
  text-align: center;
  margin-bottom: 6px;
}

.payment__hint {
  font-size: 0.8rem;
  color: #6b7280;

  text-align: center;
  margin-bottom: 16px;
}

.form-group {
  margin: 16px 0;
}

#card-element {
  background: #faf8f4;
  border: 1px solid #e7e1d8;
  border-radius: 10px;
  padding: 14px 12px;
  min-height: 48px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

#card-element:focus-within {
  border-color: #df2f2f;
  box-shadow: 0 0 0 3px rgba(223, 47, 47, 0.08);
  background: #fff;
}

.btn.btn-primary {
  width: 100%;
  border: none;
  border-radius: 999px;
  background: #df2f2f;
  color: #fff;
  padding: 13px 16px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: 0 8px 16px rgba(223, 47, 47, 0.16);
}

.btn.btn-primary:hover {
  background: #c62828;
  transform: translateY(-1px);
}

.btn.btn-primary:active {
  transform: translateY(0);
}

@media (max-width: 1600px) {
  .payment {
    align-items: center;
  }

  .payment__title {
    margin: 0 0 10px 0;
    font-size: 1.5rem;
  }

  .payment__subtitle {
    margin: 0 0 16px 0;
  }

  .container-form {
    width: 100%;
    min-width: 550px;
    max-width: 550px;
  }
}

@media (max-width: 991.98px) {
  .payment {
    padding: 30px 16px 30px 16px;
    align-items: center;
  }
  .container-form {
    max-width: 100%;
    min-width: 100%;
    padding: 24px 18px;
    border-radius: 12px;
  }

  .payment__title {
    font-size: 1.45rem;
  }

  .payment__subtitle {
    font-size: 0.88rem;
    margin: 0 0 16px 0;
  }

  #card-element {
    padding: 12px 10px;
    min-height: 46px;
  }

  .btn.btn-primary {
    padding: 12px 14px;
    font-size: 0.8rem;
  }
}

@media (max-width: 767.98px) {
  .payment {
    padding: 30px 16px 30px 16px;
    align-items: center;
  }

  .payment__title {
    font-size: 1.2rem;
  }

  .payment__subtitle {
    font-size: 13px;
    margin: 0 0 15px 0;
    line-height: 1.5;
  }

  .container-form {
    padding: 20px 14px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  }
}
</style>
