<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Slider from "../components/slider.vue";

const SLIDE_DURATION = 3000;
const TRANSITION_DELAY = 300;

const heroImages = [
  "meiden-die-zingen.avif",
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

const startSlideshow = () => {
  intervalId = setInterval(() => {
    showImage.value = false;

    setTimeout(() => {
      currentIndex.value = (currentIndex.value + 1) % heroImages.length;
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
        :src="getHeroImageUrl(heroImages[currentIndex])"
        :class="['hero-img', { show: showImage }]"
        fetchpriority="high"
        loading="eager"
        width="1920"
        height="1080"
        alt="Hero Image Artquake"
      />

      <div class="hero-content">
        <span class="hero-label">Creatief &amp; Cultureel Platform</span>
        <h1 class="h1-font"><em>ART</em>QUAKE</h1>
        <p>
          Waar jongeren samen kunst creëren, elkaar inspireren, van elkaar leren
          en zichzelf zo verder kunnen ontwikkelen.
        </p>
        <div class="hero-actions">
          <router-link to="/artiesten" class="btn">Bekijk de artiesten</router-link>
          <router-link to="/contact" class="btn btn-outline">Neem contact op</router-link>
        </div>
      </div>

      <a class="scroll-indicator" href="#over-ons" aria-label="Scroll naar beneden">
        <span></span>
      </a>
    </section>

    <section id="over-ons">
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
      <div class="video-text">
        <h2 class="h2-font">Bekijk de <em>video</em> van onze locatie</h2>
        <span class="line"></span>
        <p>
          Heb je een job, project of optreden? Zet ‘m op het Prikbord en kom in
          contact met makers.
        </p>
      </div>

      <figure class="video-container">
        <video
          ref="videoRef"
          loop
          preload="metadata"
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
      </figure>
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
  place-content: center;
  justify-content: left;
  padding: 5rem 1.5rem;

  @media (min-width: 900px) {
    padding-inline: max(var(--gap), calc((100vw - var(--content-max)) / 2));
  }

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
    place-items: center;
    place-content: center;
    text-align: center;

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

    .hero-content {
      z-index: 2;
      display: grid;
      gap: 1.5rem;
      place-items: center;
      max-width: 55rem;
      opacity: 0;
      animation: fadeInUp 0.9s ease-out 0.1s forwards;

      @media (min-width: 900px) {
        gap: 2rem;
      }
    }

    .hero-label {
      display: inline-block;
      border: 1px solid hsla(0, 0%, 100%, 0.35);
      border-radius: 999px;
      padding: 0.4rem 1.2rem;
      font-size: 0.85rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: hsla(0, 0%, 100%, 0.8);
      backdrop-filter: blur(4px);
    }

    h1 {
      animation: glitch 3s ease-in-out 2s infinite;
      line-height: 1;

      @media (min-width: 900px) {
        font-size: clamp(4rem, 10vw, 9rem);
      }
    }

    p {
      max-width: 36rem;
      color: hsla(0, 0%, 100%, 0.88);
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .scroll-indicator {
      position: absolute;
      bottom: 2.5rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;

      span {
        display: block;
        width: 1.5px;
        height: 3.5rem;
        background: linear-gradient(to bottom, transparent, hsla(0, 0%, 100%, 0.6));
        animation: scrollLine 1.8s ease-in-out infinite;
      }
    }

    &::after {
      background:
        linear-gradient(to bottom, transparent 50%, var(--c-bg) 100%),
        hsla(0, 0%, 0%, 0.65);
      height: 100%;
      width: 100%;
      content: "";
      position: absolute;
      top: 0;
      z-index: 1;
    }
  }

  &:nth-of-type(2) {
    background: linear-gradient(to bottom, var(--c-bg) 0%, var(--c-bg-alt) 12rem) !important;

    h2:before {
      content: var(--t-1);
      color: var(--c-pseudo-dark);
    }

    @media (min-width: 900px) {
      grid-template-columns: 1fr 1fr;
      align-items: center;
      column-gap: 4rem;

      h2,
      .line,
      p {
        grid-column: 1;
      }

      &::after {
        content: "";
        grid-column: 2;
        grid-row: 1 / span 3;
        background: url("../assets/pictures/artquake-gebouw.avif") center / cover no-repeat;
        border-radius: var(--br-lg);
        min-height: 25rem;
        align-self: stretch;
      }
    }
  }

  &:nth-of-type(4) {
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
    h2:before {
      content: var(--t-3);
      color: var(--c-pseudo-light);
    }

    video {
      max-width: 20rem;
      margin-top: 2rem;
    }

    .video-text {
      display: grid;
      gap: 1.5rem;
    }

    @media (min-width: 900px) {
      grid-template-columns: 1fr 1fr;
      align-items: center;
      column-gap: 4rem;

      .video-container {
        align-self: center;
      }

      video {
        max-width: 100%;
        margin-top: 0;
        border-radius: var(--br-lg);
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

@keyframes scrollLine {
  0% {
    transform: scaleY(0);
    transform-origin: top;
    opacity: 1;
  }
  50% {
    transform: scaleY(1);
    transform-origin: top;
    opacity: 1;
  }
  51% {
    transform: scaleY(1);
    transform-origin: bottom;
  }
  100% {
    transform: scaleY(0);
    transform-origin: bottom;
    opacity: 0.3;
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
