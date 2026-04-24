<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const heroImages = [
  'hero.webp',
  'hero-2.jpg',
  'hero-3.jpg',
  'hero-4.jpg',
  'hero-5.jpeg',
  'hero-6.jpeg',
  'hero-7.png',
  'hero-8.png',
];

const currentIndex = ref(0);
const showImage = ref(true);

let intervalId;

const getHeroImageUrl = (name) =>
  new URL(`../assets/pictures/${name}`, import.meta.url).href;

onMounted(() => {
  intervalId = setInterval(() => {
    showImage.value = false;

    setTimeout(() => {
      currentIndex.value =
        (currentIndex.value + 1) % heroImages.length;
      showImage.value = true;
    }, 300);
  }, 3000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <main class="main-home">
    <section class="hero">
  <img
    :src="getHeroImageUrl(heroImages[currentIndex])"
    :class="['hero-img', { show: showImage }]"
    alt=""
  />

  <h1 class="h1-font"><em>ART</em>QUAKE</h1>
  <p>
    Waar jongeren samen kunst creëren, elkaar inspireren, van elkaar leren
    en zichzelf zo verder kunnen ontwikkelen.
  </p>
    <router-link to="/artiesten">
      <a class="btn" href="">Bekijk de artiesten</a>
    </router-link>
</section>
    <section>
      <h2 class="h2-font">Stichting Villa <em>Artquake</em></h2>
      <span class="line"></span>
      <p>
        In 2020 werd stichting Villa Artquake opgericht, met als doel een eigen
        culturele broedplaats te creëren. De naam verwijst naar Villa Kakelbont
        uit Pippi Langkous: een veilige plek waar je jezelf kunt zijn, vrij van
        oordeel en hokjes.
      </p>
    </section>
    <section>
      <h2 class="h2-font">Impressie</h2>
      <span class="line"></span>
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
          <img loading="lazy" src="../assets/pictures/hero.png" alt="" />
          <img loading="lazy" src="../assets/pictures/hero.png" alt="" />
          <img loading="lazy" src="../assets/pictures/hero.png" alt="" />
          <img loading="lazy" src="../assets/pictures/hero.png" alt="" />
        </div>

        <button aria-label="Schuif de foto's naar rechts knop" class="nav next" @click="scrollRight">
          <img alt=""
            src="../assets/pictures/chevron-right.svg"
          ></img>
        </button>
      </div>
    </section>
    <section>
      <h2 class="h2-font">Bekijk de <em>video</em> van onze locatie</h2>
      <span class="line"></span>
      <p>
        Heb je een job, project of optreden? Zet ’m op het Prikbord en kom in
        contact met makers.
      </p>
      <video
        src="../assets/dewi.mp4"
        controls
        autoplay
        preload="metadata"
        muted
        loop
      >
        <source
          src="https://art-quake.com/wp-content/uploads/2024/02/artquake.mp4"
          type="video/mp4"
        />
        Je browser ondersteunt deze video niet.
      </video>
    </section>
    <section>
      <h2 class="h2-font">Heb jij <em>talent?</em>of heb je een <em>andere vraag?</em></h2>
      <span class="line"></span>
      <p>
        Laat zien wat je kunt, deel je passie en kom in contact met mensen die
        jouw talent waarderen en nodig hebben.
      </p>
      <router-link to="/contact">
      <a class="btn" href="">Contact ons</a>
    </router-link>
    </section>
  </main>
</template>

<style scoped>
section {
  position: relative;
  min-height: 80vh;
  place-content: center;
  justify-content: left;

  .line  {
    background: var(--c-primary);
    width: 4rem;
    height: 3px;
    border-radius: var(--br);
  }

  @media (min-width: 900px){
    place-content: center;
  }

  &:nth-of-type(even) {
    background: var(--c-bg-alt);
  }

  &:nth-of-type(1) {
    height: 100dvh;

    .hero-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.6s ease;
  z-index: 0;
}

.hero-img.show {
  opacity: 1;
}

    @media (min-width: 900px) {
      place-content: center;
      text-align: center;
    }

    h1,
    p,
    a {
      z-index: 2;
      opacity: 0; 
      animation: fadeInUp 0.8s ease-out forwards;

      @media (min-width: 900px) {
        justify-self: center;
      }
    }

    h1 {
      animation-delay: 0.2s;
    }

    p {
      animation-delay: 0.4s;
    }

    a {
      animation-delay: 0.6s;
    }

    &::after {
      background: hsla(0, 0%, 0%, 0.6);
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
    padding: 8rem 1.5rem;

    h2:before {
      content: var(--t-3);
    }

    video {
      max-width: 20rem;
      /* justify-self: center; */
      margin-top: 2rem;
    }
  }

  &:nth-of-type(5) {
    h2:before {
      content: var(--t-4);
    }
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
