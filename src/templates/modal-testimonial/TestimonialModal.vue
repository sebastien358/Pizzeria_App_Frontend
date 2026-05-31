<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { computed, ref } from 'vue'
import { useTestimonialStore } from '@/stores/testimonialStore.ts'

const testimonialStore = useTestimonialStore()

const props = defineProps<{
  isActive: boolean
}>()

const emit = defineEmits<{
  (e: 'closeModalTestimonial'): void
}>()

const closeModalTestimonial = () => {
  emit('closeModalTestimonial')
}

// Création Form

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 Mo

const schema = z.object({
  firstname: z
    .string({ message: 'Veuillez renseigner votre prénom' })
    .min(3, { message: 'Le prénom doit contenir au moins 3 caractères' })
    .max(125, { message: 'Le prénom ne peut pas dépasser 125 caractères' }),
  lastname: z
    .string({ message: 'Veuillez renseigner votre nom' })
    .min(3, { message: 'Le nom doit contenir au moins 3 caractères' })
    .max(125, { message: 'Le nom ne peut pas dépasser 125 caractères' }),
  rating: z.coerce
    .number({ message: 'Veuillez sélectionner une note' })
    .min(1, { message: 'Veuillez sélectionner une note' })
    .max(5, { message: 'La note maximum est 5' }),
  message: z
    .string({ message: 'Veuillez ajouter votre témmoignage' })
    .min(30, { message: 'Le message doit contenir au moins 30 caractères' })
    .max(100, { message: 'Le message ne peut pas dépasser 100 caractères' }),
  images: z
    .array(z.instanceof(File))
    .optional()
    .refine(
      (files) => {
        if (!files) return true
        return files.every(
          (file) =>
            file.size <= MAX_FILE_SIZE &&
            ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
        )
      },
      {
        message: 'Chaque fichier doit faire moins de 5Mo et être au format JPEG, PNG ou WEBP',
      },
    ),
})

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema),
})

const { value: firstname, errorMessage: errorFirstname } = useField<string>('firstname')
const { value: lastname, errorMessage: errorLastname } = useField<string>('lastname')
const { value: rating, errorMessage: errorRating } = useField<number | null>('rating', undefined, {
  initialValue: null,
})
const { value: message, errorMessage: errorTextarea } = useField<string>('message')
const { value: images, errorMessage: errorImages, setValue } = useField<string>('images')

const filename = ref<string | null>(null)

const changeFiles = (e: Event) => {
  const files: File = (e.target as HTMLInputElement).files
  if (!files) return

  const fileArray = Array.from(files)
  setValue(fileArray)

  filename.value = fileArray[0]?.name
}

const onSubmit = handleSubmit(async (dataTestimonial) => {
  try {
    await testimonialStore.addTestimonial(dataTestimonial)
  } catch (e) {
    console.error(e)
  }
})

const fields = computed(() => [
  {
    type: 'text',
    placeholder: 'Votre prénom',
    value: firstname,
    errorMessage: errorFirstname,
  },
  {
    type: 'text',
    placeholder: 'Votre nom',
    value: lastname,
    errorMessage: errorLastname,
  },
  {
    type: 'select',
    placeholder: 'Choix de la catégorie',
    value: rating,
    errorMessage: errorRating,
  },
  {
    type: 'file',
    placeholder: 'Choisir un fichier',
    value: images,
    errorMessage: errorImages,
  },
  {
    type: 'textarea',
    placeholder: 'Votre témoignage...',
    value: message,
    errorMessage: errorTextarea,
  },
])
</script>

<template>
  <Teleport v-if="props.isActive" to="body">
    <section class="modal-testimonial">
      <div class="modal-testimonial__container">
        <div class="modal-testimonial__close">
          <font-awesome-icon icon="fa-solid fa-xmark" @click="closeModalTestimonial()" />
        </div>
        <h3>Laisser votre avis</h3>
        <form @submit.prevent="onSubmit">
          <div class="modal-testimonial__form">
            <div v-for="(f, index) in fields" :key="index" class="form-group">
              <input
                v-if="f.type === 'text'"
                v-model="f.value.value"
                :placeholder="f.placeholder"
              />
              <div class="input-select" v-if="f.type === 'select'">
                <select v-model="f.value.value">
                  <option :value="null" disabled>{{ f.placeholder }}</option>
                  <option value="5">★★★★★ 5 étoiles</option>
                  <option value="4">★★★★☆ 4 étoiles</option>
                  <option value="3">★★★☆☆ 3 étoiles</option>
                  <option value="2">★★☆☆☆ 2 étoiles</option>
                  <option value="1">★☆☆☆☆ 1 étoile</option>
                </select>
              </div>

              <textarea
                v-if="f.type === 'textarea'"
                :type="f.type"
                v-model="f.value.value"
                :placeholder="f.placeholder"
              ></textarea>

              <div class="input-file" v-if="f.type === 'file'">
                <label class="input-file__label">
                  <input type="file" @change="changeFiles($event)" class="input-file__input" />
                  <span>{{ filename || '📎 Choisir une photo' }}</span>
                </label>
              </div>

              <span v-if="f.errorMessage.value" class="error-fields">
                {{ f.errorMessage.value }}</span
              >
            </div>
          </div>
          <div class="modal-testimonial__button">
            <button type="submit" class="btn btn-testimonial" :disabled="isSubmitting">
              Soumettre
            </button>
          </div>
        </form>
      </div>
    </section>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-testimonial {
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  padding: 20px;
  inset: 0;
  &__container {
    width: 100%;
    max-width: 460px;
    background: white;
    padding: 20px 15px 15px 15px;
    border-radius: 6px;
    h3 {
      font-size: 18px;
      text-align: center;
      margin-bottom: 15px;
      letter-spacing: 1px;
    }
  }
  &__close {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 10px;
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: #999;
    line-height: 1;
    transition: all 150ms ease;
    &:hover {
      color: #1a1a1a;
    }
  }
  &__form {
    display: flex;
    flex-direction: column;
    gap: 15px;

    .form-group input,
    textarea,
    select {
      width: 100%;
      border-radius: 6px;
      padding: 14px 10px;
      font-size: 12px;
      outline: none;
      color: #191818;
      background: #f8f8f8;
      border: 1px solid #e0e0e0;
      &:hover {
        border-color: #e63946;
        color: #e63946;
      }
    }
    .form-group textarea {
      height: 150px;
    }

    .form-group select {
      color: #919191;
    }
    .error-fields {
      font-size: 12px;
      color: red;
      margin-top: 6px;
      margin-left: 2px;
    }

    .input-file {
      &__input {
        display: none;
      }

      &__label {
        display: block;
        width: 100%;
        padding: 14px 10px;
        background: #f8f8f8;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        font-size: 13px;

        color: #999;

        cursor: pointer;
        transition: border-color 0.2s;
        box-sizing: border-box;
        &:hover {
          border-color: #e63946;
          color: #e63946;
        }
      }
    }
  }
  &__button {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    .btn-testimonial {
      background: #e63946;
      color: white;
      border: none;
      padding: 11px 24px;
      border-radius: 50px;
      font-size: 10px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.2s;

      &:hover {
        background: #c1121f;
      }
    }
  }
}
</style>
