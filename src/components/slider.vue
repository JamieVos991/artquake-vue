<script setup>
import { ref } from "vue";

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
  folder: {
    type: String,
    default: "hero",
  },
});

const slider = ref(null);

const scrollSlider = (direction) => {
  if (!slider.value) return;
  const scrollAmount = direction === "left" ? -300 : 300;
  slider.value.scrollBy({ left: scrollAmount, behavior: "smooth" });
};

const getImageUrl = (name) => {
  return new URL(`../assets/pictures/${props.folder}/${name}`, import.meta.url)
    .href;
};
</script>

<template>
  <div class="slider-wrapper">
    <button
      @click="scrollSlider('left')"
      class="nav prev"
      aria-label="Vorige foto"
    >
      <img src="../assets/svg/chevron-left.svg" alt="Vorige" />
    </button>

    <div class="slider" ref="slider">
      <img
        v-for="(img, index) in images"
        :key="index"
        :src="getImageUrl(img)"
        :alt="'Impressie foto ' + (index + 1)"
        loading="lazy"
      />
    </div>

    <button
      @click="scrollSlider('right')"
      class="nav next"
      aria-label="Volgende foto"
    >
      <img src="../assets/svg/chevron-right.svg" alt="Volgende" />
    </button>
  </div>
</template>

<style scoped>
.slider-wrapper {
  position: relative;
  margin-top: 2rem;
  width: 100%;
}

.slider {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  padding-bottom: 1rem;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
}

.slider img {
  flex: 0 0 80%;
  max-width: 80%;
  height: 300px;
  object-fit: cover;
  border-radius: var(--br-lg);
  scroll-snap-align: start;
}

.nav {
  background: var(--c-primary);
  border-radius: var(--br);
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  padding: 0.5rem 0.8rem;
  cursor: pointer;
  opacity: 0.9;
  z-index: 5;
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav img {
  width: 20px;
  height: 20px;
}

.prev {
  left: 0;
}
.next {
  right: 10px;
}

@media (min-width: 900px) {
  .slider img {
    flex: 0 0 40%;
    max-width: 40%;
  }
}
</style>
