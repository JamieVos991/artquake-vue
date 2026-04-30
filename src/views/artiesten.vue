<script setup></script>

<template>
  <main>
    <section>
      <label class="label" for="">Artiesten</label>
      <h2 class="h2-font">De <em>makers</em> van nu</h2>
      <p>
        Artquake bestaat uit talloze getalenteerde artiesten, die zowel op het
        podium staan als hun kunst tonen via exposities. Op deze pagina kun je
        onze artiesten vinden en meer over ze te weten komen
        <br />
        <br />
        Op zoek naar jong, aanstormend talent voor een optreden, evenement,
        festival, feest of andere bijzondere gelegenheid, neem contact met ons
        op!
      </p>
      <button>Alle</button>
      <button>Podium</button>
      <button>Expo</button>
    </section>

    <section>
      <article>
        <img src="../assets/pictures/Voorbeeld.png" />
        <p>Band Artquake</p>
      </article>

      <article>
        <img src="../assets/pictures/Voorbeeld.png" />
        <p>Band Artquake</p>
      </article>

      <article>
        <img src="../assets/pictures/Voorbeeld.png" />
        <p>Band Artquake</p>
      </article>

      <article>
        <img src="../assets/pictures/Voorbeeld.png" />
        <p>Band Artquake</p>
      </article>

      <article>
        <img src="../assets/pictures/Voorbeeld.png" />
        <p>Band Artquake</p>
      </article>

      <article>
        <img src="../assets/pictures/Voorbeeld.png" />
        <p>Band Artquake</p>
      </article>

      <article>
        <img src="../assets/pictures/Voorbeeld.png" />
        <p>Band Artquake</p>
      </article>

      <article>
        <img src="../assets/pictures/Voorbeeld.png" />
        <p>Band Artquake</p>
      </article>
    </section>
  </main>
</template>

<style scoped>
section {
  &:nth-of-type(1) {
    button {
      background: var(--c-primary);
    }
  }
}
section:nth-of-type(2) {
  width: 100%;
  display: flex;
  place-content: center;
  gap: 4rem;
  flex-wrap: wrap;
}

article {
  text-align: center;
  display: grid;
  gap: 0.5rem;

  img {
    width: 100%;
    object-fit: cover;
    aspect-ratio: 1/1;
    max-width: 25rem;
    border-radius: var(--br);
  }
}
</style>
