<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Slider from "../components/slider.vue";

const SLIDE_DURATION = 3000;
const TRANSITION_DELAY = 300;

const FIRST_HERO_IMAGE = "/pictures/hero/meiden-die-zingen.avif";

const heroImages = [
  "interieur-tekening.avif",
  "meid-die-zingt.avif",
  "optreden.avif",
  "meiden-die-dansen.avif",
  "graffiti.avif",
  "meid-die-schrijft.avif",
  "meid-die-tekent.avif",
];

const workshopFotos = [
  "meiden-die-zingen.avif",
  "interieur-tekening.avif",
  "meid-die-zingt.avif",
  "optreden.avif",
  "meiden-die-dansen.avif",
];

const currentIndex = ref(0);
const showImage = ref(true);
const videoRef = ref(null);
const isMuted = ref(true);

let observer = null;
let intervalId = null;

const toggleMute = () => {
  if (!videoRef.value) return;

  isMuted.value = !isMuted.value;
  videoRef.value.muted = isMuted.value;
  videoRef.value.volume = isMuted.value ? 0 : 0.5;
};

const getHeroImageUrl = (name) =>
  new URL(`../assets/pictures/hero/${name}`, import.meta.url).href;

const currentHeroSrc = () =>
  currentIndex.value === 0
    ? FIRST_HERO_IMAGE
    : getHeroImageUrl(heroImages[currentIndex.value - 1]);

const startSlideshow = () => {
  intervalId = setInterval(() => {
    showImage.value = false;

    setTimeout(() => {
      currentIndex.value = (currentIndex.value + 1) % (heroImages.length + 1);
      showImage.value = true;
    }, TRANSITION_DELAY);
  }, SLIDE_DURATION);
};

const setupVideoObserver = () => {
  if (!videoRef.value) return;

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        const playPromise = videoRef.value.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            console.warn(
              "Autoplay geblokkeerd. Video blijft gepauzeerd tot interactie."
            );
          });
        }
      } else {
        videoRef.value.pause();
      }
    },
    { threshold: 0.3 }
  );

  observer.observe(videoRef.value);
};

onMounted(() => {
  startSlideshow();
  setupVideoObserver();

  if (videoRef.value) videoRef.value.volume = 0.5;
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
  if (observer) observer.disconnect();
});
</script>

<template>
  <main class="main-home">
    <section class="hero">
      <img
        :src="currentHeroSrc()"
        :class="['hero-img', { show: showImage }]"
        fetchpriority="high"
        loading="eager"
        width="1920"
        height="1080"
        alt="Hero Image Artquake"
      />

      <h1 class="h1-font"><em>ART</em>QUAKE</h1>

      <p>
        Waar jongeren samen kunst creëren, elkaar inspireren, van elkaar leren
        en zichzelf zo verder kunnen ontwikkelen.
      </p>

      <router-link to="/artiesten" class="btn">
        Bekijk de artiesten
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
      <h2 class="h2-font">Bekijk de <em>video</em> van onze locatie</h2>
      <span class="line"></span>
      <p>
        Heb je een job, project of optreden? Zet ’m op het Prikbord en kom in
        contact met makers.
      </p>

      <div class="video-container">
        <video
          ref="videoRef"
          loop
          preload="none"
          playsinline
          muted
          class="custom-video"
        >
          <source src="../assets/videos/dewi-uitleg.mp4" type="video/mp4" />
        </video>

        <button
          @click="toggleMute"
          class="mute-btn"
          aria-label="Geluid aan/uit"
        >
          <span v-if="isMuted">🔇</span>
          <span v-else>🔉</span>
        </button>
      </div>
    </section>

    <section>
      <h2 class="h2-font">Impressie</h2>
      <span class="line"></span>
      <p>
        Artquake is een creatief en cultureel jongerenplatform, waar
        jongerenkunst en talentontwikkeling centraal staan.
      </p>
      <Slider :images="workshopFotos" folder="hero" />
    </section>

    <section>
      <h2 class="h2-font">
        Heb jij <em>talent?</em> of heb je een <em>andere vraag?</em>
      </h2>
      <span class="line"></span>
      <p>
        Laat zien wat je kunt, deel je passie en kom in contact met mensen die
        jouw talent waarderen en nodig hebben.
      </p>

      <router-link to="/contact" class="btn"> Contact ons </router-link>
    </section>
  </main>
</template>

<style scoped>
section {
  position: relative;
  min-height: 80vh;
  place-content: center;
  justify-content: left;

  .line {
    background: var(--c-primary);
    width: 4rem;
    height: 3px;
    border-radius: var(--br);
  }

  @media (min-width: 900px) {
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
      background: var(--c-overlay-light);
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
      color: var(--c-pseudo-dark);
    }
  }

  &:nth-of-type(4) {
    height: 100vh;

    @media (min-width: 900px) {
      padding: 5rem max(var(--gap), calc((100vw - var(--content-max)) / 2));
    }

    h2:before {
      content: var(--t-2);
      color: var(--c-pseudo-dark);
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
      border-radius: var(--br-lg);
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
      padding: 0.5rem 0.8rem;
      cursor: pointer;
      opacity: 0.9;
      z-index: 5;
    }

    .prev {
      left: 0;
    }

    .next {
      right: 0;
    }
  }

  &:nth-of-type(3) {
    padding: 8rem 1.5rem;
    position: relative;

    h2:before {
      content: var(--t-3);
      color: var(--c-pseudo-light);
    }

    video {
      max-width: 20rem;
      margin-top: 2rem;
    }

    @media (min-width: 900px) {
      padding: 5rem max(var(--gap), calc((100vw - var(--content-max)) / 2));
      grid-template-columns: 1fr 1fr;
      align-items: center;

      h2,
      .line,
      p {
        grid-column: 1;
      }

      .video-container {
        grid-column: 2;
        grid-row: 1 / span 3;
        align-self: center;
      }

      video {
        max-width: 100%;
        margin-top: 0;
      }
    }
  }

  &:nth-of-type(5) {
    h2:before {
      content: var(--t-4);
      color: var(--c-pseudo-light);
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

.mute-btn {
  position: absolute;
  left: 3rem;
  margin-top: 3.5rem;
  background: var(--c-primary);
  aspect-ratio: 1/1;
  width: 3rem;
  border-radius: var(--br);

  span {
    font-size: 1.5rem;
  }
}
</style>
