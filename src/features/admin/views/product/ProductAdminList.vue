<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useProductAdminStore } from '@/stores/admin/productAdminStore.ts'
import notFound from '@/assets/images/not-found.webp'
import Pagination from '@/templates/pagination/Pagination.vue'
import DeleteConfirmModal from '@/templates/confirm-modal/DeleteConfirmModal.vue'
import InputSearch from '@/templates/input-search/InputSearch.vue'

const placeholder = ref<string>('Rechercher une pizza...')

// PRODUCTS

const productAdminStore = useProductAdminStore()

const products = computed(() => productAdminStore.product)

const loadAdminProduct = async () => {
  try {
    await productAdminStore.getAdminProducts()
  } catch (e) {
    console.error(e)
  }
}

const previousPage = async () => {
  if (productAdminStore.currentPage > 1) {
    productAdminStore.currentPage--
  }
  try {
    await productAdminStore.getAdminProducts()
  } catch (e) {
    console.error(e)
  }
}

const nextPage = async () => {
  productAdminStore.currentPage++
  try {
    await productAdminStore.getAdminProducts()
  } catch (e) {
    console.error(e)
  }
}

// MODAL

const open = ref<boolean>(false)
const productId = ref<number | null>(null)

const toggleModal = (id: number) => {
  open.value = true
  productId.value = id
}

const closeModal = () => {
  open.value = false
}

// DELETE PRODUCT

const deleteProduct = async (id: number) => {
  await productAdminStore.deleteProduct(id)
  await productAdminStore.getAdminProducts()

  if (productAdminStore.product.length === 0 && productAdminStore.currentPage > 1) {
    productAdminStore.currentPage--
  }
}

watch(
  () => productAdminStore.term,
  (term) => {
    if (term === null || term === undefined) return
    productAdminStore.productSearch(term)
  },
  { immediate: true },
)

// Load products

onMounted(async () => {
  await loadAdminProduct()
})
</script>

<template>
  <DeleteConfirmModal
    :open="open"
    :id="productId"
    @close="closeModal()"
    text="product-admin"
    @delete="deleteProduct"
  />
  <!-- loading -->
  <section v-if="productAdminStore.isLoading" class="spinner">
    <span class="loader"></span>
  </section>
  <!-- Product -->
  <section v-else-if="products.length > 0" class="product">
    <div class="product-search">
      <!-- Input Search -->
      <InputSearch :term="productAdminStore.term" @update:term="productAdminStore.term = $event" :total="productAdminStore.total" :placeholder="placeholder" />
    </div>
    <div v-for="product in products" :key="product.id" class="product__list">
      <div class="product__content">
        <img :src="product.pictures[0]?.filename || notFound" class="img-product" />
        <h4>{{ product.title }}</h4>
      </div>

      <div class="product__buttons">
        <router-link
          :to="{ name: 'product-edit', params: { id: product.id } }"
          class="btn btn-success"
        >
          Modifier
        </router-link>
        <button @click="toggleModal(product.id)" class="btn btn-danger">Supprimer</button>
      </div>
    </div>
    <!-- Pagination -->
    <Pagination
      v-if="productAdminStore.pages > 1"
      :currentPage="productAdminStore.currentPage"
      :pages="productAdminStore.pages"
      @previous-page="previousPage()"
      @next-Page="nextPage()"
    />
  </section>
  <!-- Aucun produit -->
  <section v-else class="no-product">
    <p>Aucune pizza pour le moment.</p>
  </section>
</template>

<style scoped lang="scss">
//Spinner

.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  .loader {
    width: 35px;
    height: 35px;
    border: 5px solid black;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    @media (max-width: 767.98px) {
      width: 30px;
      height: 30px;
    }
  }
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

// Product Search

.product-search {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  width: 100%;
  @media (max-width: 768.98px) {
    margin-bottom: 15px;
  };
}

// Products

.product {
  width: 100%;
  padding: 30px 20px 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100%;
  .product__list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 14px;
    background: #fff;
    border: 1px solid #e7e3dc;
    border-radius: 10px;
    transition:
      box-shadow 0.2s ease,
      transform 0.2s ease,
      border-color 0.2s ease;
  }
  &__list:hover {
    border-color: #ddd6cc;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  }
  &__content {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }
  .img-product {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;
  }
  &__content h4 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: #2c2c2c;
    line-height: 1.3;
  }
  &__buttons {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  &__buttons .btn-success,
  &__buttons .btn-danger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 88px;
    height: 36px;
    padding: 14px;
    border: none;
    border-radius: 6px;
    text-decoration: none;
    font-size: 11px;
    cursor: pointer;
    transition:
      background 0.2s ease,
      color 0.2s ease,
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }
  &__buttons .btn-success {
    background: #f3f3f3;
    color: #2c2c2c;
  }
  &__buttons .btn-success:hover {
    background: #e8e8e8;
    transform: translateY(-1px);
  }
  &__buttons .btn-danger {
    background: #df2f2f;
    color: #fff;
  }
  &__buttons .btn-danger:hover {
    background: #c62828;
    transform: translateY(-1px);
  }
}

.product :deep(.pagination) {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}

@media (max-width: 1600px) {
  .product {
    padding: 40px 16px;
    gap: 12px;
    .product__list {
      padding: 10px;
      gap: 15px;
    }
  }
}

@media (max-width: 768.98px) {
  .product {
    padding: 30px 15px;
    gap: 10px;
    &__list {
      padding: 10px;
      gap: 15px;
    }
    .img-product {
      width: 60px;
      height: 60px;
    }
    &__content h4 {
      font-size: 13px;
    }
    &__buttons {
      gap: 6px;
    }
    &__buttons .btn-success,
    &__buttons .btn-danger {
      min-width: 72px;
      height: 32px;
      padding: 0 10px;
      font-size: 11px;
    }
  }

  .product :deep(.pagination) {
    margin-top: 5px;
  }
}

@media (max-width: 560px) {
  .product {
    &__list {
      flex-direction: column;
      align-items: stretch;
    }

    &__content {
      width: 100%;
    }

    &__buttons {
      width: 100%;
      justify-content: flex-end;
    }

    &__buttons .btn-success,
    &__buttons .btn-danger {
      min-width: 72px;
      height: 32px;
      padding: 0 10px;
      font-size: 9px;
    }
  }
}

/* NO PRODUCT */

.no-product {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100dvh - 80px);
  p {
    font-size: 15px;
    @media (max-width: 991.98px) {
      font-size: 14px;
    }
    @media (max-width: 767.98px) {
      font-size: 13px;
    }
  }
}
</style>
