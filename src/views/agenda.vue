<template>
  <main>
    <section>
      <label class="label" for="">Agenda</label>
      <h2 class="h2-font">Aankomende events van Artquake.</h2>
      <p>
        Hieronder vind je een overzicht van alle aankomende evenementen en
        activiteiten die we organiseren. Volg ons op Instagram voor de verdere
        inhoud per activiteit en het laatste nieuws!
      </p>
      <article>
        <img src="../assets/pictures/image.png" alt="" />
        <p>The midnight band</p>
        <p>Poppodium B3, St. Pancras</p>
        <p>11 februari</p>
        <p>15:30 - 18:30</p>
        <p>Open entree</p>
      </article>
      <article>
        <img src="../assets/pictures/image.png" alt="" />
        <p>The midnight band</p>
        <p>Poppodium B3, St. Pancras</p>
        <p>11 februari</p>
        <p>15:30 - 18:30</p>
        <p>Open entree</p>
      </article>
      <article>
        <img src="../assets/pictures/image.png" alt="" />
        <p>The midnight band</p>
        <p>Poppodium B3, St. Pancras</p>
        <p>11 februari</p>
        <p>15:30 - 18:30</p>
        <p>Open entree</p>
      </article>
      <article>
        <img src="../assets/pictures/image.png" alt="" />
        <p>The midnight band</p>
        <p>Poppodium B3, St. Pancras</p>
        <p>11 februari</p>
        <p>15:30 - 18:30</p>
        <p>Open entree</p>
      </article>
    </section>
  </main>
</template>

<style scoped>
article {
  background: #232323;
  border-radius: var(--br);
  padding: 1rem;
  min-height: 10rem;
  border: 1px solid white;
  margin-top: 1rem;
  display: grid;
  gap: 0.5rem;
  grid-template-areas:
    "picture band band"
    "picture place place"
    "date . time"
    "type type type";

  img {
    width: 6rem;
    border-radius: var(--br);
    grid-area: picture;
  }

  p:nth-of-type(1) {
    grid-area: band;
  }

  p:nth-of-type(2) {
    grid-area: place;
  }

  p:nth-of-type(3) {
    grid-area: date;
  }

  p:nth-of-type(4) {
    grid-area: time;
  }

  p:nth-of-type(5) {
    grid-area: type;
  }
}
</style>
