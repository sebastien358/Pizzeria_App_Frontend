<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import AlertMessage from '@/templates/alertMessage/AlertMessage.vue'
import { useAuthStore } from '@/stores/authStore.ts'
const authStore = useAuthStore()
import { nextTick, onMounted, ref } from 'vue'
import * as z from 'zod'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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

// GSAP

const registerGsap = ref<HTMLElement | null>(null)

async function registerGsapAnimation() {
  const register = registerGsap.value

  if (!register) return

  await nextTick()

  gsap.fromTo(
    register,
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
  window.scrollTo({ top: 0 })

  await registerGsapAnimation()
})
</script>

<template>
  <div class="register" ref="registerGsap">
    <div class="register__container">
      <h2 class="register__title">Créer un compte</h2>
      <p class="register__subtitle">Rejoignez-nous et commandez vos pizzas en ligne.</p>

      <form @submit.prevent="onSubmit" class="register__form">
        <div v-for="(field, index) in fields" :key="index" class="form-group">
          <label :for="field.for">{{ field.label }}</label>
          <div class="input-wrap">
            <i
              :class="{
                'fa-regular fa-envelope': field.type === 'email',
                'fa-solid fa-lock': field.type === 'password',
                'fa-solid fa-user': field.type === 'text',
              }"
            ></i>
            <input
              v-model="field.value.value"
              :type="field.type"
              :id="field.for"
              :placeholder="field.type === 'password' ? '••••••••' : field.label"
            />
          </div>
          <span v-if="field.errorMessage" class="error-field">{{ field.errorMessage }}</span>
        </div>

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

        <button class="btn-primary" :disabled="isSubmitting">
          <span v-if="isSubmitting">Chargement...</span>
          <span v-else>Créer mon compte</span>
        </button>

        <p class="register__login">
          Déjà un compte ?
          <router-link to="/login">Se connecter</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100dvh - 80px);
  padding: 2rem 16px;
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
  }

  &__alert {
    text-align: center;
  }

  &__alert .alert {
    text-align: center;
    margin-top: 15px;
    font-size: 15px;
  }

  .form-group {
    margin-top: 15px;

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

  .btn-primary {
    margin-top: 15px;

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

  &__login {
    text-align: center;
    font-size: 13px;
    color: #777;
    margin-top: 1.25rem;

    a {
      color: #e63946;
      text-decoration: none;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

@media (max-width: 767.98px) {
  .register {
    padding: 0 16px 0 16px;
    &__container {
      padding: 2rem 1.25rem;
    }
    &__title {
      font-size: 1.2rem;
      margin: 0 0 4px;
    }
    &__subtitle {
      font-size: 12px;
    }
    .form-group {
      margin-top: 12px;
    }
    .form-group .error-field {
      font-size: 11px;
      margin: 3px 0 0 2px;
    }
    .form-group label {
      font-size: 12px;
      margin-bottom: 3px;
    }
    &__forgot {
      margin-top: -3px;
      a {
        font-size: 11px;
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
