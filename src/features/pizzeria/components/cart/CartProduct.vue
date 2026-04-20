<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore.ts'
import type { CartProductInterface } from '@/shared/interfaces'
import notFound from '@/assets/images/not-found.webp'
import router from '@/router'
import { useAuthStore } from '@/stores/authStore.ts'

defineProps<{
  item: CartProductInterface
}>()

const authStore = useAuthStore()
const cartStore = useCartStore()

/* Ajouter un article depuis le panier */

async function addItemToCart(id: number) {
  try {
    await cartStore.addItemToCart(id)
  } catch (e) {
    console.error(e)
  }
}

/* Retirer un article depuis le panier */

async function deleteItemToCart(id: number) {
  try {
    await cartStore.deleteItemToCart(id)
  } catch (e) {
    console.error(e)
  }
}

const redirectCommand = () => {
  if (!authStore.isLoggedIn) {
    router.push({ path: '/login' })
    return
  }
  router.push({ path: '/command-address' })
}
</script>

<template>
  <section class="cart-page">
    <div class="cart-page__container">
      <div class="cart-page__heading">
        <span class="cart-page__subtitle">VOTRE COMMANDE</span>
        <h1>Panier</h1>
        <div class="cart-page__line"></div>
      </div>

      <div v-if="cartStore.cart.length > 0" class="cart-layout">
        <div class="cart-list">
          <div v-for="item in cartStore.cart" :key="`${item.id}-${item.name}`" class="cart-product">
            <div class="cart-product__left">
              <div class="cart-product__image">
                <img :src="item.image || notFound" class="img-cart" alt="" />
              </div>

              <div class="cart-product__infos">
                <h4>{{ item.title }}</h4>
                <p class="option-name">({{ item.name }})</p>
                <p class="unit-price">{{ item.price }} €</p>
              </div>
            </div>

            <div class="cart-product__right">
              <div class="cart-product__quantity">
                <font-awesome-icon
                  @click="deleteItemToCart(item.id)"
                  icon="fa-solid fa-minus"
                  class="qty-btn"
                />
                <p class="quantity">{{ item.quantity }}</p>
                <font-awesome-icon
                  @click="addItemToCart(item.id)"
                  icon="fa-solid fa-plus"
                  class="qty-btn"
                />
              </div>

              <div class="cart-product__total">{{ item.price * item.quantity }} €</div>
            </div>
          </div>
        </div>

        <aside class="cart-summary">
          <h2>Total du panier</h2>

          <div class="cart-summary__row">
            <span>Sous-total</span>
            <strong>{{ cartStore.total }} €</strong>
          </div>

          <div class="cart-summary__row cart-summary__row--total">
            <span>Total</span>
            <strong>{{ cartStore.total }} €</strong>
          </div>

          <button class="cart-summary__checkout" @click="redirectCommand()">
            Procéder au paiement
          </button>
        </aside>
      </div>

      <div v-else class="cart-empty">
        <p>🛒 Votre panier est vide</p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.cart-page {
  background: #fafafa;
  min-height: calc(100vh - 80px);
  padding: 120px 20px 80px;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
  }

  &__heading {
    text-align: center;
    margin-bottom: 50px;
  }

  &__subtitle {
    display: inline-block;
    margin-bottom: 10px;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #df2f2f;
  }

  h1 {
    margin: 0;
    font-size: clamp(2.4rem, 5vw, 4rem);
    color: #2c2c2c;
    text-transform: uppercase;
  }

  &__line {
    width: 70px;
    height: 4px;
    margin: 14px auto 0;
    border-radius: 999px;
    background: #df2f2f;
  }
}

.cart-layout {
  display: grid;
  grid-template-columns: 1.7fr 0.9fr;
  gap: 30px;
  align-items: start;
}

.cart-list {
  background: #fff;
  border-radius: 14px;
  padding: 10px 24px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.06);
}

.cart-product {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  padding: 22px 0;
  border-bottom: 1px solid #ece7df;

  &:last-child {
    border-bottom: none;
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 18px;
    min-width: 0;
  }

  &__image {
    flex-shrink: 0;

    .img-cart {
      width: 95px;
      height: 95px;
      object-fit: cover;
      border-radius: 12px;
      display: block;
    }
  }

  &__infos {
    h4 {
      margin: 0 0 8px;
      font-size: 1.15rem;
      color: #2c2c2c;
    }

    .option-name {
      margin: 0 0 8px;
      color: #7d7d7d;
      font-size: 0.92rem;
    }

    .unit-price {
      margin: 0;
      color: #df2f2f;
      font-weight: 700;
      font-size: 0.98rem;
    }
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 24px;
    flex-shrink: 0;
  }

  &__quantity {
    display: flex;
    align-items: center;
    gap: 14px;
    background: #f8f5f0;
    border-radius: 999px;
    padding: 10px 14px;
  }

  &__total {
    min-width: 80px;
    text-align: right;
    font-size: 1rem;
    font-weight: 700;
    color: #2c2c2c;
  }
}

.qty-btn {
  cursor: pointer;
  color: #df2f2f;
  font-size: 0.9rem;
  transition:
    transform 0.2s ease,
    color 0.2s ease;

  &:hover {
    transform: scale(1.08);
    color: #b91f2f;
  }
}

.quantity {
  margin: 0;
  min-width: 18px;
  text-align: center;
  font-weight: 700;
  color: #2c2c2c;
}

.cart-summary {
  background: #fff;
  border-radius: 14px;
  padding: 28px 24px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 110px;

  h2 {
    margin: 0 0 24px;
    font-size: 1.4rem;
    color: #2c2c2c;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 0;
    border-bottom: 1px solid #ece7df;
    color: #555;

    strong {
      color: #2c2c2c;
    }

    &--total {
      font-size: 1.05rem;
      font-weight: 700;

      strong {
        color: #df2f2f;
      }
    }
  }

  &__checkout {
    width: 100%;
    margin-top: 24px;
    border: none;
    border-radius: 999px;
    background: #df2f2f;
    color: #fff;
    padding: 14px 18px;
    font-weight: 700;
    cursor: pointer;
    transition:
      transform 0.2s ease,
      background 0.2s ease;

    &:hover {
      background: #c62828;
      transform: translateY(-2px);
    }
  }
}

.cart-empty {
  background: #fff;
  border-radius: 14px;
  padding: 40px 20px;
  text-align: center;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.06);

  p {
    margin: 0;
    color: #777;
    font-size: 1rem;
  }
}

@media (max-width: 992px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
  }
}

@media (max-width: 640px) {
  .cart-page {
    padding: 100px 16px 60px;
  }

  .cart-product {
    flex-direction: column;
    align-items: stretch;

    &__left {
      align-items: center;
    }

    &__right {
      justify-content: space-between;
      width: 100%;
    }

    &__image .img-cart {
      width: 80px;
      height: 80px;
    }

    &__infos h4 {
      font-size: 1rem;
    }
  }
}
</style>
