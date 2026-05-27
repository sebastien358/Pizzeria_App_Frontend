<script setup lang="ts">
const props = defineProps<{
  open: boolean
  id: number | null
  text: string | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'delete', id: number | null): void
}>()

// Supression d'un produit

const deleteProduct = async () => {
  try {
    switch (props.text) {
      case 'product-admin':
      case 'contact-admin':
      case 'commands-user':
      case 'commands-admin':
        if (props.id !== null) {
          emit('delete', props.id)
        }
        emit('close')
        break
      case 'delete-account':
        emit('delete', null)
        emit('close')
        break
      default:
        emit('close')
        break
    }
  } catch (e) {
    console.error(e)
    throw e
  }
}
</script>

<template>
  <Teleport v-if="props.open" to="body">
    <section class="modal-overlay">
      <div class="modal">
        <div class="modal__icon">🗑️</div>
        <h2 class="modal__title">Confirmer la suppression</h2>
        <p class="modal__text">
          Cette action est irréversible. Voulez-vous vraiment supprimer cet élément ?
        </p>
        <div class="modal__actions">
          <button @click="emit('close')" class="modal__btn modal__btn--cancel">Annuler</button>
          <button @click="deleteProduct()" class="modal__btn modal__btn--confirm">Supprimer</button>
        </div>
      </div>
    </section>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: #faf9f7;
  border-radius: 12px;
  padding: 40px 32px;
  max-width: 420px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  &__icon {
    font-size: 40px;
    margin-bottom: 16px;
  }
  &__title {
    font-size: 20px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 12px;
  }
  &__text {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
    margin-bottom: 28px;
  }
  &__actions {
    display: flex;
    gap: 12px;
    justify-content: center;
  }
  &__btn {
    padding: 11px 28px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
    &--cancel {
      background: #e8e8e8;
      color: #333;
      &:hover {
        background: #d8d8d8;
      }
    }
    &--confirm {
      background: #e63030;
      color: white;
      &:hover {
        background: #c82020;
      }
    }
  }
}

@media (max-width: 767.98px) {
  .modal {
    padding: 28px 20px;
    &__icon {
      font-size: 30px;
      margin-bottom: 13px;
    }
    &__title {
      font-size: 17px;
      margin-bottom: 10px;
    }
    &__text {
      font-size: 13px;
      line-height: 1.3;
      margin-bottom: 18px;
    }
    &__actions {
      flex-direction: column;
      gap: 8px;
    }
    &__btn {
      width: 100%;
      font-size: 10px;
    }
  }
}
</style>

<style scoped lang="scss"></style>
