<script setup></script>

<template>
  <main class="main-nav">
    <section>
      <label class="label" for="">Crew</label>
      <h2 class="h2-font">De drijvende kracht achter de schermen.</h2>
      <p>
        De crew is het hart van het team. Samen werken ze hard, helpen ze elkaar
        en zorgen ze dat alles soepel verloopt. Door teamwork en inzet maken ze
        ideeën werkelijkheid.
      </p>
      <article>
        <img src="../assets/pictures/image.png" alt="Foto 1" />
        <h3 class="h3-font">Mado de Vries</h3>
        <p>Oprichtster</p>
      </article>
      <article>
        <img src="../assets/pictures/image.png" alt="Foto 2" />
        <h3 class="h3-font">Mado de Vries</h3>
        <p>Oprichtster</p>
      </article>
      <article>
        <img src="../assets/pictures/image.png" alt="Foto 3" />
        <h3 class="h3-font">Mado de Vries</h3>
        <p>Oprichtster</p>
      </article>
      <article>
        <img src="../assets/pictures/image.png" alt="Foto 4" />
        <h3 class="h3-font">Mado de Vries</h3>
        <p>Oprichtster</p>
      </article>
      <article>
        <img src="../assets/pictures/image.png" alt="Foto 5" />
        <h3 class="h3-font">Mado de Vries</h3>
        <p>Oprichtster</p>
      </article>
    </section>
  </main>
</template>

<style scoped>
article {
  display: grid;
  padding-top: 1rem;
  gap: 0.8rem;

  img {
    width: 100%;
    border-radius: var(--br);
  }

  p {
    color: var(--c-secondary);
  }
}
</style>
