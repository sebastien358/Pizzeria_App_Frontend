<script setup lang="ts">
</script>

<template>
  <section class="newsletter">
    <div class="newsletter__container">
      <div class="newsletter__text">
        <span>NEWSLETTER</span>
        <h2>Rejoignez notre newsletter</h2>
      </div>

      <form class="newsletter__form">
        <input type="email" placeholder="Votre adresse e-mail" />
        <button type="button">Envoyer</button>
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
/* NEWSLETTER */

.newsletter {
  background: #df2f2f;
  padding: 80px 20px;
  &__container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
    flex-wrap: wrap;
  }
  &__text span {
    display: block;
    font-size: 0.8rem;
    letter-spacing: 3px;
    color: rgba(255, 255, 255, 0.85);
    margin-bottom: 10px;
  }
  &__text h2 {
    margin: 0;
    font-size: clamp(2rem, 4vw, 3.2rem);
    color: white;
    text-transform: uppercase;
    line-height: 1;
  }
  &__form {
    display: flex;
    align-items: center;
    gap: 18px;
    flex: 1;
    justify-content: flex-end;
    min-width: 320px;
  }
  &__form input {
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
  &__form input::placeholder {
    color: rgba(255, 255, 255, 0.75);
  }
  &__form button {
    border: none;
    background: white;
    color: #df2f2f;
    padding: 14px 34px;
    border-radius: 999px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.25s ease;
  }
  &__form button:hover {
    transform: translateY(-2px);
  }
}


@media (max-width: 991.98px) {
  .newsletter {
    padding: 60px 40px;
    &__text h2 {
      font-size: 35px;
    }
    &__form input {
      max-width: 280px;
      background: transparent;
      padding: 15px 4px;
      font-size: 13px;
    }
  }
}


@media (max-width: 767.98px) {
  .newsletter {
    padding: 30px 20px 25px 20px;
    &__container {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }
    &__text h2 {
      font-size: 22px;
    }
    &__form {
      align-items: flex-end;
    }
    &__form input {
      max-width: 240px;
      background: transparent;
      padding: 15px 4px;
      font-size: 13px;
    }
    &__form button {
      padding: 12px 28px;
      font-size: 11px;
    }
  }
}
</style>
