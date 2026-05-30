<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useProductAdminStore } from '@/stores/admin/productAdminStore.ts'
import { useField, useForm, useFieldArray, Field, ErrorMessage } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useRoute } from 'vue-router'
import AlertMessage from '@/templates/alertMessage/AlertMessage.vue'

const productAdminStore = useProductAdminStore()

// Récupération du paramètre ID dans l'URL

const route = useRoute()

type RouteParamsId = {
  id: number
}

const stateRouteParamsId = reactive<RouteParamsId>({
  id: 0,
})

if (route.params.id) {
  stateRouteParamsId.id = Number(route.params.id)
}

// State Product

type Pictures = {
  id: number
  filename: string
}

type productOption = {
  id: number
  name: string
  price: number
}

type Product = {
  id: number
  pictures: Pictures[]
  productOption: productOption[]
}

const stateProduct = reactive<Product>({
  id: 0,
  pictures: [],
  productOption: [],
})

// Initialisation des valeurs

const initialValues = {
  id: 0,
  title: '',
  description: '',
  productOption: [],
}

const loadProductForm = async () => {
  try {
    if (!stateRouteParamsId.id) return

    const product = await productAdminStore.currentProduct(stateRouteParamsId.id)
    if (!product) return

    Object.assign(stateProduct, product)

    setValues({
      title: product.title,
      description: product.description,
      productOption: product.productOption.map((option) => ({
        name: option.name,
        price: option.price,
      })),
    })
  } catch (e) {
    console.error(e)
  }
}

onMounted(async () => {
  push({ name: 'Petite', price: '' })
  push({ name: 'Moyenne', price: '' })
  push({ name: 'Grande', price: '' })

  await loadProductForm()
})

// Création Form

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 Mo

const schema = z.object({
  title: z.string().min(5, { message: 'Le prénom est requis' }),
  description: z.string().min(10, { message: 'Veuillez renseigner une description' }),
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
  productOption: z.array(
    z.object({
      name: z.string().min(1, { message: 'Veuillez choisir une taille pour la pizza' }),
      price: z.coerce.number().min(1, { message: 'Veuillez sélectionner un prix' }),
    }),
  ),
})

const { handleSubmit, isSubmitting, setValues } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues,
})

const { value: title, errorMessage: errorTitle } = useField<string>('title')
const { value: description, errorMessage: errorDescription } = useField<string>('description')
const { value: images, errorMessage: errorImage, setValue } = useField<string>('images')
const { fields, push } = useFieldArray('productOption')

const changeMultipleFiles = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files) {
    const filesArray: File[] = Array.from(files)
    setValue(filesArray)
  } else {
    setValue([])
  }
}

const MESSAGES = {
  SUCCESS_ADD_PRODUCT: 'Le produit a bien été ajouté',
  SUCCESS_EDIT_PRODUCT: 'Le produit a bien été modifié',
  INVALID_CREDENTIALS: 'Une erreur est survenue',
}

const onSubmit = handleSubmit(async (dataProduct, { resetForm }) => {
  try {
    if (stateRouteParamsId.id) {
      const response = await productAdminStore.editProduct(dataProduct, stateRouteParamsId.id)
      if (!response) {
        setErrorMessage(MESSAGES.INVALID_CREDENTIALS)
        return
      }

      await loadProductForm()
      setSuccessMessage(MESSAGES.SUCCESS_EDIT_PRODUCT, null)
    } else {
      const response = await productAdminStore.addAdminProduct(dataProduct)
      if (!response) {
        setErrorMessage(MESSAGES.INVALID_CREDENTIALS)
        return
      }
      setSuccessMessage(MESSAGES.SUCCESS_ADD_PRODUCT, resetForm)
    }
  } catch (e) {
    console.error(e)
    setErrorMessage(MESSAGES.INVALID_CREDENTIALS)
  }
})

// Gestion des messages d'erreurs

const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

let reset = () => {}

function setSuccessMessage(message: string, resetForm: () => void) {
  errorMessage.value = null
  successMessage.value = message
  if (resetForm) reset = resetForm
}

function setErrorMessage(message: string) {
  successMessage.value = null
  errorMessage.value = message
}

function closeAlert() {
  successMessage.value = null
  errorMessage.value = null
}

function handleResetForm() {
  closeAlert()
  reset()
}

// Delete image

const deleteImage = async (productId: number, imageId: number) => {
  try {
    await productAdminStore.deleteProductImage(productId, imageId)
    stateProduct.pictures = stateProduct.pictures.filter((image) => image.id !== imageId)
  } catch (e) {
    console.error(e)
  }
}

const field = computed(() => [
  {
    label: 'Titre',
    type: 'text',
    name: 'title',
    value: title,
    placeholder: 'Titre',
    errorMessage: errorTitle, // ← .value
  },
  {
    label: 'Description',
    type: 'textarea',
    name: 'description',
    value: description,
    placeholder: 'Description',
    errorMessage: errorDescription, // ← .value
  },
  {
    label: 'Image',
    type: 'file',
    name: 'image',
    value: images,
    errorMessage: errorImage, // ← .value
  },
])
</script>

<template>
  <main class="product">
    <section class="product__container">
      <h3>{{ route.params.id ? 'Modifier le produit' : 'Ajouter un produit' }}</h3>
      <!-- Image du product -->
      <div class="upload-row" v-if="stateProduct.pictures.length && route.params.id">
        <div
          v-for="picture in stateProduct.pictures"
          :key="picture.id"
          class="upload-thumb-wrapper"
        >
          <img v-if="picture.filename" :src="picture.filename" class="img-thumb" />
          <button @click="deleteImage(stateProduct.id, picture.id)" class="btn-thumb-delete">
            ×
          </button>
        </div>
        <div class="upload-info">
          <p>Image actuelle</p>
          <span>{{ route.params.id ? "Changer l'image ci-dessous" : '' }}</span>
        </div>
      </div>
      <!-- Form Add Product -->
      <form @submit.prevent="onSubmit" class="product__form">
        <!-- Champs normaux -->
        <div v-for="(f, index) in field" :key="index">
          <div class="form-group">
            <input
              v-if="f.type === 'text'"
              v-model="f.value.value"
              :type="f.type"
              :name="f.name"
              :placeholder="f.placeholder"
            />
            <input
              v-if="f.type === 'file'"
              :type="f.type"
              :name="f.name"
              @change="changeMultipleFiles($event)"
              multiple
            />
            <textarea
              v-if="f.type === 'textarea'"
              v-model="f.value.value"
              :placeholder="f.placeholder"
            ></textarea>

            <div v-if="f.errorMessage" class="error-field">{{ f.errorMessage.value }}</div>
          </div>
        </div>

        <!-- Options séparées -->
        <div class="form-group">
          <div v-for="(f, index) in fields" :key="f.key" class="product__option">
            <div class="product__option__fields">
              <div class="field">
                <Field :name="`productOption[${index}].name`" />
                <ErrorMessage :name="`productOption[${index}].name`" class="error-field" />
              </div>
              <div class="field">
                <Field :name="`productOption[${index}].price`" />
                <ErrorMessage :name="`productOption[${index}].price`" class="error-field" />
              </div>
            </div>
          </div>
        </div>

        <div class="product__alert">
          <AlertMessage
            v-if="successMessage"
            :message="successMessage"
            type="success"
            :redirectTo="route.params.id ? '' : '/product-list'"
            @close="handleResetForm()"
            class="product__alert__message"
          />

          <AlertMessage
            v-if="errorMessage"
            :message="errorMessage"
            type="error"
            redirectTo=""
            @close="closeAlert()"
            class="product__alert__message"
          />
        </div>

        <div class="product__button">
          <button :disabled="isSubmitting" class="btn btn-submit">
            <span v-if="isSubmitting">Chargement...</span>
            <span v-else>Soumettre</span>
          </button>
        </div>
      </form>
    </section>
  </main>
</template>

<style scoped lang="scss">
// PRODUCT

.product {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-direction: column;
  gap: 25px;
  &__container {
    z-index: 1;
    background: #fff;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.12);
    border: 1px solid #eee;
    width: 100%;
    max-width: 460px;
    padding: 32px 30px 20px 30px;
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
    display: flex;
    flex-direction: column;
    margin-top: 15px;
  }
  .form-group label {
    font-size: 14px;
    color: #333;
    margin-bottom: 5px;
  }
  .form-group input {
    width: 100%;
    padding: 11px 10px;
    border-radius: 6px;
    border: 1px solid #ddd;
    transition: 0.2s;
    font-size: 14px;
    outline: none;
  }
  .form-group textarea {
    width: 100%;
    padding: 11px 10px;
    border-radius: 6px;
    border: 1px solid #ddd;
    transition: 0.2s;
    font-size: 11px;
    outline: none;
    height: 100px;
  }
  .form-group input,
  textarea::placeholder {
    font-size: 12px;
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
  &__option {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
  }
  &__option__fields {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  &__alert {
    text-align: center;
  }
  &__alert__message {
    font-size: 13px;
    margin-bottom: 10px;
  }
  &__button {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .btn-submit {
    padding: 12px 15px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    background: black;
    color: white;
    font-size: 11px;
  }
}

/* ===== RESPONSIVE ===== */

@media (max-width: 1600px) {
  .product {
    padding: 40px 20px;
    gap: 20px;
  }
}

@media (max-width: 1024px) {
  .product {
    padding: 40px 20px;
    gap: 20px;
    height: 100%;
  }
}

@media (max-width: 767.98px) {
  .product {
    padding: 30px 15px;
    gap: 15px;
    &__container {
      max-width: 100%;
      padding: 24px 20px;
      border-radius: 8px;
    }
    &__container h3 {
      font-size: 15px;
    }

    .form-group {
      margin-top: 10px;
    }

    &__option {
      margin-bottom: 10px;
    }
    &__option__fields {
      gap: 5px;
    }
    .form-group label {
      font-size: 13px;
    }
    .form-group textarea {
      font-size: 11px;
    }
    .form-group input {
      padding: 10px 12px;
      font-size: 11px;
    }
    &__alert__message {
      font-size: 11px;
      margin-bottom: 10px;
    }
    .btn-submit {
      padding: 10px;
      font-size: 10px;
    }
  }
}

.upload-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 8px;
  @media (max-width: 767.98px) {
    gap: 9px;
  }
}

.upload-thumb-wrapper {
  position: relative;
  flex-shrink: 0;
}

.img-thumb {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid #ddd;
  display: block;
  @media (max-width: 767.98px) {
    width: 47px;
    height: 47px;
  }
}

.btn-thumb-delete {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #e63946;
  color: white;
  font-size: 12px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.upload-info {
  flex: 1;
  p {
    margin: 0;
    font-size: 13px;
    color: #333;
  }
  span {
    font-size: 11px;
    color: #999;
  }
}
</style>
