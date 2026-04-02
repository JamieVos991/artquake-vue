<script setup>
import { ref } from "vue";
import "../assets/stylesheets/nav.css";

const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <header>
    <nav>
      <a href="/">
        <img src="../assets/pictures/logo.png" alt="Logo van Artquake" />
      </a>
      <button @click="toggleMenu">
        <svg
          v-if="!isOpen"
          aria-label="Open het menu"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 5C11.4477 5 11 5.44772 11 6C11 6.55228 11.4477 7 12 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H12Z"
            fill="currentColor"
          />
          <path
            d="M7 12C7 11.4477 7.44772 11 8 11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H8C7.44772 13 7 12.5523 7 12Z"
            fill="currentColor"
          />
          <path
            d="M3 18C3 17.4477 3.44772 17 4 17H12C12.5523 17 13 17.4477 13 18C13 18.5523 12.5523 19 12 19H4C3.44772 19 3 18.5523 3 18Z"
            fill="currentColor"
          />
        </svg>

        <svg
          v-else
          style="rotate: 45deg"
          aria-label="Sluit het menu"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 4C11.4477 4 11 4.44772 11 5V11H5C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13H11V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V13H19C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11H13V5C13 4.44772 12.5523 4 12 4Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <ul v-if="isOpen" class="ul-menu">
        <li><a href="/">Home</a></li>
        <li><a href="/organisatie">Organisatie</a></li>
        <li><a href="/artiesten">Artiesten</a></li>
        <li><a href="/crew">Crew</a></li>
        <li><a href="/agenda">Agenda</a></li>
        <li><a href="/activiteiten">Activiteiten</a></li>
        <li><a href="/reserveren">Reserveren</a></li>
      </ul>
    </nav>
  </header>
</template>
