<script setup>
import { ref } from "vue";

const slider = ref(null);

const scrollAmount = 300;

const scrollLeft = () => {
  slider.value.scrollBy({
    left: -scrollAmount,
    behavior: "smooth",
  });
};

const scrollRight = () => {
  slider.value.scrollBy({
    left: scrollAmount,
    behavior: "smooth",
  });
};
</script>

<template>
  <main class="main-home">
    <section>
      <h1 class="h1-font"><em>ART</em>QUAKE</h1>
      <p>
        Waar jongeren samen kunst creëren, elkaar inspireren, van elkaar leren
        en zichzelf zo verder kunnen ontwikkelen.
      </p>
      <a href="/artiesten" class="btn">Bekijk de artiesten</a>
    </section>
    <section>
      <h2 class="h2-font">Stichting Villa <em>Artquake</em></h2>
      <p>
        In 2020 werd stichting Villa Artquake opgericht, met als doel een eigen
        culturele broedplaats te creëren. De naam verwijst naar Villa Kakelbont
        uit Pippi Langkous: een veilige plek waar je jezelf kunt zijn, vrij van
        oordeel en hokjes.
      </p>
    </section>
    <section>
      <h2 class="h2-font">Impressie</h2>
      <p>
        Artquake is een creatief en cultureel jongerenplatform, waar
        jongerenkunst en talentontwikkeling centraal staan.
      </p>

      <div class="slider-wrapper">
        <button aria-label="Schuif de foto's naar links knop" class="nav prev" @click="scrollLeft">
            <img alt=""
            src="../assets/pictures/chevron-left.svg"
          ></img>
        </button>

        <div class="slider" ref="slider">
          <img src="../assets/pictures/hero.png" alt="" />
          <img src="../assets/pictures/hero.png" alt="" />
          <img src="../assets/pictures/hero.png" alt="" />
          <img src="../assets/pictures/hero.png" alt="" />
        </div>

        <button aria-label="Schuif de foto's naar rechts knop" class="nav next" @click="scrollRight">
          <img alt=""
            src="../assets/pictures/chevron-right.svg"
          ></img>
        </button>
      </div>
    </section>
    <section>
      <h2 class="h2-font">Bekijk de <em>video</em></h2>
      <p>
        Heb je een job, project of optreden? Zet ’m op het Prikbord en kom in
        contact met makers.
      </p>
      <video
        src="https://art-quake.com/wp-content/uploads/2024/02/artquake.mp4"
        controls
        autoplay
        poster="../assets/pictures/hero.png"
        preload="metadata"
        muted
      >
        <source
          src="https://art-quake.com/wp-content/uploads/2024/02/artquake.mp4"
          type="video/mp4"
        />
        Je browser ondersteunt deze video niet.
      </video>
    </section>
    <section>
      <h2 class="h2-font">Heb jij <em>talent?</em></h2>
      <p>
        Laat zien wat je kunt, deel je passie en kom in contact met mensen die
        jouw talent waarderen en nodig hebben.
      </p>
      <a href="" class="btn">Contact ons</a>
    </section>
  </main>
</template>

<style scoped>
section {
  position: relative;
  height: 80vh;
  place-content: center;
  justify-content: left;

  &:nth-of-type(even) {
    background: var(--c-bg-alt);
  }

  &:nth-of-type(1) {
    height: 100dvh;
    background-image: url(../assets/pictures/hero.png);
    background-size: cover;
    background-position: center;

    h1,
    p,
    a {
      z-index: 2;
    }

    &::after {
      background: hsla(0, 0%, 0%, 0.8);
      height: 100%;
      width: 100%;
      content: "";
      position: absolute;
      top: 0;
    }
  }

  &:nth-of-type(2) {
    h2:before {
      content: var(--t-1);
    }
  }

  &:nth-of-type(3) {
    height: 100vh;

    h2:before {
      content: var(--t-2);
    }

    .slider-wrapper {
      position: relative;
      margin-top: 2rem;
    }

    .slider {
      display: flex;
      gap: 1rem;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scroll-behavior: smooth;
      padding-bottom: 1rem;
    }

    .slider img {
      flex: 0 0 80%;
      max-width: 80%;
      height: 300px;
      object-fit: cover;
      border-radius: 12px;
      scroll-snap-align: start;
    }

    .slider::-webkit-scrollbar {
      display: none;
    }

    .nav {
      background: var(--c-primary);
      color: var(--c-light);
      border-radius: var(--br);

      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      border: none;
      font-size: 2rem;
      padding: 0.5rem .8rem;
      cursor: pointer;
      opacity: .9;
      z-index: 5;
    }

    .prev {
      left: 0;
    }

    .next {
      right: 0;
    }
  }

  &:nth-of-type(4) {
    h2:before {
      content: var(--t-3);
    }

    video {
      max-width: 100%;
    }
  }

  &:nth-of-type(5) {
    h2:before {
      content: var(--t-4);
    }
  }
}
</style>
