<script setup>
import { ref, onMounted, watch } from "vue"; // Watch toegevoegd
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";
import "../assets/stylesheets/nav.css";

const isOpen = ref(false);
const isLoggedIn = ref(false);
const router = useRouter();

// Check of de gebruiker is ingelogd
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user;
  });
});

// Watcher om de rest van de pagina 'inert' te maken en scrollen te blokkeren
watch(isOpen, (newValue) => {
  const mainContent = document.querySelector("main"); // Of de div die je content bevat (bijv. #app)

  if (newValue) {
    document.body.style.overflow = "hidden";
    // We zorgen dat alles BEHALVE de header/nav inert wordt
    // Let op: je main content moet idealiter in een apart element zitten naast de header
    if (mainContent) mainContent.setAttribute("inert", "");
  } else {
    document.body.style.overflow = "";
    if (mainContent) mainContent.removeAttribute("inert");
  }
});

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const handleLogout = async () => {
  try {
    await signOut(auth);
    isOpen.value = false;
    router.push("/login");
  } catch (error) {
    console.error("Fout bij uitloggen:", error);
  }
};
</script>

<template>
  <header>
    <nav>
      <a href="/">
        <img src="../assets/pictures/logo.png" alt="Logo van Artquake" />
      </a>
      <button @click="toggleMenu" :aria-expanded="isOpen">
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
        <li><router-link to="/" @click="isOpen = false">Home</router-link></li>
        <li>
          <router-link to="/organisatie" @click="isOpen = false"
            >Organisatie</router-link
          >
        </li>
        <li>
          <router-link to="/artiesten" @click="isOpen = false"
            >Artiesten</router-link
          >
        </li>
        <li>
          <router-link to="/crew" @click="isOpen = false">Crew</router-link>
        </li>
        <li>
          <router-link to="/agenda" @click="isOpen = false">Agenda</router-link>
        </li>
        <li>
          <router-link to="/activiteiten" @click="isOpen = false"
            >Activiteiten</router-link
          >
        </li>
        <li>
          <router-link to="/reserveren" @click="isOpen = false"
            >Reserveren</router-link
          >
        </li>
        <li>
          <a href="https://www.instagram.com/artquake.westfriesland/"
            >Instagram</a
          >
          <a
            href="/"
            style="cursor: pointer"
            v-if="isLoggedIn"
            @click="handleLogout"
            >Uitloggen</a
          >
          <router-link v-else to="/Login" @click="isOpen = false"
            >Login</router-link
          >
          <a v-if="isLoggedIn" href="/dashboard">Dashboard</a>
          <a href="https://www.facebook.com/artquake.westfriesland/"
            >Facebook</a
          >
        </li>
      </ul>
    </nav>
  </header>
</template>
