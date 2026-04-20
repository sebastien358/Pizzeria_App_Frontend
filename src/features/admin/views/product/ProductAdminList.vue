<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useProductAdminStore } from '@/stores/admin/productAdminStore.ts'
import Pagination from '../../../../templates/pagination/Pagination.vue'
import { ref } from 'vue'

const productAdminStore = useProductAdminStore()

const products = computed(() => productAdminStore.product)

const currentPage = ref<number>(1)
const itemPerPage = ref<number>(20)

const loadAdminProduct = async () => {
  try {
    await productAdminStore.getAdminProducts(currentPage.value, itemPerPage.value)
  } catch (e) {
    console.error(e)
  }
}

const previousPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
  try {
    await productAdminStore.getAdminProducts(currentPage.value, itemPerPage.value)
  } catch (e) {
    console.error(e)
  }
}

const nextPage = async () => {
  currentPage.value++
  try {
    await productAdminStore.getAdminProducts(currentPage.value, itemPerPage.value)
  } catch (e) {
    console.error(e)
  }
}

// Supression d'un produit

const deleteProduct = async (id: number) => {
  try {
    await productAdminStore.deleteProduct(id)
    await productAdminStore.getAdminProducts(currentPage.value, itemPerPage.value)

    if (productAdminStore.product.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }

    await loadAdminProduct()
  } catch (e) {
    console.error(e)
  }
}

onMounted(async () => {
  try {
    await loadAdminProduct()
  } catch (e) {
    console.error(e)
  }
})
</script>

<template>
  <div v-if="products.length && products.length > 0" class="product">
    <div v-for="product in products" :key="product.id">
      <div class="product__list">
        <div class="d-flex align-items-center">
          <img
            v-if="product.pictures && product.pictures.length > 0"
            :src="product.pictures[0].filename"
            class="img-product"
          />
          <h4>{{ product.title }}</h4>
        </div>
        <div class="product__buttons">
          <router-link
            :to="{ name: 'product-edit', params: { id: product.id } }"
            class="btn btn-success"
            >Modifier</router-link
          >
          <button @click="deleteProduct(product.id)" class="btn btn-danger">Supprimer</button>
        </div>
      </div>
    </div>
    <Pagination
      :currentPage="currentPage"
      :pages="productAdminStore.pages"
      @previous-page="previousPage()"
      @next-Page="nextPage()"
    />
  </div>
</template>

<style>
</style>
