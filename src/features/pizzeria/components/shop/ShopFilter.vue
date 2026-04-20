<script setup lang="ts">
import { useProductStore } from '@/stores/productStore.ts'

const productStore = useProductStore()

/* SEARCH TERM */

const inputSearchTerm = async () => {
  try {
    const term = productStore.searchTerm
    await productStore.searchProducts(term)
  } catch (e) {
    console.error(e)
  }
}

/* AFFICHER LES PRIX */

const displayPriceRange = (priceRange: number[]) => {
  return priceRange[0] === 0
    ? 'Tous les produits'
    : priceRange[0] === 30
      ? 'Plus de 30'
      : `${priceRange[0]} et ${priceRange[1]}`
}

/* SÉLÉCTIONNER LE PRIX */

const selectedPriceRange = async (priceRange: number[]) => {
  try {
    await productStore.filteredPrice(priceRange)
  } catch (e) {
    console.error(e)
  }
}

/* SÉLÉCTIONNER LA CATÉGORIE */

const selectedCategory = async (category: string) => {
  try {
    productStore.initCategory = category
    await productStore.filteredCategory(category)
  } catch (e) {
    console.error(e)
  }
}

/* RÉINITIALISATION */

const selectedReinitialisation = () => {
  productStore.initFilteredProducts()
}
</script>

<template>
  <div class="d-flex flex-column space-between shop-filter">
    <div class="d-flex flex-column flex-fill">
      <!-- Filtration search -->
      <div class="d-flex flex-column shop-filter_search">
        <h4>Rechercher</h4>
        <input
          @input="inputSearchTerm()"
          v-model="productStore.searchTerm"
          type="text"
          placeholder="Rechercher"
        />
      </div>
      <!-- Filtrer par prix -->
      <div class="d-flex flex-column shop-filter_price">
        <h4>Filtrer par prix</h4>
        <div
          v-for="(priceRange, index) in productStore.priceRange"
          @click="selectedPriceRange(priceRange)"
          class="price-range"
          :key="index"
        >
          <input
            v-model="productStore.initPriceRange"
            :value="priceRange"
            type="radio"
            name="priceRange"
          />
          <span>{{ displayPriceRange(priceRange) }}</span>
        </div>
      </div>
      <!-- Filtrer par catégories -->
      <div class="d-flex flex-column shop-filter_category">
        <h4>Filtrer par catégories</h4>
        <p
          v-for="(category, index) in productStore.category"
          @click="selectedCategory(category)"
          :key="index"
        >
          <span
            class="category"
            :class="{ active: productStore.initCategory.includes(category) }"
          >
            {{ category }}
          </span>
        </p>
      </div>
    </div>
    <!-- Réinitialisation -->
    <div class="d-flex flex-column shop-filter_reinitialisation">
      <p class="nbr-products">
        Nombre de produits: <span>{{ productStore.nbrProducts }}</span>
      </p>
      <button @click="selectedReinitialisation()" class="btn btn-danger">Réinitialser</button>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
