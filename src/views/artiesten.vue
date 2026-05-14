<script setup>
import { ref, computed, onMounted } from "vue";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Spinner from "../components/spinner.vue";

const PER_PAGE = 8;

const artiesten = ref([]);
const isLoading = ref(true);
const searchQuery = ref("");
const activeFilter = ref("Alle");
const currentPage = ref(1);

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

const onSearch = () => {
  currentPage.value = 1;
};

onMounted(fetchArtiesten);
</script>

<template>
  <main>
    <section>
      <span class="label">Artiesten</span>
      <h2 class="h2-font">De <em>makers</em> van nu</h2>
      <p>
        Artquake bestaat uit talloze getalenteerde artiesten, die zowel op het
        podium staan als hun kunst tonen via exposities. Op deze pagina kun je
        onze artiesten vinden en meer over ze te weten komen.
        <br /><br />
        Op zoek naar jong, aanstormend talent voor een optreden, evenement,
        festival, feest of andere bijzondere gelegenheid, neem contact met ons
        op!
      </p>

      <ul>
        <li v-for="filter in ['Alle', 'Podium', 'Expo']" :key="filter">
          <button
            class="btn"
            :class="{ active: activeFilter === filter }"
            @click="setFilter(filter)"
          >
            {{ filter }}
          </button>
        </li>
      </ul>

      <label class="input-wrapper">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Zoek een artiest..."
          aria-label="Zoek een artiest"
          @input="onSearch"
        />
      </label>
    </section>

    <section>
      <Spinner v-if="isLoading" label="Artiesten ophalen..." />

      <template v-else-if="paginated.length > 0">
        <article v-for="artiest in paginated" :key="artiest.id">
          <img
            :src="artiest.imageUrl || '/pictures/placeholder.png'"
            :alt="artiest.naam"
            loading="lazy"
            width="300"
            height="300"
          />
          <p>{{ artiest.naam }}</p>
          <small>{{ artiest.type }}</small>
        </article>
      </template>

      <p v-else>Geen artiesten gevonden.</p>
    </section>

    <nav v-if="totalPages > 1" aria-label="Paginering">
      <button
        class="btn"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        ← Vorige
      </button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button
        class="btn"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        Volgende →
      </button>
    </nav>
  </main>
</template>

<style scoped>
section {
  &:nth-of-type(1) {
    ul {
      list-style: none;
      display: flex;
      gap: 1rem;
    }

    .btn.active {
      background: var(--c-secondary);
    }

    label {
      position: relative;

      &::after {
        content: url(../assets/svg/search.svg);
        height: 100%;
        position: absolute;
        top: 0.3rem;
        right: 0.5rem;
        display: flex;
        align-items: center;
      }
    }
  }
}

section:nth-of-type(2) {
  width: 100%;
  display: flex;
  place-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

article {
  text-align: center;
  display: grid;
  gap: 0.5rem;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: fadeInUp linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 35%;

  &:hover {
    transform: translateY(-8px) rotate(1deg);
  }

  img {
    width: 100%;
    object-fit: cover;
    aspect-ratio: 1/1;
    max-width: 25rem;
    border-radius: var(--br);
  }

  small {
    color: var(--c-grey);
  }
}

nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
}

@media (min-width: 900px) {
  section:nth-of-type(2) {
    gap: 2rem;
  }

  article img {
    max-width: 16rem;
  }
}
</style>
