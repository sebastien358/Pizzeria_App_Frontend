<script setup lang="ts">
</script>

<template>
  <section class="success">
    <div class="success__card">
      <div class="success__icon">✅</div>
      <h1 class="success__title">Paiement réussi</h1>
      <p class="success__text">
        Votre commande est en cours de préparation. Vous serez bientôt livré 🍕
      </p>
      <router-link to="/" class="success__button"> Retour à l’accueil </router-link>
    </div>
  </section>
</template>

<style scoped lang="scss">
.success {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f7f4;
  padding: 40px 16px;
}

.success__card {
  background: #fff;
  padding: 40px 32px;
  border-radius: 14px;
  text-align: center;
  max-width: 420px;
  width: 100%;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.success__icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.success__title {
  font-size: 1.6rem;
  margin-bottom: 12px;
  color: #2c2c2c;
}

.success__text {
  font-size: 0.95rem;
  color: #6f6f6f;
  line-height: 1.6;
  margin-bottom: 24px;
}

.success__button {
  display: inline-block;
  padding: 12px 20px;
  background: #e63946;
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.success__button:hover {
  background: #c92f3b;
}
</style>
