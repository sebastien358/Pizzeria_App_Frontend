<script setup lang="ts">
import AlertMessage from '@/templates/alertMessage/AlertMessage.vue'
import { useCartStore } from '@/stores/cartStore.ts'
import { useCommandUserStore } from '@/stores/user/commandUserStore'
import { onMounted, reactive, ref } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import { useRoute } from 'vue-router'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_APP_API_URL as string

const route = useRoute()

const cartStore = useCartStore()
const commandStore = useCommandUserStore()

const stripe = ref(null)
const cardStripe = ref(null)
const cardElement = ref(null)

// Commande en cours : ID

type PendingCommand = {
  id: number
}

const statePendingCommand = reactive<PendingCommand>({
  id: 0,
})

// Commande depuis le profil user : ID

type CommandProfile = {
  id: number
}

const stateCommandProfile = reactive<CommandProfile>({
  id: 0,
})

onMounted(async () => {
  try {
    // Commande depuis le profil user
    const id = Number(route.params.id)
    if (id) {
      // Commande depuis le profil User
      const command = await commandStore.getCurrentCommand(id)
      Object.assign(stateCommandProfile, {
        id: command.id,
      })
    } else {
      // Commande depuis le panier
      Object.assign(statePendingCommand, {
        id: commandStore.commandId,
      })
    }
  } catch (e) {
    console.error(e)
  }
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

// Step

const currentStep = ref<number>(3)

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

    if (stateCommandProfile.id) {
      payload.profileId = stateCommandProfile.id
    } else {
      payload.pendingId = statePendingCommand.id
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

const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

const setSuccessMessage = (message: string) => {
  successMessage.value = message
}

const setErrorMessage = (message: string) => {
  errorMessage.value = message
}

const closeAlert = () => {
  successMessage.value = null
  errorMessage.value = null
}

const handleResetForm = () => {
  closeAlert()
}
</script>

<template>
  <div class="payment">
    <div class="container-form">
      <h2 class="payment__title">Paiement sécurisé</h2>
      <p class="payment__subtitle">
        Entrez vos informations de carte de crédit pour effectuer le paiement
      </p>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="card-element"></label>
          <div id="card-element" ref="cardElement"></div>
        </div>
        <div class="alert-message">
          <AlertMessage
            v-if="successMessage"
            :message="successMessage"
            type="success"
            redirectTo="/finish"
            @close="handleResetForm()"
            class="alert-message"
          />
          <AlertMessage
            v-if="errorMessage"
            :message="errorMessage"
            type="error"
            redirectTo=""
            @close="closeAlert()"
            class="alert-message"
          />
        </div>
        <div class="d-flex flex-column">
          <button class="btn btn-primary" type="submit">Payer</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.payment {
  min-height: calc(100vh - 80px);
  background: #f7f7f7;
  padding: 120px 16px 40px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.container-form {
  width: 100%;
  max-width: 480px;
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
  margin: 0 0 10px;
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c2c2c;
  text-align: center;
  line-height: 1.1;
}

.payment__subtitle {
  margin: 0 0 22px;
  color: #727272;
  line-height: 1.6;
  font-size: 0.92rem;
  text-align: center;
}

.form-group {
  margin-bottom: 16px;
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

.alert-message {
  margin-bottom: 14px;
}

.btn.btn-primary {
  width: 100%;
  border: none;
  border-radius: 999px;
  background: #df2f2f;
  color: #fff;
  padding: 13px 16px;
  font-size: 0.94rem;
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

@media (max-width: 768px) {
  .payment {
    padding: 100px 14px 50px;
  }

  .container-form {
    max-width: 100%;
    padding: 24px 18px;
    border-radius: 12px;
  }

  .payment__title {
    font-size: 1.45rem;
  }

  .payment__subtitle {
    font-size: 0.88rem;
    margin-bottom: 18px;
  }

  #card-element {
    padding: 12px 10px;
    min-height: 46px;
  }

  .btn.btn-primary {
    padding: 12px 14px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .payment {
    padding: 90px 12px 40px;
  }

  .container-form {
    padding: 20px 14px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  }

  .payment__title {
    font-size: 1.3rem;
  }

  .payment__subtitle {
    font-size: 0.84rem;
    line-height: 1.5;
  }
}
</style>
