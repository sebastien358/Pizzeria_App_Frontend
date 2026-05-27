<script setup lang="ts">
import AlertMessage from '@/templates/alertMessage/AlertMessage.vue'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useAuthStore } from '@/stores/authStore.ts'
import * as z from 'zod'
import { nextTick, onMounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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

// GSAP

const loginGsap = ref<HTMLElement | null>(null)

function loginGsapAnimation() {
  const login = loginGsap.value

  if (!login) return

  gsap.fromTo(
    login,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
    },
  )
}

onMounted(async () => {
  await nextTick()
  loginGsapAnimation()
})
</script>

<template>
  <div class="login" ref="loginGsap">
    <div class="login__container">
      <h2 class="login__title">Connexion</h2>
      <p class="login__subtitle">Bon retour ! Connectez-vous à votre compte.</p>

      <form @submit.prevent="onSubmit" class="login__form">
        <div v-for="(field, index) in fields" :key="index" class="form-group">
          <label :for="field.for">{{ field.label }}</label>
          <div class="input-wrap">
            <i
              :class="field.type === 'password' ? 'fa-solid fa-lock' : 'fa-regular fa-envelope'"
            ></i>
            <input
              v-model="field.value.value"
              :type="field.type"
              :name="field.name"
              :id="field.for"
              :placeholder="field.type === 'password' ? '••••••••' : 'vous@exemple.com'"
            />
          </div>
          <span v-if="field.errorMessage" class="error-field">{{ field.errorMessage }}</span>
        </div>

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

        <div class="login__forgot">
          <router-link to="/request-password">Mot de passe oublié ?</router-link>
        </div>

        <button class="btn-primary" :disabled="isSubmitting">
          <span v-if="isSubmitting">Chargement...</span>
          <span v-else>Se connecter</span>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100dvh - 80px);
  padding: 0 16px;
  box-sizing: border-box;

  &__container {
    background: #fff;
    border: 1px solid #eee;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    width: 100%;
    max-width: 440px;
    padding: 2.5rem 2rem;
  }

  &__title {
    text-align: center;
    font-size: 1.4rem;
    font-weight: 700;
    color: #111;
    margin: 0 0 6px;
  }

  &__subtitle {
    text-align: center;
    font-size: 13px;
    color: #777;
    line-height: 1.6;
  }

  &__form {
    display: flex;
    flex-direction: column;
    .form-group {
      margin-top: 15px;
    }
    label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: #555;
      margin-bottom: 6px;
    }

    .input-wrap {
      position: relative;

      i {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 15px;
        color: #aaa;
        pointer-events: none;
      }

      input {
        width: 100%;
        box-sizing: border-box;
        padding: 11px 12px 11px 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        background: #f9f9f9;
        font-size: 14px;
        color: #111;
        outline: none;
        transition:
          border-color 0.15s,
          box-shadow 0.15s,
          background 0.15s;

        &::placeholder {
          color: #ccc;
        }

        &[type='password']::placeholder {
          letter-spacing: 2px;
        }

        &:focus {
          border-color: #e63946;
          box-shadow: 0 0 0 3px rgba(230, 57, 70, 0.12);
          background: #fff;
        }
      }
    }

    .error-field {
      color: #e63946;
      font-size: 12px;
      margin: 4px 0 0 2px;
      display: block;
    }
  }

  &__forgot {
    text-align: right;
    margin-top: -2px;
    a {
      font-size: 12px;
      color: #e63946;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  &__alert {
    text-align: center;
  }

  &__alert .alert {
    text-align: center;
    margin-top: 15px;
    font-size: 15px;
  }

  .btn-primary {
    margin-top: 10px;
    width: 100%;
    padding: 11px;
    background: #e63946;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition:
      background 0.2s,
      transform 0.15s;

    &:hover {
      background: #d62839;
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
    }
  }
}

@media (max-width: 767.98px) {
  .login {
    padding: 0 16px 0 16px;
    &__title {
      font-size: 1.2rem;
      margin: 0 0 4px;
    }
    &__subtitle {
      font-size: 12px;
    }
    &__container {
      padding: 2rem 1.25rem;
    }
    .form-group {
      margin-top: 12px;
    }
    .form-group label {
      font-size: 12px;
      margin-bottom: 3px;
    }
    .form-group .error-field {
      font-size: 11px;
      margin: 3px 0 0 2px;
    }
    &__forgot {
      margin-top: -3px;
      a {
        font-size: 10px;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    &__alert .alert {
      margin-top: 10px;
      font-size: 14px;
    }
    .btn-primary {
      padding: 11px;
      font-size: 12px;
    }
  }
}
</style>
