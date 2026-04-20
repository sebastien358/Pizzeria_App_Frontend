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

// Redirection Payment

const redirectCommand = () => {
  if (!authStore.isLoggedIn) {
    router.push({ path: '/login' })
    return
  }
  router.push({ path: '/command-address' })
}

// Redirection Cart

const redirectCart = () => {
  router.push({ path: '/cart' })
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
          <router-link v-if="!isLoggedIn()" to="/register" class="nav__link"
            >Inscription</router-link
          >

          <!-- Profil User ou Admin -->
          <router-link
            v-if="isUser()"
            to="/profile"
            class="nav__link"
            :class="{ 'no-admin': isAdmin() }"
            >Espace client</router-link
          >

          <div
            v-if="isAdmin()"
            class="dropdown"
            @mouseenter="openDropdown('pro')"
            @mouseleave="closeDropdown()"
          >
            <a href="#" class="nav__link">Espace pro</a>
            <div class="dropdown__menu" :class="{ 'active-pro': state.activeDropdown === 'pro' }">
              <router-link to="/product-list" class="dropdown--link">Liste des pizzas</router-link>
              <router-link to="/command/list" class="dropdown--link"
                >Liste des commandes</router-link
              >
              <router-link to="/product-form" class="dropdown--link"
                >Ajouter un produit</router-link
              >
              <router-link
                v-if="isLoggedIn()"
                @click="logout()"
                to="/logout"
                class="dropdown--link logout"
                >Déconnexion</router-link
              >
            </div>
          </div>
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
            <div v-if="!cartStore.cart.length" class="empty-cart">
              <p>Le panier est vide</p>
            </div>

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
              <button @click="redirectCart()" class="btn btn-cart">Voir le panier</button>
              <button @click="redirectCommand()" class="btn btn-payment">Paiement</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </header>
  <Calc :open="state.open" @close="state.open = false" :transparent="true" />
</template>

<style scoped lang="scss">
/*====================
  HEADER
====================*/

.dropdown {
  z-index: 10;
  position: relative;
  &__menu {
    opacity: 0;
    pointer-events: none;
    position: absolute;
    top: 60px;
    right: 50%;
    transform: translate(50%);
    padding: 30px;
    transition: all 200ms ease;
    border-radius: 10px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: auto;
  }
  &__menu.active-pro {
    pointer-events: auto;
    opacity: 1;
  }
  &__menu .dropdown--link {
    text-transform: lowercase;
    font-size: 14px;
    white-space: nowrap;
  }
  &__menu .logout:hover {
    color: #e63946;
  }
}

.no-admin {
  display: none;
}

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
    padding: 3px 0;
    border-bottom: 2px solid #e63946;
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

/*====================
  PANIER
====================*/

.header__menu {
  position: absolute;
  top: 42px;
  right: 0;
  width: 320px;
  padding: 16px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 16px;
  opacity: 0;
  pointer-events: none;
  &.show {
    pointer-events: auto;
    opacity: 1;
  }
}

.empty-cart {
  text-align: center;
  font-size: 0.9rem;
  color: #777;
  padding: 10px 0;
}

/* LISTE DES PRODUITS */
.header__menu__list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

/* CONTENU GAUCHE */
.header__menu__content {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* IMAGE */
.img-cart {
  width: 45px;
  height: 45px;
  object-fit: cover;
  border-radius: 6px;
}

/* TEXTE */
.header__menu__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* PRIX */
.product-price {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c2c2c;
}

/* QUANTITÉ */
.product-quantity {
  color: #888;
  font-weight: 400;
  margin-left: 4px;
}

/* TITRE */
.product-title {
  font-size: 0.85rem;
  color: #666;
}

/* DELETE */
.header__menu__delete {
  cursor: pointer;
  color: #e63946;
  transition: transform 0.2s ease;
}

.header__menu__delete:hover {
  transform: scale(1.1);
}

/* SÉPARATEUR */
.separator {
  height: 1px;
  background: #eee;
}

/* TOTAL */
.header__menu__total {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
}

/* BOUTONS */
.header__menu__buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-cart {
  border: 1px solid #ddd;
  background: #fff;
  color: #2c2c2c;

  padding: 8px;
  cursor: pointer;
  border-radius: 6px;

  transition: all 200ms ease;

  &:hover {
    background: #f5f5f5;
    border-color: #ccc;
  }
}

.btn-payment {
  background: #e63946;
  color: #fff;
  border: none;

  padding: 8px;
  cursor: pointer;
  border-radius: 6px;

  transition: all 200ms ease;

  &:hover {
    background: #d62839; /* 🔥 rouge plus profond */
  }
}
</style>
