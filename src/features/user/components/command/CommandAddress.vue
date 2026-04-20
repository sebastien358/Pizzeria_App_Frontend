<script setup lang="ts">
import CommandProgress from '@/templates/commandProgress/CommandProgress.vue'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import AlertMessage from '@/templates/alertMessage/AlertMessage.vue'
import { onMounted, ref } from 'vue'
import { useCommandUserStore } from '@/stores/user/commandUserStore.ts'
import * as z from 'zod'

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
  validationSchema: toTypedSchema(schema)
})

const { value: firstName, errorMessage: errorFirstName } = useField('firstName')
const { value: lastName, errorMessage: errorLastName } = useField('lastName')
const { value: address, errorMessage: errorAddress } = useField('address')
const { value: zipCode, errorMessage: errorZipCode } = useField('zipCode')
const { value: addressComplement, errorMessage: errorAddressComplement } = useField('addressComplement')
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
    if (!response) {
      setErrorMessage(MESSAGES.INVALID_CREDENTIALS)
      return
    }

    setSuccessMessage(MESSAGES.SUCCESS_ADDRESS, resetForm)
    currentStep.value = 3
  } catch (e) {
    console.error(e)
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
    label: 'Pays',
    css: 'label-delivery',
    type: 'select',
    name: 'delivery',
    value: deliveryType,
    errorMessage: errorDeliveryType,
  },
]
</script>

<template>
  <!-- Command progress -->
  <CommandProgress :currentStep="currentStep" />
  <!-- Form address command -->
  <section class="address">
    <div class="container-form">
      <h2>Entrer vos données</h2>
      <form @submit.prevent="onSubmit">
        <div class="form-column">
          <div v-for="(field, index) in fields" :key="index">
            <div class="d-flex flex-column form-group">
              <label :class="field.css">{{ field.label }}</label>
              <input
                v-if="field.type !== 'select'"
                v-model="field.value.value"
                :type="field.type"
                :name="field.name"
              />
              <select v-else v-model="field.value.value">
                <option value="">-- Veuillez sélectionner un pays --</option>
                <option value="À emporter">À empoter</option>
                <option value="Livraison">Livraison</option>
              </select>
            </div>
            <!-- Error message field -->
            <span v-if="field.errorMessage.value" class="error-field">
              {{ field.errorMessage.value }}
            </span>
          </div>
        </div>
        <!-- Alert message -->
        <div class="text-center">
          <AlertMessage
            v-if="successMessage"
            :message="successMessage"
            type="success"
            redirectTo="/payment"
            @close="handleResetForm()"
            class="alert"
          />
          <AlertMessage
            v-if="errorMessage"
            :message="errorMessage"
            type="error"
            redirectTo=""
            @close="closeAlert()"
            class="alert"
          />
        </div>
        <!-- Button valdation form -->
        <div class="d-flex align-items-center flex-end">
          <button class="btn btn-black" :disabled="isSubmitting">
            <span v-if="isSubmitting">Chargement...</span>
            <span v-else>Enregister la commande</span>
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
</style>
