<script setup></script>

<template>
  <main>
    <section>
      <label class="label" for="">Artiesten</label>
      <h2 class="h2-font">Voorbeeld titel tekst tekst tekst tekst</h2>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores ad
        quibusdam commodi ab deserunt neque voluptatum pariatur aut, libero ex
        molestiae unde nostrum repellendus voluptatem quos quod magnam in
        tempore.
      </p>
      <select name="" id="">
        <option value="">asd</option>
      </select>
    </section>

    <section>
      <article>
        <img src="../assets/pictures/band.png" />
        <p>Band Artquake</p>
      </article>

      <article>
        <img src="../assets/pictures/band.png" />
        <p>Band Artquake</p>
      </article>

      <article>
        <img src="../assets/pictures/band.png" />
        <p>Band Artquake</p>
      </article>

      <article>
        <img src="../assets/pictures/band.png" />
        <p>Band Artquake</p>
      </article>

      <article>
        <img src="../assets/pictures/band.png" />
        <p>Band Artquake</p>
      </article>

      <article>
        <img src="../assets/pictures/band.png" />
        <p>Band Artquake</p>
      </article>

      <article>
        <img src="../assets/pictures/band.png" />
        <p>Band Artquake</p>
      </article>

      <article>
        <img src="../assets/pictures/band.png" />
        <p>Band Artquake</p>
      </article>
    </section>
  </main>
</template>

<style scoped>
section:nth-of-type(2) {
  width: 100%;
  display: grid;
  place-content: center;
  gap: 4rem;
}

article {
  text-align: center;
  display: grid;
  gap: 0.5rem;

  img {
    width: 15rem;
    object-fit: cover;
    aspect-ratio: 1/1;
    border-radius: var(--br);
  }
}
</style>
