<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useProductAdminStore } from '@/stores/admin/productAdminStore.ts'

import notFound from '@/assets/images/not-found.webp'
import { ref } from 'vue'
import Pagination from '@/templates/pagination/Pagination.vue'

const productAdminStore = useProductAdminStore()

const products = computed(() => productAdminStore.product)

const currentPage = ref<number>(1)
const itemPerPage = ref<number>(15)

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
  <section v-if="products.length > 0" class="product">
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
        <button @click="deleteProduct(product.id)" class="btn btn-danger">Supprimer</button>
      </div>
    </div>

    <Pagination
      v-if="products.length > 15"
      :currentPage="currentPage"
      :pages="productAdminStore.pages"
      @previous-page="previousPage()"
      @next-Page="nextPage()"
    />
  </section>
</template>

<style scoped lang="scss">
.product {
  width: 100%;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

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

.product__list:hover {
  border-color: #ddd6cc;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}

.product__content {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.img-product {
  width: 68px;
  height: 56px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.product__content h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #2c2c2c;
  line-height: 1.3;
}

.product__buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.product__buttons .btn-success,
.product__buttons .btn-danger {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 88px;
  height: 36px;
  padding: 0 14px;

  border: none;
  border-radius: 8px;
  text-decoration: none;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.product__buttons .btn-success {
  background: #f3f3f3;
  color: #2c2c2c;
}

.product__buttons .btn-success:hover {
  background: #e8e8e8;
  transform: translateY(-1px);
}

.product__buttons .btn-danger {
  background: #df2f2f;
  color: #fff;
}

.product__buttons .btn-danger:hover {
  background: #c62828;
  transform: translateY(-1px);
}


.product :deep(.pagination) {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}


@media (max-width: 768.98px) {
  .product {
    padding: 90px 10px 40px;
    gap: 8px;
  }

  .product__list {
    padding: 10px;
    gap: 10px;
  }

  .img-product {
    width: 60px;
    height: 50px;
  }

  .product__content h4 {
    font-size: 13px;
  }

  .product__buttons {
    gap: 6px;
  }

  .product__buttons .btn-success,
  .product__buttons .btn-danger {
    min-width: 72px;
    height: 32px;
    padding: 0 10px;
    font-size: 11px;
  }
}


@media (max-width: 560px) {
  .product__list {
    flex-direction: column;
    align-items: stretch;
  }

  .product__content {
    width: 100%;
  }

  .product__buttons {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
