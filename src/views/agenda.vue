<script setup>
import { ref, onMounted } from "vue";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const events = ref([]);
const isLoading = ref(true); // Start op true

const fetchEvents = async () => {
  try {
    const q = query(collection(db, "agenda"), orderBy("date", "asc"));
    const querySnapshot = await getDocs(q);
    events.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Fout bij ophalen events:", error);
  } finally {
    isLoading.value = false; // Stop de spinner, ook als er een fout is
  }
};

onMounted(fetchEvents);

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "";
  const options = { day: "numeric", month: "long" };
  return new Date(dateStr).toLocaleDateString("nl-NL", options);
};
</script>

<template>
  <main>
    <section>
      <label class="label">Agenda</label>
      <h2 class="h2-font">Aankomende events van Artquake.</h2>
      <p>
        Hieronder vind je een overzicht van alle aankomende evenementen en
        activiteiten die we organiseren. Volg ons op Instagram voor de verdere
        inhoud per activiteit en het laatste nieuws!
      </p>

      <div v-if="isLoading" class="loader-container">
        <div class="spinner"></div>
        <p>Events laden...</p>
      </div>

      <ul v-else-if="events.length > 0">
        <li
          v-for="event in events"
          :key="event.id"
          :style="{
            '--band-date': `'${formatDisplayDate(event.date)}'`,
            '--band-image': `url(${event.imageUrl || 'default-image.png'})`,
          }"
        >
          <!-- <img :src="event.imageUrl || 'default-image.png'" alt="Event image" /> -->
          <p>{{ event.band }}</p>
          <p>{{ event.place }}</p>
          <p>{{ event.startTime }} - {{ event.endTime }}</p>
          <p>{{ event.type }}</p>
          <div></div>
        </li>
      </ul>

      <p v-else>Er zijn momenteel geen evenementen gepland.</p>
    </section>
  </main>
</template>

<style scoped>
section {
  padding-bottom: 3rem;
}
/* Spinner Styles */
.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: white; /* Of je accentkleur */
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Je bestaande styles */
li {
  background-image: var(--band-image);
  background-size: cover;
  border-radius: var(--br);
  padding: 1.5rem 1rem 1rem 1rem;
  min-height: 10rem;
  margin-top: 4rem;
  position: relative;
  display: grid;
  gap: 0.5rem;
  grid-template-areas:
    "band band band"
    "place place place"
    "time time type";

  &::before {
    content: var(--band-date);
    width: 50%;
    height: 3rem;
    background: red;
    position: absolute;
    display: grid;
    place-content: center;
    background: var(--c-secondary);
    border-radius: var(--br);
    font-size: 200%;
    top: -30px;
    left: 50%;
    transform: translate(-50%, -25%);
    text-transform: uppercase;
    font-weight: 700;
    z-index: 2;
    rotate: -1.5deg;
  }

  div {
    background: hsl(0, 0%, 0%, 0.6);
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    position: absolute;
  }

  img {
    width: 6rem;
    border-radius: var(--br);
    grid-area: picture;
    object-fit: cover;
  }

  p {
    z-index: 3;
    font-size: 1.2rem;
  }

  p:nth-of-type(1) {
    grid-area: band;
    font-size: 1.6rem;
    font-weight: 700;
  }
  p:nth-of-type(2) {
    grid-area: place;
  }
  p:nth-of-type(3) {
    grid-area: time;
  }
  p:nth-of-type(4) {
    grid-area: type;
  }
}
</style>
