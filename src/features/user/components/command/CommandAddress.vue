<script setup lang="ts">
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
    label: 'Mode de commande',
    css: 'label-delivery',
    type: 'select',
    name: 'delivery',
    value: deliveryType,
    errorMessage: errorDeliveryType,
  },
]
</script>

<template>
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
                <option value="À emporter">À emporter</option>
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
        <div class="#">
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
.address {
  min-height: calc(100vh - 80px);
  background: #f7f7f7;
  padding: 130px 20px 80px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.container-form {
  width: 100%;
  max-width: 720px;
  background: #fff;
  border-radius: 18px;
  padding: 38px 32px;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.07);
}

.container-form h2 {
  margin: 0 0 28px;
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: #2c2c2c;
}

.form-column {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px 20px;
}

.form-group {
  gap: 8px;
}

.form-group label {
  font-size: 0.92rem;
  font-weight: 600;
  color: #2c2c2c;
}

.form-group input,
.form-group select {
  width: 100%;
  min-height: 48px;
  padding: 12px 14px;
  border: 1px solid #e5ddd3;
  border-radius: 10px;
  background: #faf8f4;
  color: #2c2c2c;
  font-size: 0.95rem;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #df2f2f;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(223, 47, 47, 0.08);
}

.form-group select {
  cursor: pointer;
}

.error-field {
  display: block;
  margin-top: 6px;
  font-size: 0.82rem;
  color: #d62828;
}

.text-center {
  margin-top: 24px;
}

.alert {
  margin-top: 10px;
}

.flex-end {
  justify-content: flex-end;
}

.btn.btn-black {
  min-width: 220px;
  padding: 13px 22px;
  border: none;
  border-radius: 999px;
  background: #2c2c2c;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: 0 10px 20px rgba(44, 44, 44, 0.12);
}

.btn.btn-black:hover {
  background: #1f1f1f;
  transform: translateY(-2px);
}

.btn.btn-black:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

@media (max-width: 768px) {
  .address {
    padding: 110px 16px 60px;
  }
  .container-form {
    padding: 28px 20px;
    border-radius: 14px;
  }
  .container-form h2 {
    font-size: 1.65rem;
    margin-bottom: 22px;
  }
  .form-column {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  .btn.btn-black {
    width: 100%;
    min-width: 100%;
  }
  .flex-end {
    justify-content: stretch;
  }
}
</style>
