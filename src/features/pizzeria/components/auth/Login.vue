<script setup lang="ts">
import AlertMessage from '@/templates/alertMessage/AlertMessage.vue'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useAuthStore } from '@/stores/authStore.ts'
import * as z from 'zod'
import { ref } from 'vue'

const authStore = useAuthStore()

const schema = z.object({
  email: z.string({ message: 'Email requis' }).email({ message: "L'email n'est pas valide" }),
  password: z.string({ message: 'Mot de passe requis' }),
})

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema),
})

const { value: email, errorMessage: errorEmail } = useField('email')
const { value: password, errorMessage: errorPassword } = useField('password')

const MESSAGES = {
  SUCCESS_LOGIN: 'Vos êtes connecté',
  INVALID_CREDENTIALS: 'Identifiant ou mot de passe invalid',
  EMAIL_NOT_FOUND: "Aucun compte n'existe avec cet email",
}

const onSubmit = handleSubmit(async (dataLogin, { resetForm }) => {
  try {
    const response = await authStore.emailExistingLogin(dataLogin)
    if (response.exists) {
      await authStore.login(dataLogin)
      const isLoggedIn = authStore.isLoggedIn
      if (isLoggedIn) {
        setSuccessMessage(MESSAGES.SUCCESS_LOGIN, resetForm)
      } else {
        setErrorMessage(MESSAGES.INVALID_CREDENTIALS)
      }
    } else {
      setErrorMessage(MESSAGES.EMAIL_NOT_FOUND)
    }
  } catch (e) {
    console.error(e)
  }
})

// Messages validation form

const successMessage = ref<string>('')
const errorMessage = ref<string>('')

let reset = () => {}

function setSuccessMessage(message: string, resetForm: () => void) {
  successMessage.value = message
  reset = resetForm
}

function setErrorMessage(message: string) {
  errorMessage.value = message
}

function closeAlert() {
  successMessage.value = ''
  errorMessage.value = ''
}

function handleResetForm() {
  closeAlert()
  reset()
}

// Fields form

const fields = [
  {
    label: 'Email',
    for: 'email',
    type: 'text',
    name: 'email',
    value: email,
    errorMessage: errorEmail,
  },
  {
    label: 'Mot de passe',
    for: 'password',
    type: 'password',
    name: 'password',
    value: password,
    errorMessage: errorPassword,
  },
]
</script>

<template>
  <div class="login">
    <!-- Formulaire de connexion d'un utlisateur -->
    <div class="login__container">
      <h3>Se Connecter</h3>
      <form @submit.prevent="onSubmit" class="login__form">
        <div v-for="(field, index) in fields" :key="index">
          <div class="form-group">
            <label :for="field.for">{{ field.label }}</label>
            <input v-model="field.value.value" :type="field.type" :name="field.name" />
          </div>
          <span v-if="field.errorMessage" class="error-field">
            {{ field.errorMessage }}
          </span>
        </div>
        <!-- Gestion messages de la validations -->
        <div class="login__alert">
          <AlertMessage
            v-if="successMessage"
            :message="successMessage"
            type="success"
            redirectTo="/"
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
        <div class="login__button">
          <button class="btn btn-primary" :disabled="isSubmitting">Soumettre</button>
          <router-link to="/request-password" class="router-request-password"
            >Mot de passe oublié?</router-link
          >
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 80px); /* adapte à ton header */
  &__container {
    z-index: 1;
    background: #fff;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.12);
    border: 1px solid #eee;
    width: 100%;
    max-width: 400px;
    padding: 32px;
    border-radius: 12px;
  }
  &__container h3 {
    text-align: center;
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
  &__alert {
    //min-height: 20px;
  }
  &__button {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
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

@media (max-width: 767.98px) {
  .login {
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
