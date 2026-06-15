<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter, useRoute } from "vue-router";
import "../assets/stylesheets/nav.css";

const isOpen = ref(false);
const isLoggedIn = ref(false);
const router = useRouter();
const route = useRoute();

const ulRef = ref(null);
const bubble = ref({ left: 0, width: 0, opacity: 0 });

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user;
  });
  nextTick(() => {
    moveBubbleToActive();
    setTimeout(moveBubbleToActive, 150);
  });
});

watch(() => route.path, () => nextTick(() => moveBubbleToActive()));

watch(isOpen, (newValue) => {
  const mainContent = document.querySelector("main");
  if (newValue) {
    document.body.style.overflow = "hidden";
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

const moveBubbleTo = (el) => {
  if (!ulRef.value || !el) return;
  const ulRect = ulRef.value.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  bubble.value = {
    left: elRect.left - ulRect.left,
    width: elRect.width,
    opacity: 1,
  };
};

const moveBubbleToActive = () => {
  if (!ulRef.value) return;
  const active = ulRef.value.querySelector("a.router-link-active");
  if (active) moveBubbleTo(active);
  else bubble.value.opacity = 0;
};

const onLinkEnter = (e) => moveBubbleTo(e.currentTarget);
const onNavLeave = () => moveBubbleToActive();
</script>

<template>
  <header>
    <img src="../assets/pictures/artquake-logo.avif" alt="Logo van Artquake" />
    <nav>
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

      <ul
        ref="ulRef"
        :class="['ul-menu', { 'is-open': isOpen }]"
        @mouseleave="onNavLeave"
      >
        <div
          class="nav-bubble"
          :style="{
            left: bubble.left + 'px',
            width: bubble.width + 'px',
            opacity: bubble.opacity,
          }"
        />

        <li><router-link to="/" @mouseenter="onLinkEnter" @click="isOpen = false">Home</router-link></li>
        <li><router-link to="/activiteiten" @mouseenter="onLinkEnter" @click="isOpen = false">Activiteiten</router-link></li>
        <li><router-link to="/agenda" @mouseenter="onLinkEnter" @click="isOpen = false">Agenda</router-link></li>
        <li><router-link to="/artiesten" @mouseenter="onLinkEnter" @click="isOpen = false">Artiesten</router-link></li>
        <li><router-link to="/crew" @mouseenter="onLinkEnter" @click="isOpen = false">Crew</router-link></li>
        <li><router-link to="/reserveren" @mouseenter="onLinkEnter" @click="isOpen = false">Reserveren</router-link></li>
        <li><router-link to="/contact" @mouseenter="onLinkEnter" @click="isOpen = false">Contact</router-link></li>
        <li>
          <a
            style="cursor: pointer"
            v-if="isLoggedIn"
            @click="handleLogout"
            @mouseenter="onLinkEnter"
            >Uitloggen</a
          >
          <router-link v-else to="/Login" @click="isOpen = false" @mouseenter="onLinkEnter">Login</router-link>
          <a v-if="isLoggedIn" href="/dashboard" @mouseenter="onLinkEnter">Dashboard</a>
        </li>
      </ul>
    </nav>
  </header>
</template>
