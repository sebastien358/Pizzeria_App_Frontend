<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="legal-overlay">
        <div class="legal-modal">
          <button class="legal-modal__close" @click.self="emit('close')">✕</button>

          <div class="legal-modal__header">
            <h1>Mentions légales</h1>
            <div class="legal-modal__line"></div>
          </div>

          <div class="legal-modal__content">
            <section class="legal-section">
              <h2>Éditeur du site</h2>
              <p><strong>Nom :</strong> Sébastien Petit</p>
              <p><strong>Statut :</strong> Entrepreneur individuel</p>
              <p><strong>Email :</strong> sebastienpetit27330@gmail.com</p>
            </section>

            <section class="legal-section">
              <h2>Hébergement</h2>
              <p><strong>Hébergeur :</strong> O2Switch</p>
              <p>
                <strong>Adresse :</strong> 222-224 Boulevard Gustave Flaubert, 63000
                Clermont-Ferrand
              </p>
              <p>
                <strong>Site :</strong>
                <a href="https://www.o2switch.fr" target="_blank">www.o2switch.fr</a>
              </p>
            </section>

            <section class="legal-section">
              <h2>Propriété intellectuelle</h2>
              <p>
                L'ensemble des contenus du site (textes, images, logo, graphismes, code source) est
                protégé par le droit d'auteur. Toute reproduction sans autorisation expresse est
                strictement interdite.
              </p>
            </section>

            <section class="legal-section">
              <h2>Données personnelles</h2>
              <p>
                Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de
                suppression de vos données personnelles. Contactez-nous à :
                <strong>sebastienpetit27330@gmail.com</strong>
              </p>
              <p>
                Les données collectées (email, adresse) sont utilisées uniquement pour le traitement
                de vos commandes et ne sont jamais transmises à des tiers.
              </p>
            </section>

            <section class="legal-section">
              <h2>Cookies</h2>
              <p>
                Ce site utilise uniquement des cookies techniques nécessaires à son fonctionnement
                (authentification, panier). Aucun cookie publicitaire ou de tracking n'est utilisé.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.legal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 15px;
}

.legal-modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 700px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  position: relative;

  &__close {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #aaa;
    line-height: 1;
    padding: 4px 8px;
    border-radius: 4px;
    transition: color 0.2s;

    &:hover {
      color: #1a1a1a;
    }
  }

  &__header {
    padding: 2rem 2rem 1rem;
    text-align: center;
    border-bottom: 1px solid #eee;
    flex-shrink: 0;

    h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a1a1a;
      font-family: 'Georgia', serif;
      margin: 0 0 0.5rem;
    }
  }

  &__line {
    width: 45px;
    height: 3px;
    background: #e63946;
    margin: 0 auto;
    border-radius: 2px;
  }

  &__content {
    overflow-y: auto;
    padding: 1.5rem 2rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
}

.legal-section {
  h2 {
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #1a1a1a;
    margin: 0 0 0.8rem;
    padding-bottom: 0.4rem;
    border-bottom: 1.5px solid #e63946;
    display: inline-block;
  }

  p {
    color: #555;
    line-height: 1.8;
    font-size: 0.9rem;
    margin: 0 0 0.5rem;
  }

  a {
    color: #e63946;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 1600px) {
  .legal-modal {
    max-width: 540px;
    &__header {
      padding: 20px 15px;
      h1 {
        font-size: 1rem;
        margin: 0 0 0.3rem;
      }
    }
    &__close {
      font-size: 17px;
    }
    &__line {
      width: 45px;
      height: 2px;
    }
    &__content {
      padding: 20px 20px 15px 20px;
      gap: 0.6rem;
    }
    .legal-section {
      h2 {
        font-size: 0.7rem;
        letter-spacing: 0.04em;
        padding-bottom: 0;
      }
      p {
        line-height: 1.4;
        font-size: 0.8rem;
        margin: 0 0 0.4rem;
      }
    }
  }
}

@media (max-width: 767.98px) {
  .legal-modal {
    //max-height: 90vh;
    &__header {
      padding: 15px 15px;
      h1 {
        font-size: 0.85rem;
        margin: 0 0 0.3rem;
      }
    }
    &__content {
      padding: 15px 15px;
      gap: 0.4rem;
    }
    &__close {
      font-size: 15px;
    }
    &__line {
      width: 45px;
      height: 2px;
      background: #e63946;
      margin: 0 auto;
      border-radius: 2px;
    }
    .legal-section {
      h2 {
        font-size: 0.65rem;
        letter-spacing: 0.03em;
        padding-bottom: 0;
      }
      p {
        line-height: 1.4;
        font-size: 0.7rem;
        margin: 0 0 0.4rem;
      }
    }
  }
}
</style>
