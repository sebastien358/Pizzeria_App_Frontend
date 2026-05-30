<script setup lang="ts">
import { useContactAdminStore } from '@/stores/admin/contactAdminStore.ts'
import { computed, onMounted, ref, watch } from 'vue'
import Pagination from '@/templates/pagination/Pagination.vue'
import InputSearch from '@/templates/input-search/InputSearch.vue'

// Placeholder
const placeholder = ref<string>('Rechercher un contact...')

const store = useContactAdminStore()

const loadContacts = async () => {
  try {
    await store.contactAdminList()
  } catch (e) {
    console.error(e)
  }
}

const previousPage = async () => {
  try {
    if (store.currentPage > 1) store.currentPage--
    await store.contactAdminList()
  } catch (e) {
    console.error(e)
  }
}

const nextPage = async () => {
  store.currentPage++
  try {
    await store.contactAdminList()
  } catch (e) {
    console.error(e)
  }
}

const contacts = computed(() => store.contacts)

watch(() => store.term, (term: string | null) => {
    store.contactSearch(term)
  },
  { immediate: true },
)

onMounted(async () => {
  await loadContacts()
})
</script>

<template>
  <!-- Loading -->
  <section v-if="store.isLoading" class="spinner">
    <span class="loader"></span>
  </section>
  <!-- Contact -->
  <section v-else-if="store.contacts.length > 0" class="contact">
    <!-- Input Search -->
    <div class="contact__search">
      <InputSearch
        :term="store.term"
        @update:term="store.term = $event"
        :total="store.total"
        :placeholder="placeholder"
      />
    </div>

    <div class="contact__list">
      <div class="contact__item" v-for="contact in contacts" :key="contact.id">
        <div class="contact__header">
          <div class="contact__infos">
            <span class="contact__name"> {{ contact.firstname }} {{ contact.lastname }} </span>
            <span class="contact__email">
              {{ contact.email }}
            </span>
          </div>
          <div class="contact__buttons">
            <router-link
              class="contact__details"
              :to="{ name: 'contact-details', params: { id: contact.id } }"
            >
              Détails
            </router-link>
          </div>
        </div>
        <div class="contact__message">
          {{ contact.message.slice(0, 20) }}...
        </div>
      </div>
    </div>
    <!-- Pagination -->
    <pagination
      v-if="store.pages > 1"
      :currentPage="store.currentPage"
      :pages="store.pages"
      @previous-page="previousPage"
      @next-page="nextPage"
    />
  </section>

  <!-- Aucun contact -->
  <section v-else class="no-contact">
    <p>Aucun message pour le moment.</p>
  </section>
</template>

<style scoped lang="scss">
// Spinner

.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100dvh - 80px);
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

// Contact

.contact {
  position: relative;

  padding: 30px 20px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  &__search {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
  }
  &__list {
    width: 100%;
    max-width: 1000px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  &__item {
    background: white;
    border-radius: 12px;
    padding: 1rem 1.2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease;
    overflow: hidden;
    border-left: 4px solid #e63946;
    min-height: auto;
  }

  &__item:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  }
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.6rem;
  }
  &__infos {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  &__name {
    font-weight: 600;
    font-size: 1rem;
    color: #2c2c2c;
  }
  &__email {
    font-size: 0.85rem;
    color: #888;
    overflow-wrap: anywhere;
  }
  &__buttons {
    display: flex;
    align-items: stretch;
    flex-direction: row;
    gap: 6px;
  }
  &__message {
    color: #444;
    line-height: 1.4;
    background: #f7f7f7;
    padding: 20px;
    border-radius: 8px;
    overflow-wrap: anywhere;
    font-size: 14px;
    max-height: 120px;
    overflow-y: auto;
  }

  &__details {
    background: #e63946;
    color: white;
    border: none;
    padding: 9px 14px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 11px;
    transition: background 0.2s;
    &:hover {
      background: #c1121f;
    }
  }
}

.contact :deep(.pagination) {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  width: 100%;
  @media (max-width: 767.98px) {
    margin-top: 15px;
  }
}

@media (max-width: 1600px) {
  .contact {
    padding: 40px 20px;
  }
}

@media (max-width: 1024px) {
  .contact {
    &__list {
      grid-template-columns: repeat(1, 1fr);
    }
  }
}

@media (max-width: 767.98px) {
  .contact {
    padding: 30px 15px;
    &__search {
      margin-bottom: 25px;
    }
    &__list {
      gap: 15px;
    }
    &__item {
      padding: 0.8rem 0.9rem;
      border-radius: 10px;
    }
    &__header {
      flex-direction: column;
      align-items: stretch;
      gap: 0.1rem;
      height: auto;
    }
    &__response {
      width: 100%;
      text-align: center;
      margin-top: 5px;
      padding: 0.4rem 0.7rem;
    }
    &__delete {
      width: 100%;
      text-align: center;
      margin-top: 5px;
      padding: 0.4rem 0.7rem;
    }
    &__name {
      font-size: 14px;
    }
    &__email {
      font-size: 13px;
    }
    &__message {
      max-height: 100px;
      font-size: 13px;
      line-height: 1.5;
      padding: 15px;
    }
  }
}

/* No contact */

.no-contact {
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
