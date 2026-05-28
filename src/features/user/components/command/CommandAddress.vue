<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import AlertMessage from '@/templates/alertMessage/AlertMessage.vue'
import { nextTick, onMounted, ref } from 'vue'
import { useCommandUserStore } from '@/stores/user/commandUserStore.ts'
import * as z from 'zod'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
// Récupération de la commande de l'utilisateur connecté

const commandUserStore = useCommandUserStore()

onMounted(async () => {
  try {
    await commandUserStore.getCommandUser()
  } catch (e) {
    console.error(e)
  }
})

// Form Command

const schema = z.object({
  firstName: z.string({ message: 'Le prénom est requis' }),
  lastName: z.string({ message: 'Le nom est requis' }),
  address: z.string({ message: "L'adresse est requise" }),
  zipCode: z.string({ message: 'Le code postal est requis' }).regex(/^\d{5}$/, {
    message: 'Le code postal doit être composé de 5 chiffres',
  }),
  addressComplement: z.string().optional(),
  city: z.string({ message: 'La ville est requise' }),
  phoneNumber: z.string({ message: 'Le numéro de téléphone est requis' }).regex(/^0\d{9}$/, {
    message: 'Le numéro de téléphone doit être composé de 10 chiffres et commencer par 0',
  }),
  deliveryType: z.string({ message: 'Veuillez choisir un type de livraison' }),
})

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema),
})

const { value: firstName, errorMessage: errorFirstName } = useField('firstName')
const { value: lastName, errorMessage: errorLastName } = useField('lastName')
const { value: address, errorMessage: errorAddress } = useField('address')
const { value: zipCode, errorMessage: errorZipCode } = useField('zipCode')
const { value: addressComplement, errorMessage: errorAddressComplement } =
  useField('addressComplement')
const { value: city, errorMessage: errorCity } = useField('city')
const { value: phoneNumber, errorMessage: errorPhoneNumber } = useField('phoneNumber')
const { value: deliveryType, errorMessage: errorDeliveryType } = useField('deliveryType')

// MESSAGE FORM

const MESSAGES = {
  SUCCESS_ADDRESS: 'Vos données ont bien été enregistrées',
  INVALID_CREDENTIALS: "Vos données n'ont pas pu être enregistrées",
}

// STEP : PROGRESSION DE LA COMMANDE

const currentStep = ref<number>(2)

// FORM SUBMIT

const onSubmit = handleSubmit(async (dataClient, { resetForm }) => {
  try {
    const response = await commandUserStore.addCommandAddress(dataClient)

    console.log('Response commande :', response)

    if (!response || !response.success || !response.pendingCommand) {
      setErrorMessage(MESSAGES.INVALID_CREDENTIALS)
      return
    }

    setSuccessMessage(MESSAGES.SUCCESS_ADDRESS, resetForm)
  } catch (e) {
    console.error(e)
    setErrorMessage(MESSAGES.INVALID_CREDENTIALS)
  }
})

// GESTION FORM : REDIRECTION ET MESSAGES

const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

let reset = () => {}

const setSuccessMessage = (message: string, resetForm: () => void) => {
  errorMessage.value = null
  successMessage.value = message
  reset = resetForm
}

const setErrorMessage = (message: string) => {
  successMessage.value = null
  errorMessage.value = message
}

const closeAlert = () => {
  successMessage.value = null
  errorMessage.value = null
}

const handleResetForm = () => {
  closeAlert()
  reset()
}

// INPUTS FORM

const fields = [
  {
    label: 'Prénom',
    css: 'label-firstname',
    type: 'text',
    name: 'firstName',
    value: firstName,
    errorMessage: errorFirstName,
  },
  {
    label: 'Nom',
    css: 'label-lastname',
    type: 'text',
    name: 'lastName',
    value: lastName,
    errorMessage: errorLastName,
  },
  {
    label: 'Adresse (numéro et rue)',
    css: 'label-address',
    type: 'text',
    name: 'address',
    value: address,
    errorMessage: errorAddress,
  },
  {
    label: "Complément d'adresse (facultatif)",
    css: 'label-complement-address',
    type: 'text',
    name: 'addressComplement',
    value: addressComplement,
    errorMessage: errorAddressComplement,
  },
  {
    label: 'Code postal',
    css: 'label-zip-code',
    type: 'text',
    name: 'zipCode',
    value: zipCode,
    errorMessage: errorZipCode,
  },
  {
    label: 'Ville',
    css: 'label-city',
    type: 'text',
    name: 'city',
    value: city,
    errorMessage: errorCity,
  },
  {
    label: 'Téléphone',
    css: 'label-tel',
    type: 'tel',
    name: 'phoneNumber',
    value: phoneNumber,
    errorMessage: errorPhoneNumber,
  },
  {
    label: 'Mode de commande',
    css: 'label-delivery',
    type: 'select',
    name: 'delivery',
    value: deliveryType,
    errorMessage: errorDeliveryType,
  },
]

// ANIMATION

const addressGsap = ref<HTMLElement | null>(null)

async function addressGsapAnimation() {
  if (!addressGsap.value) return

  await nextTick()

  const tl = gsap.timeline()

  tl.from(addressGsap.value, {
    opacity: 0,
    y: 0,
    duration: 0.8,
    filter: 'blur(20px)',
    ease: 'power2.out',
  })

  tl.from('.address__header__subtitle', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power2.out',
  })

  tl.from(
    '.address__header__title',
    {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out',
    },
    '-=0.35',
  )

  tl.from(
    '.address__header__line',
    {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out',
    },
    '-=0.35',
  )

  tl.from(
    '.form-group',
    {
      opacity: 0,
      y: 15,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out',
    },
    '-=0.2',
  )

  tl.from(
    '.btn-command',
    {
      opacity: 0,
      y: 0,
      duration: 0.4,
      filter: 'blur(2px)',
      ease: 'power2.out',
    },
    '-=0.2',
  )
}

onMounted(async () => {
  await addressGsapAnimation()
})
</script>

<template>
  <section class="address">
    <div class="address__form" ref="addressGsap">
      <div class="address__header">
        <span class="address__header__subtitle">VOTRE LIVRAISON</span>
        <h3 class="address__header__title">Informations de livraison</h3>
        <div class="address__header__line"></div>
      </div>

      <form @submit.prevent="onSubmit">
        <div class="form-column">
          <div v-for="(field, index) in fields" :key="index" class="form-group">
            <label :class="field.css">{{ field.label }}</label>
            <div class="form-group__input-wrapper">
              <input
                v-if="field.type !== 'select'"
                v-model="field.value.value"
                :type="field.type"
                :name="field.name"
                class="form-group__input"
                :class="{ 'form-group__input--error': field.errorMessage.value }"
              />
              <select
                v-else
                v-model="field.value.value"
                class="form-group__select"
                :class="{ 'form-group__select--error': field.errorMessage.value }"
              >
                <option value="" disabled>Sélectionner un mode</option>
                <option value="À emporter">🛍 À emporter</option>
                <option value="Livraison">🚚 Livraison à domicile +5 euros</option>
              </select>
            </div>
            <span v-if="field.errorMessage.value" class="error-field">
              {{ field.errorMessage.value }}
            </span>
          </div>
        </div>

        <div class="address__alert">
          <AlertMessage
            v-if="successMessage"
            :message="successMessage"
            type="success"
            redirectTo="/payment"
            @close="handleResetForm()"
            class="address__alert__message"
          />
          <AlertMessage
            v-if="errorMessage"
            :message="errorMessage"
            type="error"
            redirectTo=""
            @close="closeAlert()"
            class="address__alert__message"
          />
        </div>

        <div class="address__button">
          <button class="btn btn-command" :disabled="isSubmitting">
            <span v-if="isSubmitting">Chargement...</span>
            <span v-else>Enregistrer la commande</span>
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
.address {
  height: calc(100dvh - 80px);
  background: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;

  &__form {
    background: white;
    border-radius: 4px;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
    width: 100%;
    max-width: 650px;
    padding: 3rem 2rem 2rem 2rem;
  }

  &__header {
    text-align: center;
    margin-bottom: 2.2rem;

    &__subtitle {
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      color: #e63946;
      font-weight: 600;
      text-transform: uppercase;
    }

    &__title {
      font-size: 1.7rem;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0.5rem 0;
      font-family: 'Georgia', serif;
    }

    &__line {
      width: 45px;
      height: 3px;
      background: #e63946;
      margin: 0.8rem auto 0;
      border-radius: 2px;
    }
  }

  &__button {
    margin-top: 25px;
    text-align: center;
  }

  &__alert {
    text-align: center;
    margin-top: 15px;
  }
}

.form-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__input,
  &__select {
    padding: 0.85rem 1rem;
    border: 1.5px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    background: #fafafa;
    color: #1a1a1a;
    transition:
      border-color 0.2s,
      background 0.2s;
    outline: none;
    width: 100%;
    box-sizing: border-box;

    &:focus {
      border-color: #e63946;
      background: white;
      box-shadow: 0 0 0 3px rgba(230, 57, 70, 0.08);
    }

    &--error {
      border-color: #e63946;
    }
  }

  &__select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%23999' d='M5 6L0 0h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-color: #fafafa;
    padding-right: 2.5rem;
  }
}

.error-field {
  font-size: 12px;
  color: #e63946;
}

.btn-command {
  background: #e63946;
  color: white;
  border: none;
  padding: 20px 30px;
  border-radius: 50px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition:
    background 0.2s,
    transform 0.1s;

  &:hover {
    background: #c1121f;
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

@media (max-width: 1600px) {
  .address {
    &__header {
      &__title {
        font-size: 1.8rem;
      }
    }

    &__form {
      max-width: 650px;
      padding: 3rem 2rem 2rem 2rem;
    }

    .form-group {
      label {
        font-size: 0.65rem;
      }
    }
    &__button {
      margin-top: 15px;
    }
  }
  .btn-command {
    font-size: 10px;
    padding: 17px 25px;
  }
}

@media (max-width: 767.98px) {
  .address {
    height: 100%;
    padding: 30px 15px;
    &__header {
      margin-bottom: 1.8rem;
      &__title {
        font-size: 19px;
        margin: 0.5rem 0 0 0;
      }
    }

    &__form {
      padding: 1rem;
    }

    .form-group {
      &__input,
      &__select {
        padding: 11px;
        font-size: 13px;
      }
    }

    .form-column {
      grid-template-columns: 1fr;
    }

    .form-group {
      gap: 0.2rem;
      label {
        font-size: 0.55rem;
        font-weight: 600;
        color: #555;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }
  }

  .btn-command {
    font-size: 9px;
    padding: 17px 25px;
  }
}
</style>
