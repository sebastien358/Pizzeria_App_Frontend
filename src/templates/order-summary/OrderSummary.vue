<script setup lang="ts">
defineProps<{
  command: {
    lastName: string
    firstName: string
    address: string
    zipCode: string
    city: string
    deliveryType: string
    commandItems: {
      title: string,
      quantity: number
    }
  }
}>()
</script>

<template>
  <div class="order-summary" v-if="command">
    <h3 class="order-summary__title">Récapitulatif de votre commande</h3>
    <div class="order-summary__content">
      <!-- 👤 INFOS CLIENT -->
      <div class="order-summary__column">
        <div class="order-summary__client">
          <p class="order-summary__item">
            <span>Nom :</span>
            <span>{{ command.lastName }}</span>
          </p>
          <p class="order-summary__item">
            <span>Prénom :</span>
            <span>{{ command.firstName }}</span>
          </p>
          <p class="order-summary__item">
            <span>Adresse :</span>
            <span>{{ command.address }}</span>
          </p>
          <p class="order-summary__item">
            <span>Code postal :</span>
            <span>{{ command.zipCode }}</span>
          </p>
          <p class="order-summary__item">
            <span>Ville :</span>
            <span>{{ command.city }}</span>
          </p>
          <p class="order-summary__status">
            <strong>Statut : </strong>
            <strong>{{ command.deliveryType }}</strong>
          </p>
        </div>

        <!-- 🍕 ITEMS -->
        <div class="#">
          <div v-for="item in command.commandItems" :key="item.id" class="order-summary__items">
            <p class="order-summary__item">
              <span>Commande :</span>
              <span>{{ item.title }}</span>
            </p>
            <p class="order-summary__item">
              <span>Quantité :</span>
              <span>{{ item.quantity }}</span>
            </p>
            <p v-if="command.deliveryType === 'Livraison'" class="order-summary__item">
              <span>Livraison :</span>
              <span>+ 5€</span>
            </p>
          </div>
          <p class="order-summary__total">
            <span>Total :</span>
            <span>{{ command.total }}€</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// ORDER SUMMARY

.order-summary {
  padding: 1.5rem;
  border-radius: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  width: 100%;
  &__title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #111827;
    text-align: start;
  }
  &__content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  &__column {
    display: flex;
    flex-direction: column;
    gap: 28px;
  }
  &__status {
    padding: 3px 5px;
    border-radius: 6px;
    font-size: 0.8rem;
    background: #e0f2fe;
    color: #0369a1;
    display: inline-block;
    width: fit-content;
  }
  &__client {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-bottom: 0.6rem;
    border-bottom: 1px solid #e5e7eb;
  }
  &__items {
    display: flex;
    flex-direction: column;
    gap: 9px;
  }
  &__item {
    display: flex;
    justify-content: space-between;
    color: #374151;
    font-size: 14px;
  }
  &__item span:first-child {
    color: #6b7280;
  }
  &__divider {
    height: 1px;
    background: #e5e7eb;
    margin: 0.8rem 0;
  }
  &__total {
    display: flex;
    justify-content: space-between;
    font-weight: 600;
    color: #111827;
    margin-top: 10px;
  }
  &__total span {
    font-size: 15px;
  }
}

@media (max-width: 1600px) {
  .order-summary {
    &__title {
      text-align: center;
      font-size: 16px;
      margin-bottom: 25px;
    }
    &__column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: flex-start;
    }
  }
}

@media (max-width: 767.98px) {
  .order-summary {
    padding: 1.5rem;
    border-radius: 12px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    &__title {
      font-size: 15px;
      margin-bottom: 20px;
    }
    &__content {
      gap: 0.5rem;
    }
    &__column {
      display: grid;
      grid-template-columns: 1fr;
      align-items: center;
    }
    &__client {
      gap: 9px;
    }
    &__items {
      gap: 8px;
    }
    &__item {
      font-size: 13px;
    }
    &__divider {
      height: 1px;
      background: #e5e7eb;
      margin: 0.8rem 0;
    }
    &__total span {
      font-size: 14px;
    }
  }
}
</style>
