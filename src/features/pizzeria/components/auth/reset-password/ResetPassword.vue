<script setup lang="ts">
import AlertMessage from '@/templates/alertMessage/AlertMessage.vue'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useAuthStore } from '@/stores/authStore.ts'
import { nextTick, onMounted, ref } from 'vue'
import * as z from 'zod'
import { useRoute } from 'vue-router'

const authStore = useAuthStore()

const route = useRoute()

const schema = z
  .object({
    password: z.string({ message: 'Veuillez renseigner votre nouveau mot de passe' }),
    confirmPassword: z.string({ message: 'Veuillez renseigner le mot de passe de confirmation' }),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema),
})

const { value: password, errorMessage: errorPassword } = useField('password')
const { value: confirmPassword, errorMessage: errorConfirmPassword } = useField('confirmPassword')

const MESSAGES = {
  SUCCESS_RESET_PASSWORD: 'Le mot de passe a été modifié',
  ERROR_RESET_PASSWORD: 'Une erreur est survenue',
}

const onSubmit = handleSubmit(async (dataResetPassword, { resetForm }) => {
  try {
    const response = await authStore.resetPassword(dataResetPassword, route.params.token)
    if (!response) {
      setErrorMessage(MESSAGES.ERROR_RESET_PASSWORD)
      return
    }

    setSuccessMessage(MESSAGES.SUCCESS_RESET_PASSWORD, resetForm)
  } catch (e: any) {
    const apiError = e?.response?.data

    if (apiError.type === 'RESET-PASSWORD') {
      setErrorMessage(apiError.message)
      return
    }

    setErrorMessage(MESSAGES.ERROR_RESET_PASSWORD)
  }
})

const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

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

const fields = [
  {
    label: 'Mot de passe',
    for: 'Mot de passe',
    type: 'password',
    name: 'password',
    value: password,
    errorMessage: errorPassword,
  },
  {
    label: 'Confirmation de mot passe',
    for: 'Confirmation de mot passe',
    type: 'password',
    name: 'confirmPassword',
    value: confirmPassword,
    errorMessage: errorConfirmPassword,
  },
]

// GSAP

const resetGsap = ref<HTMLElement | null>(null)

async function resetGsapAnimation() {
  const reset = resetGsap.value

  if (!reset) return

  await nextTick()

  gsap.fromTo(
    reset,
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

  await resetGsapAnimation()
})
</script>

<template>
  <div class="reset-password" ref="resetGsap">
    <div class="reset-password__container">
      <div class="reset-password__icon">
        <font-awesome-icon icon="fa-solid fa-lock" />
      </div>
      <h2 class="reset-password__title">Nouveau mot de passe</h2>
      <p class="reset-password__subtitle">Choisissez un mot de passe sécurisé pour votre compte.</p>

      <form @submit.prevent="onSubmit">
        <div v-for="(field, index) in fields" :key="index" class="form-group">
          <label :for="field.for">{{ field.label }}</label>
          <div class="input-wrap">
            <i class="fa-solid fa-lock"></i>
            <input
              v-model="field.value.value"
              :type="field.type"
              :name="field.name"
              :id="field.for"
              placeholder="••••••••"
            />
          </div>
          <span v-if="field.errorMessage" class="error-field">{{ field.errorMessage }}</span>
        </div>

        <div class="reset-password__alert">
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
            :redirectTo="null"
            @close="closeAlert()"
            class="alert-message"
          />
        </div>

        <button class="btn-primary" :disabled="isSubmitting">
          <span v-if="isSubmitting">Chargement...</span>
          <span v-else>Modifier le mot de passe</span>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.reset-password {
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

  &__icon {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: #fdeaea;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.25rem;

    i {
      font-size: 22px;
      color: #e63946;
    }
  }

  &__title {
    text-align: center;
    font-size: 1.1rem;
    font-weight: 600;
    color: #111;
    margin: 0 0 6px;
  }

  &__subtitle {
    text-align: center;
    font-size: 13px;
    color: #777;
    line-height: 1.6;
    margin: 0 0 1.75rem;
  }

  &__alert {
    text-align: center;
  }

  &__alert .alert {
    text-align: center;
    margin-top: 10px;
    font-size: 15px;
  }

  .form-group {
    margin-bottom: 1.25rem;

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
}

@media (max-width: 767.98px) {
  .reset-password {
    padding: 0 16px 0 16px;
    &__container {
      padding: 2rem 1.25rem;
    }
    .form-group {
      margin-top: 10px;
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
