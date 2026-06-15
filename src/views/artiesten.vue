<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Spinner from "../components/spinner.vue";

const PER_PAGE = 8;

const artiesten = ref([]);
const isLoading = ref(true);
const searchQuery = ref("");
const activeFilter = ref("Alle");
const currentPage = ref(1);
const selectedArtist = ref(null);

const fetchArtiesten = async () => {
  try {
    const q = query(collection(db, "artiesten"), orderBy("naam", "asc"));
    const snapshot = await getDocs(q);
    artiesten.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Fout bij ophalen artiesten:", error);
  } finally {
    isLoading.value = false;
  }
};

const setFilter = (filter) => {
  activeFilter.value = filter;
  currentPage.value = 1;
};

const filtered = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return artiesten.value.filter((a) => {
    const matchesSearch = a.naam.toLowerCase().includes(q);
    const matchesType = activeFilter.value === "Alle" || a.type === activeFilter.value;
    return matchesSearch && matchesType;
  });
});

const totalPages = computed(() => Math.ceil(filtered.value.length / PER_PAGE));

const paginated = computed(() => {
  const start = (currentPage.value - 1) * PER_PAGE;
  return filtered.value.slice(start, start + PER_PAGE);
});

const onSearch = () => { currentPage.value = 1; };

const openArtist = (artiest) => {
  selectedArtist.value = artiest;
  document.body.style.overflow = "hidden";
};

const closeArtist = () => {
  selectedArtist.value = null;
  document.body.style.overflow = "";
};

const onKeydown = (e) => { if (e.key === "Escape") closeArtist(); };

onMounted(() => {
  fetchArtiesten();
  window.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown);
  document.body.style.overflow = "";
});
</script>

<template>
  <main class="main-artiesten">
    <section>
      <span class="label">Artiesten</span>
      <h2 class="h2-font">De <em>makers</em> van nu</h2>
      <span class="line"></span>
      <p>
        Artquake bestaat uit talloze getalenteerde artiesten, die zowel op het
        podium staan als hun kunst tonen via exposities. Op deze pagina kun je
        onze artiesten vinden en meer over ze te weten komen.
        <br /><br />
        Op zoek naar jong, aanstormend talent voor een optreden, evenement,
        festival, feest of andere bijzondere gelegenheid, neem contact met ons
        op!
      </p>

      <label class="input-wrapper">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Zoek een artiest..."
          aria-label="Zoek een artiest"
          @input="onSearch"
        />
      </label>

      <ul>
        <li>
          <button :class="{ active: activeFilter === 'Alle' }" @click="setFilter('Alle')">
            <span>✦</span> Alle
          </button>
        </li>
        <li>
          <button :class="{ active: activeFilter === 'Podium' }" @click="setFilter('Podium')">
            <span>🎤</span> Podium
          </button>
        </li>
        <li>
          <button :class="{ active: activeFilter === 'Expo' }" @click="setFilter('Expo')">
            <span>🖼</span> Expo
          </button>
        </li>
      </ul>
    </section>

    <section>
      <Spinner v-if="isLoading" label="" />

      <template v-else-if="paginated.length > 0">
        <article
          v-for="artiest in paginated"
          :key="artiest.id"
          @click="openArtist(artiest)"
          role="button"
          tabindex="0"
          @keydown.enter="openArtist(artiest)"
        >
          <div class="img-wrapper">
            <div class="img-skeleton"></div>
            <img
              :src="artiest.imageUrl || '/pictures/placeholder.png'"
              :alt="artiest.naam"
              loading="lazy"
              width="300"
              height="300"
              @load="e => e.target.closest('.img-wrapper').classList.add('loaded')"
            />
          </div>
          <p>{{ artiest.naam }}</p>
          <small>{{ artiest.type }}</small>
        </article>
      </template>

      <p v-else>Geen artiesten gevonden.</p>
    </section>

    <nav v-if="totalPages > 1" aria-label="Paginering">
      <button class="btn" :disabled="currentPage === 1" @click="currentPage--">← Vorige</button>
      <button class="btn" :disabled="currentPage === totalPages" @click="currentPage++">Volgende →</button>
    </nav>
  </main>

  <!-- Artist detail popup -->
  <Teleport to="body">
    <Transition name="popup">
      <div v-if="selectedArtist" class="popup-backdrop" @click.self="closeArtist">
        <div class="popup">
          <button class="popup-close" @click="closeArtist" aria-label="Sluiten">✕</button>
          <img
            :src="selectedArtist.imageUrl || '/pictures/placeholder.png'"
            :alt="selectedArtist.naam"
            class="popup-img"
          />
          <div class="popup-info">
            <span class="label">{{ selectedArtist.type }}</span>
            <h3 class="h3-font">{{ selectedArtist.naam }}</h3>
            <span class="line"></span>
            <p v-if="selectedArtist.beschrijving">{{ selectedArtist.beschrijving }}</p>
            <p v-else class="no-desc">Geen beschrijving beschikbaar.</p>
            <div class="popup-actions">
              <a
                v-if="selectedArtist.instagram"
                :href="selectedArtist.instagram"
                target="_blank"
                rel="noopener"
                class="social-link"
                aria-label="Instagram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                Instagram
              </a>
              <a
                v-if="selectedArtist.tiktok"
                :href="selectedArtist.tiktok"
                target="_blank"
                rel="noopener"
                class="social-link"
                aria-label="TikTok"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.2 8.2 0 004.79 1.53V6.75a4.85 4.85 0 01-1.02-.06z"/></svg>
                TikTok
              </a>
              <router-link to="/contact" @click="closeArtist" class="btn btn-outline popup-contact">
                Contact opnemen
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
section {
  &:nth-of-type(1) {
    ul {
      list-style: none;
      display: inline-flex;
      width: fit-content;
      background: hsla(0, 0%, 100%, 0.05);
      border: 1px solid hsla(0, 0%, 100%, 0.1);
      border-radius: 999px;
      padding: 0.3rem;
      gap: 0.15rem;

      li button {
        background: transparent;
        border: none;
        border-radius: 999px;
        padding: 0.5rem 1.1rem;
        color: hsla(0, 0%, 100%, 0.5);
        font-size: 0.88rem;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.4rem;
        transition: background 0.2s ease, color 0.2s ease;
        font-family: var(--f-family-jost);

        span { font-size: 0.85rem; }

        &:hover {
          color: var(--c-light);
          background: hsla(0, 0%, 100%, 0.07);
        }

        &.active {
          background: var(--c-primary);
          color: var(--c-light);
          box-shadow: 0 2px 8px hsla(272, 84%, 45%, 0.4);
        }
      }
    }

    label {
      position: relative;
      display: block;

      input {
        background: hsla(0, 0%, 100%, 0.06);
        border: 1px solid hsla(0, 0%, 100%, 0.12);
        border-radius: 999px;
        padding: 0.75rem 3rem 0.75rem 1.25rem;
        color: var(--c-light);
        font-size: 0.95rem;
        transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;

        &::placeholder { color: hsla(0, 0%, 100%, 0.35); }

        &:focus {
          outline: none;
          border-color: var(--c-primary);
          background: hsla(0, 0%, 100%, 0.09);
          box-shadow: 0 0 0 3px hsla(272, 84%, 45%, 0.2);
        }
      }

      &::after {
        content: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M18.319 14.4326C20.7628 11.2941 20.542 6.75347 17.6569 3.86829C14.5327 0.744098 9.46734 0.744098 6.34315 3.86829C3.21895 6.99249 3.21895 12.0578 6.34315 15.182C9.22833 18.0672 13.769 18.2879 16.9075 15.8442C16.921 15.8595 16.9351 15.8745 16.9497 15.8891L21.1924 20.1317C21.5829 20.5223 22.2161 20.5223 22.6066 20.1317C22.9971 19.7412 22.9971 19.1081 22.6066 18.7175L18.364 14.4749C18.3493 14.4603 18.3343 14.4462 18.319 14.4326ZM16.2426 5.28251C18.5858 7.62565 18.5858 11.4246 16.2426 13.7678C13.8995 16.1109 10.1005 16.1109 7.75736 13.7678C5.41421 11.4246 5.41421 7.62565 7.75736 5.28251C10.1005 2.93936 13.8995 2.93936 16.2426 5.28251Z' fill='white'/%3E%3C/svg%3E");
        position: absolute;
        top: 50%;
        right: 1rem;
        transform: translateY(-50%);
        opacity: 0.5;
        pointer-events: none;
        line-height: 0;
      }
    }
  }
}

section:nth-of-type(2) {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: start;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

article {
  text-align: center;
  display: grid;
  grid-template-rows: auto auto auto;
  gap: 0;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: fadeInUp linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 35%;

  &:hover {
    transform: translateY(-8px) rotate(1deg);

    img { box-shadow: 0 12px 32px hsla(272, 84%, 45%, 0.3); }
  }

  .img-wrapper {
    position: relative;
    width: 100%;
    max-width: 25rem;
    margin-bottom: 0.75rem;
  }

  .img-skeleton {
    position: absolute;
    inset: 0;
    border-radius: var(--br);
    background: linear-gradient(
      90deg,
      var(--c-bg-alt) 25%,
      hsla(0, 0%, 20%, 0.8) 50%,
      var(--c-bg-alt) 75%
    );
    background-size: 200% 100%;
    animation: shimmer-skeleton 1.4s infinite;
    z-index: 1;
  }

  img {
    width: 100%;
    object-fit: cover;
    aspect-ratio: 1/1;
    border-radius: var(--br);
    transition: opacity 0.4s ease, box-shadow 0.3s ease;
    opacity: 0;
    display: block;
  }

  .img-wrapper.loaded {
    .img-skeleton { display: none; }
    img { opacity: 1; }
  }

  p {
    max-width: none;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: 0.2rem;
  }

  small {
    color: var(--c-grey);
    font-size: 0.8rem;
  }
}

nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
}

/* Popup */
.popup-backdrop {
  position: fixed;
  inset: 0;
  background: hsla(0, 0%, 0%, 0.75);
  backdrop-filter: blur(6px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.popup {
  background: var(--c-bg-alt);
  border: 1px solid hsla(0, 0%, 100%, 0.1);
  border-radius: var(--br-lg);
  max-width: 52rem;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  position: relative;
  max-height: 90vh;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    max-height: 95dvh;
    overflow-y: auto;
  }
}

.popup-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: hsla(0, 0%, 0%, 0.5);
  color: var(--c-light);
  border: none;
  border-radius: 50%;
  width: 2.2rem;
  height: 2.2rem;
  font-size: 0.9rem;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;

  &:hover { background: var(--c-primary); }
}

.popup-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  max-height: 28rem;
}

.popup-info {
  padding: 2.5rem 2rem;
  display: grid;
  gap: 1rem;
  align-content: start;
  overflow-y: auto;
}

.no-desc { color: var(--c-grey); font-style: italic; }

.popup-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  margin-top: 0.5rem;
}

.social-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: 1px solid hsla(0, 0%, 100%, 0.15);
  background: hsla(0, 0%, 100%, 0.06);
  color: var(--c-light);
  text-decoration: none;
  font-size: 0.9rem;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: hsla(0, 0%, 100%, 0.12);
    border-color: hsla(0, 0%, 100%, 0.3);
  }
}

.popup-contact {
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
}

/* Popup transition */
.popup-enter-active,
.popup-leave-active {
  transition: opacity 0.25s ease;

  .popup { transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;

  .popup { transform: scale(0.92); }
}

@media (min-width: 900px) {
  .main-artiesten {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: start;
    padding-top: calc(var(--nav-height) + 50px);
  }

  .main-artiesten section:nth-of-type(1) {
    position: sticky;
    top: calc(var(--nav-height) + 30px);
    padding: 4rem 2rem 4rem max(1.5rem, calc((100vw / 2 - 37.5rem)));
    height: calc(100vh - var(--nav-height) - 45px);
    overflow-y: auto;
    scrollbar-width: none;
    align-content: start;
  }

  .main-artiesten section:nth-of-type(2) {
    padding: 4rem max(1.5rem, calc((100vw / 2 - 37.5rem))) 4rem 2rem;
    min-height: 100vh;
  }

  .img-wrapper {
    max-width: 100%;
  }

  .popup {
    max-height: 80vh;
  }
}
</style>
