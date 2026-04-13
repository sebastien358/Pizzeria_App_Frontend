<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useProductAdminStore } from '@/stores/admin/productAdminStore.ts'
import { useForm, useField, useFieldArray, Field } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useRoute } from 'vue-router'

const productAdminStore = useProductAdminStore()

// Récupération des catégories

const route = useRoute()

type Pictures = {
  id: number
  filename: string
}

type Product = {
  id: number
  pictures: Pictures[]
}

const stateProduct = reactive<Product>({
  id: 0,
  pictures: [],
})

// Initialisation des valeurs

const initialValues = {
  id: 0,
  title: '',
  description: '',
  price: 0,
  category: {
    id: 0,
    name: '',
  },
}

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    if (!id) return

    const product = await productAdminStore.currentProduct(id)
    if (!product) return

    Object.assign(stateProduct, {
      ...product,
    })

    setValues({
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category.id,
    })
  } catch (e) {
    console.error(e)
  }
})

// Création Form

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 Mo

const schema = z.object({
  title: z.string({ message: 'Le prénom est requis' }),
  description: z.string({ message: 'Veuillez renseigner une description' }),
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
  productOption: z
    .array(
      z.object({
        name: z.string({ message: 'Le nom est requis' }),
        price: z.coerce.number({ message: 'Le prix est requis' }),
      }),
    )
    .min(1, { message: 'Au moins une option est requise' }),
})

const { handleSubmit, isSubmitting, setValues } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues,
})

const { value: title, errorMessage: errorTitle } = useField<string>('title')
const { value: description, errorMessage: errorDescription } = useField<string>('description')
const { value: images, errorMessage: errorImage, setValue } = useField<string>('images')
const { fields, push, remove } = useFieldArray('productOption')

// Initialiser avec les 3 tailles par défaut

onMounted(() => {
  push({ name: 'Petite', price: '' })
  push({ name: 'Moyenne', price: '' })
  push({ name: 'Grande', price: '' })
})

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
    if (route.params.id) {
      const response = await productAdminStore.editProduct(dataProduct, route.params.id)
      if (!response) {
        setErrorMessage(MESSAGES.INVALID_CREDENTIALS)
        return
      }
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
  reset = resetForm
}

function setErrorMessage(message: string) {
  successMessage.value = null
  errorMessage.value = message
}

function closeFields() {
  successMessage.value = null
  errorMessage.value = null
}

function handleResetForm() {
  closeFields()
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

const field = [
  {
    label: 'Titre',
    type: 'text',
    name: 'title',
    value: title,
    placeholder: 'Titre',
    errorMessage: errorTitle,
  },
  {
    label: 'Description',
    type: 'textarea',
    name: 'description',
    value: description,
    placeholder: 'Description',
    errorMessage: errorDescription,
  },
  {
    label: 'Image',
    type: 'file',
    name: 'image',
    value: images,
    errorMessage: errorImage,
  },
]
</script>

<template>
  <main class="container">
    <section class="container-form">
      <h3>Ajouter un produit</h3>
      <!-- Form Add Product -->
      <form @submit.prevent="onSubmit" class="product-form">
        <!-- Champs normaux -->
        <div v-for="(fiel, index) in field" :key="index">
          <div class="d-flex flex-column form-group">
            <input
              v-if="fiel.type === 'text'"
              v-model="fiel.value.value"
              :type="fiel.type"
              :name="fiel.name"
              :placeholder="fiel.placeholder"
            />
            <input
              v-if="fiel.type === 'file'"
              v-model="fiel.value.value"
              :type="fiel.type"
              :name="fiel.name"
              @change="changeMultipleFiles($event)"
              multiple
            />
            <textarea
              v-if="fiel.type === 'textarea'"
              v-model="fiel.value.value"
              :placeholder="fiel.placeholder"
            ></textarea>
          </div>
          <!-- Champs Erreurs -->
          <span v-if="fiel.errorMessage" class="error-field">
            {{ fiel.errorMessage.value }}
          </span>
        </div>
        <!-- Options séparées -->
        <div class="form-group">
          <div v-for="(f, index) in fields" :key="f.key" class="option">
            <Field :name="`productOption[${index}].name`" placeholder="Taille" class="name" />
            <Field :name="`productOption[${index}].price`" type="number" placeholder="Prix" />
          </div>
        </div>

        <button :disabled="isSubmitting" class="btn btn-black">
          <span v-if="isSubmitting">Chargement...</span>
          <span v-else>Ajout produit</span>
        </button>
      </form>
    </section>

    <section class="product-image" v-if="stateProduct">
      <div v-for="picture in stateProduct.pictures" :key="picture.id">
        <img v-if="picture.filename" :src="picture.filename" class="img-product" />
        <img v-else src="@/assets/images/not-found.webp" class="img-product" />
        <div class="product-image__button">
          <button @click="deleteImage(stateProduct.id, picture.id)" class="btn btn-danger">
            delete
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  height: calc(100vh - 96px);
  @media (max-width: 768.98px) {
    padding: 10px;
  }
  .container-form {
    width: 100%;
    max-width: 600px;
    padding: 30px 20px 15px 20px;
    h3 {
      text-align: center;
      font-size: 22px;
      margin-bottom: 5px;
    }
    .alert-message {
      margin-top: 10px;
      text-align: center;
    }
  }
}

.form-group {
  margin-top: 20px;
  width: 100%;
  .option {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin-bottom: 10px;
    gap: 10px;
  }
  textarea {
    height: 100px;
  }
  input,
  select,
  textarea {
    border: 1px solid black;
    padding: 12px;
    outline: none;
    background-color: var(--text-primary-color);
    &:focus {
      border: 2px solid black;
      padding: 11px;
    }
  }
  &:focus-within label {
    background-color: black;
    color: var(--text-primary-color);
  }
  .message-field {
    color: var(--success-2);
  }
}

.product-form__button {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  @media (max-width: 768.98px) {
    justify-content: center;
  }
  .btn-black {
    font-size: 14px;
    @media (max-width: 768.98px) {
      font-size: 12px;
    }
  }
}

// Product image

.product-image {
  .img-product {
    height: 200px;
  }
  &__button {
    margin-top: 5px;
    display: flex;
    justify-content: center;
  }
}
</style>
