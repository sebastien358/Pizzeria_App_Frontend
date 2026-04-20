<script setup lang="ts"></script>

<template>
  <section class="footer-newsletter">
    <div class="footer-newsletter__container">
      <div class="footer-newsletter__text">
        <span>NEWSLETTER</span>
        <h2>Rejoignez notre newsletter</h2>
      </div>

      <form class="footer-newsletter__form">
        <input type="email" placeholder="Votre adresse e-mail" />
        <button type="submit">Envoyer</button>
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
/* NEWSLETTER */

.footer {
  width: 100%;
}

.footer-newsletter {
  background: #df2f2f;
  //padding: 55px 40px;

  padding: 80px 20px; /* équilibre */
}

.footer-newsletter__container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  flex-wrap: wrap;
}

.footer-newsletter__text span {
  display: block;
  font-size: 0.8rem;
  letter-spacing: 3px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 10px;
}

.footer-newsletter__text h2 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.2rem);
  color: white;
  text-transform: uppercase;
  line-height: 1;
}

.footer-newsletter__form {
  display: flex;
  align-items: center;
  gap: 18px;
  flex: 1;
  justify-content: flex-end;
  min-width: 320px;
}

.footer-newsletter__form input {
  width: 100%;
  max-width: 360px;
  background: transparent;
  border: none;
  border-bottom: 2px solid rgba(255, 255, 255, 0.8);
  padding: 14px 4px;
  color: white;
  font-size: 1rem;
  outline: none;
}

.footer-newsletter__form input::placeholder {
  color: rgba(255, 255, 255, 0.75);
}

.footer-newsletter__form button {
  border: none;
  background: white;
  color: #df2f2f;
  padding: 14px 34px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.25s ease;
}

.footer-newsletter__form button:hover {
  transform: translateY(-2px);
}
</style>
