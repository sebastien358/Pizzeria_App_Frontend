<script setup lang="ts">
import { ref } from 'vue'
import Legal from '@/templates/mentions-legales/Legal.vue'

const isOpen = ref<boolean>(false)

function openModal() {
  isOpen.value = true
}
</script>

<template>
  <footer class="footer">
    <section class="footer-main">
      <div class="footer-main__logo">
        <div class="footer-brand">
          <img
            src="../../assets/images/hero-pizza.png"
            alt="Logo Pizzeria"
            class="footer-brand__icon"
          />
          <h3>Pizzeria</h3>
          <p>COMMANDE EN LIGNE</p>
        </div>
      </div>

      <div class="footer-main__socials">
        <a target="_blank" href="https://www.facebook.com">Facebook</a>
        <a target="_blank" href="https://www.instagram.com">Instagram</a>
        <a target="_blank" href="https://www.tiktok.com">TikTok</a>
      </div>

      <div class="footer-main__infos">
        <div class="footer-info">
          <h4>Adresse</h4>
          <p>12 rue de la Pizza, 75000 Paris</p>
        </div>

        <div class="footer-info">
          <h4>Téléphone</h4>
          <p>01 23 45 67 89</p>
        </div>

        <div class="footer-info">
          <h4>Email</h4>
          <p>contact@pizzeria.fr</p>
        </div>
      </div>

      <nav class="footer-main__nav">
        <router-link to="/">Accueil</router-link>
        <router-link to="/pizza-cart">La carte</router-link>
        <router-link to="/contact">Contact</router-link>
        <router-link to="/login">Connexion</router-link>
      </nav>

      <div class="footer-main__bottom">
        <p>Copyright © 2026 Pizzeria. Tous droits réservés.</p>
        <span @click="openModal()">Mentions légales</span>
      </div>
    </section>

    <Legal :isOpen="isOpen" @close="isOpen = false" />
  </footer>
</template>

<style scoped lang="scss">
.footer {
  width: 100%;
  border-top: 1px solid #e5dfd6;
}

/* MAIN FOOTER */
.footer-main {
  background: #f7f4ef;
  padding: 90px 20px 35px;
  text-align: center;
}

.footer-main__logo {
  margin-bottom: 30px;
}

.footer-brand {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.footer-brand__icon {
  width: 52px;
  height: 52px;
  object-fit: contain;
}

.footer-brand h3 {
  margin: 0;
  font-size: 3rem;
  color: #d63333;
}

.footer-brand p {
  margin: 0;
  font-size: 0.85rem;
  letter-spacing: 3px;
  color: #6d6d6d;
}

.footer-main__socials {
  display: flex;
  justify-content: center;
  gap: 18px;
  margin-bottom: 45px;
  flex-wrap: wrap;
}

.footer-main__socials a {
  text-decoration: none;
  color: #6a6a6a;
  font-size: 0.95rem;
  transition: 0.2s ease;
}

.footer-main__socials a:hover {
  color: #d63333;
}

.footer-main__infos {
  max-width: 1100px;
  margin: 0 auto 45px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.footer-info {
  position: relative;
  padding-top: 20px;
}

.footer-info::before {
  content: '';
  display: block;
  width: 90px;
  height: 1px;
  background: #d9d2ca;
  margin: 0 auto 22px;
}

.footer-info h4 {
  margin: 0 0 10px;
  font-size: 1.1rem;
  color: #d63333;
}

.footer-info p {
  margin: 0;
  color: #5f5f5f;
  line-height: 1.6;
}

.footer-main__nav {
  display: flex;
  justify-content: center;
  gap: 22px;
  flex-wrap: wrap;
  margin-bottom: 25px;
}

.footer-main__nav a {
  text-decoration: none;
  color: #444;
  font-size: 0.95rem;
}

.footer-main__nav a:hover {
  color: #d63333;
}

.footer-main__bottom p {
  margin: 0;
  font-size: 0.9rem;
  color: #7c7c7c;
}

.footer-main__bottom {
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.footer-main__bottom span {
  font-size: 13px;
  color: #aaa;
  cursor: pointer;

  &:hover {
    color: #e63946;
  }
}

/* RESPONSIVE */

@media (max-width: 991.98px) {
  .footer-main__infos {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .footer-newsletter__container {
    flex-direction: column;
    align-items: flex-start;
  }

  .footer-newsletter__form {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 767.98px) {
  .footer-newsletter {
    padding: 24px 18px;
  }

  .footer-newsletter__title {
    line-height: 1.2;
    font-size: 1.2rem;
  }

  .footer-newsletter__form {
    flex-direction: column;
    align-items: stretch;
    min-width: 100%;
    gap: 10px;
  }

  .footer-newsletter__form input {
    max-width: 100%;
    font-size: 0.82rem;
    padding: 10px 12px;
  }

  .footer-newsletter__form button {
    width: 100%;
    font-size: 0.82rem;
    padding: 10px;
  }

  .footer-brand h3 {
    font-size: 1.35rem;
  }

  .footer-brand p,
  .footer-main__infos p,
  .footer-links a,
  .footer-copy {
    font-size: 0.75rem;
    line-height: 1.5;
  }

  .footer-brand h3 {
    font-size: 1.35rem;
  }

  .footer-main__socials {
    margin-bottom: 30px;
  }

  .footer-main__infos {
    gap: 18px;
  }

  .footer-main__infos h4 {
    font-size: 0.9rem;
  }

  .footer-main__infos {
    gap: 18px;
  }

  .footer-links {
    gap: 14px;
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
