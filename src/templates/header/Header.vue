<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore.ts'
import { useRouter } from 'vue-router'
import { onMounted, reactive } from 'vue'
import Calc from '@/templates/calc/Calc.vue'
import { useCartStore } from '@/stores/cartStore.ts'
import notFound from '@/assets/images/not-found.webp'

const authStore = useAuthStore()

const router = useRouter()

// Menu déroulant

const state = reactive<{
  activeDropdown: string | null
  open: boolean
}>({
  activeDropdown: null,
  open: false,
})

let timeout = null

const openDropdown = (type: string) => {
  if (timeout) clearTimeout(timeout)
  state.activeDropdown = type
}

const closeDropdown = () => {
  timeout = setTimeout(() => {
    state.activeDropdown = null
  }, 150)
}

// Gestion de connexion

const isLoggedIn = () => {
  return authStore.isLoggedIn
}

// Gestion des roles

const isAdmin = () => {
  return authStore.isAdmin
}

const isUser = () => {
  return authStore.isUser
}

// Déconnexion

const logout = () => {
  authStore.logout()
  router.push({ path: '/login' })
}

// Récupération de l'ID utlisateur, puis redirection et modification des données

onMounted(async () => {
  try {
    await authStore.infoMe()
  } catch (e) {
    console.error(e)
  }
})

const cartStore = useCartStore()

// Suppression d'un produit dans le panier

const removeItemToCart = async (id: number) => {
  try {
    await cartStore.removeItemToCart(id)
  } catch (e) {
    console.error(e)
  }
}

// Redirection paiement

const redirectPayment = () => {
  if (!authStore.isLoggedIn) {
    router.push({ path: '/login' })
    return
  }
  router.push({ path: '/payment' })
}
</script>

<template>
  <header class="header">
    <div class="header__container">
      <!-- LOGO -->
      <router-link to="/" class="header__logo">
        <div class="header__icon">
          <span class="icon-pizza">🍕</span>
        </div>

        <!-- TEXT -->
        <div class="header__text">
          <div class="logo-title">Pizzeria</div>
          <div class="logo-subtitle">Commande en ligne</div>
        </div>
      </router-link>

      <!-- NAV -->
      <section class="header__right">
        <nav class="header__nav">
          <router-link to="/" class="nav__link">Accueil</router-link>
          <router-link to="/menu" class="nav__link">La carte</router-link>
          <router-link to="/contact" class="nav__link">Contact</router-link>
          <router-link v-if="!isLoggedIn()" to="/login" class="nav__link">Connexion</router-link>
          <router-link v-else @click="logout()" to="/logout" class="nav__link">Déconnexion</router-link>
          <!-- Profil User ou Admin -->
          <router-link v-if="isUser()" to="/profile" class="nav__link">Espace client</router-link>
          <router-link v-if="isAdmin()" to="/admin" class="nav__link">Espace pro</router-link>
        </nav>

        <!-- PANIER -->
        <div class="header__cart" @mouseenter="openDropdown('menu')" @mouseleave="closeDropdown()">
          <div class="cart">
            <!-- SVG PROPRE -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.44C7.52 17.37 8.48 19 10 19h9v-2h-9l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03L23 6H6.21l-.94-2z"
              />
            </svg>

            <!-- BADGE -->
            <span class="cart-badge">{{ cartStore.cart.length }}</span>
          </div>

          <!-- MENU PANIER -->
          <div class="header__menu" :class="{ show: state.activeDropdown === 'menu' }">
            <div v-for="cart in cartStore.cart" :key="cart.id" class="header__menu__list">
              <div class="header__menu__content">
                <img :src="cart.image || notFound" class="img-cart" />
                <div class="header__menu__text">
                  <p class="product-price">
                    {{ cart.price }}€ <span class="product-quantity">x{{ cart.quantity }}</span>
                  </p>
                  <p class="product-title">{{ cart.title }}</p>
                </div>
              </div>
              <div class="header__menu__delete">
                <font-awesome-icon
                  @click="removeItemToCart(cart.id)"
                  icon="fa-solid fa-delete-left"
                />
              </div>
            </div>

            <div class="separator"></div>
            <div class="header__menu__total">
              <p>Total :</p>
              <p>
                <strong> {{ cartStore.total }} €</strong>
              </p>
            </div>
            <div class="header__menu__buttons">
              <button class="btn btn-cart">Voir le panier</button>
              <button @click="redirectPayment()" class="btn btn-paiment">Paiement</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </header>
  <Calc :open="state.open" @close="state.open = false" :transparent="true" />
</template>

<style scoped lang="scss">
.header {

  position: fixed;
  z-index: 2;

  width: 100%;
  padding: 20px 100px;
  background: #fff;
  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }
  &__logo {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    color: inherit;
  }
  &__icon .icon-pizza {
    height: 60px;
    width: 60px;
  }
  &__logo .logo-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  &__text {
    display: flex;
    flex-direction: column;
    line-height: 1.1;
  }
  &__text .logo-title {
    font-size: 24px;
    font-weight: 700;
    color: #1f1f1f;
  }
  &__text .logo-subtitle {
    font-size: 13px;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
}

.header__right {
  display: flex;
  align-items: center;
  gap: 28px;
}

.header__nav {
  display: flex;
  align-items: center;
  gap: 30px;
  .nav__link {
    text-decoration: none;
    font-size: 15px;
    transition: color 0.2s ease;
    font-weight: 600;
    text-transform: uppercase;
    color: #555;
  }
  .nav__link:hover,
  .nav__link.router-link-active {
    color: #e63946;
  }
}

@media (max-width: 900px) {
  .header {
    padding: 16px 20px;
  }
  .header__container {
    flex-direction: column;
    align-items: flex-start;
  }
  .header__nav {
    flex-wrap: wrap;
    gap: 16px;
  }
}

.header__cart {
  position: relative;
  .cart {
    position: relative;
    display: inline-block;
    color: #333;
  }
  .cart svg {
    width: 28px;
    height: 28px;
    cursor: pointer;
  }
  /* BADGE */
  .cart-badge {
    position: absolute;
    top: -4px;
    right: -8px;
    background: #e63946;
    color: white;
    font-size: 11px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.header__menu {
  z-index: 1;
  background: white;
  pointer-events: none; /* 🔥 bloque les events */
  position: absolute;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  padding: 20px;
  width: 400px;
  top: 50px;
  right: -23px;
  opacity: 0;
  transition: all 200ms ease;
  &.show {
    pointer-events: auto; /* 🔥 réactive quand visible */
    opacity: 1;
  }
  &__list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  &__content {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  &__delete .fa-delete-left {
    cursor: pointer;
    font-size: 18px;
    color: red;
  }
  &__content .img-cart {
    height: 60px;
    width: 60px;
  }
  &__text {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  &__text .product-title {
    font-size: 13px;
  }
  &__text .product-price {
    font-size: 15px;
    font-weight: 600;
  }
  &__text .product-quantity {
    margin-left: 5px;
  }
  .separator {
    border-top: 1px solid #cacaca;
    margin: 25px 0;
  }
  &__total {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  &__buttons {
    display: flex;
    flex-direction: column;
    gap: 15px;
    .btn {
      cursor: pointer;
      padding: 15px 0;
      outline: none;
      border: 1px solid black;
      background: none;
      color: black;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 12px;
    }
  }
}
</style>
