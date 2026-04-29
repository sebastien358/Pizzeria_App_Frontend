<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import AlertMessage from '@/templates/alertMessage/AlertMessage.vue'
import { useAuthStore } from '@/stores/authStore.ts'
const authStore = useAuthStore()
import { ref } from 'vue'
import * as z from 'zod'

const schema = z
  .object({
    email: z.string({ message: 'Email requis' }).email({ message: "L'email n'est pas valide" }),
    password: z.string({ message: 'Mot de passe requis' }),
    passwordConfirm: z.string({ message: 'Confirmation de mot de passe requise' }),
  })
  .refine((value) => value.password === value.passwordConfirm, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['passwordConfirm'],
  })

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema),
})

const MESSAGES = {
  SUCCESS_REGISTER: 'Inscription réussie',
  ERROR_REGISTER: "L'inscription a échouée",
}

const { value: email, errorMessage: errorEmail } = useField<string>('email')
const { value: password, errorMessage: errorPassword } = useField<string>('password')
const { value: passwordConfirm, errorMessage: errorPasswordConfirm } =
  useField<string>('passwordConfirm')

const onSubmit = handleSubmit(async (dataRegister, { resetForm }) => {
  try {
    const response = await authStore.register(dataRegister)
    if (!response) {
      setErrorMessage(MESSAGES.ERROR_REGISTER)
      return
    }

    setSuccessMessage(MESSAGES.SUCCESS_REGISTER, resetForm)
  } catch (e: any) {
    const apiError = e?.response?.data
    if (apiError.type === 'REGISTER_EMAIL_EXIST') {
      setErrorMessage(apiError.message)
      return
    }
    setErrorMessage('Une erreur est survenue')
  }
})

const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

let reset = () => {}

const setSuccessMessage = (msg: string, resetForm: () => void) => {
  successMessage.value = msg
  errorMessage.value = null
  reset = resetForm
}

const setErrorMessage = (msg: string) => {
  errorMessage.value = msg
  successMessage.value = null
}

const closeAlert = () => {
  successMessage.value = null
  errorMessage.value = null
}

const handleResetForm = () => {
  closeAlert()
  reset()
}

const fields = [
  { label: 'Email', type: 'text', value: email, errorMessage: errorEmail },
  { label: 'Mot de passe', type: 'password', value: password, errorMessage: errorPassword },
  {
    label: 'Confirmation de mot de passe',
    type: 'password',
    value: passwordConfirm,
    errorMessage: errorPasswordConfirm,
  },
]
</script>

<template>
  <div class="register">
    <!-- Formulaire de crétion d'un utlisateur -->
    <div class="register__container">
      <h3>S'inscrire</h3>
      <form @submit.prevent="onSubmit">
        <div v-for="(field, index) in fields" :key="index">
          <div class="form-group">
            <label>{{ field.label }}</label>
            <input v-model="field.value.value" :type="field.type" />
          </div>
          <span v-if="field.errorMessage" class="error-field">
            {{ field.errorMessage }}
          </span>
        </div>
        <!-- Gestion messages de validations -->
        <div class="register__alert">
          <AlertMessage
            v-if="successMessage"
            :message="successMessage"
            type="success"
            redirectTo="/login"
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
        <div class="register__button">
          <button class="btn btn-primary" :disabled="isSubmitting">
            <span v-if="isSubmitting">Chargement...</span>
            <span v-else>Soumettre</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.register {
  display: flex;
  justify-content: center;
  align-items: center; /* 🔥 centre vertical */
  height: calc(100vh - 80px); /* adapte à ton header */
  padding: 0 20px;
  &__container {
    z-index: 1;
    background: #fff;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.12);
    border: 1px solid #eee;
    width: 100%;
    max-width: 400px;
    padding: 32px;
    border-radius: 12px;
    h3 {
      text-align: center;
    }
  }
  &__form {
    display: flex;
    flex-direction: column;
  }
  .form-group {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
  }
  .form-group label {
    font-size: 14px;
    color: #333;
    margin-bottom: 5px;
  }
  .form-group input {
    width: 100%;
    padding: 10px 12px;
    border-radius: 6px;
    border: 1px solid #ddd;
    transition: 0.2s;
    font-size: 14px;
  }
  .form-group input:focus {
    outline: none;
    border-color: #e63946;
    box-shadow: 0 0 0 4px rgba(230, 57, 70, 0.12);
  }
  .error-field {
    font-size: 12px;
    color: #e63946;
  }
  .register__alert {
    //min-height: 20px;
  }
  &__button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
  .btn {
    margin-top: 15px;
    padding: 10px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
  }
  .btn-primary {
    background: #e63946;
    color: white;
    transition: all 0.2s ease;
  }
  .btn-primary:hover {
    background: #d62839;
    transform: translateY(-1px);
  }
  .btn-primary:active {
    transform: translateY(0);
  }
  .btn-primary:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  .router-request-password {
    font-size: 13px;
    color: #555;
    text-align: center;
    text-decoration: none;
  }
  .router-request-password:hover {
    text-decoration: underline;
  }
}

/* ===== RESPONSIVE ===== */

@media (max-width: 1024px) {
  .register {
    height: 100%;
    padding: 140px 20px 140px 20px;
  }
}

@media (max-width: 767.98px) {
  .register {
    height: 100%;
    padding: 140px 20px 140px 20px;
    &__container {
      max-width: 100%;
      padding: 24px 20px;
      border-radius: 8px;
    }
    &__form {
      gap: 0;
    }
    .form-group label {
      font-size: 13px;
    }
    .form-group input {
      padding: 12px;
      font-size: 12px;
    }
    .btn {
      padding: 12px 15px;
      font-size: 12px;
    }
  }
}
</style>
