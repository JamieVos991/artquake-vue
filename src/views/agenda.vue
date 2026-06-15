<script setup>
import { ref, onMounted } from "vue";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Spinner from "../components/spinner.vue";

const events = ref([]);
const isLoading = ref(true);

const fetchEvents = async () => {
  try {
    const q = query(collection(db, "agenda"), orderBy("date", "asc"));
    const querySnapshot = await getDocs(q);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allEvents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    events.value = allEvents.filter((event) => {
      if (!event.date) return false;
      const eventDate = new Date(event.date);
      return eventDate >= today;
    });
  } catch (error) {
    console.error("Fout bij ophalen events:", error);
  } finally {
    isLoading.value = false;
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
    <section :class="{ 'is-empty': !isLoading && events.length === 0 }">
      <span class="label">Agenda</span>
      <h2 class="h2-font">Aankomende <em>events</em> van Artquake</h2>
      <span class="line"></span>
      <p>
        Hieronder vind je een overzicht van alle aankomende evenementen en
        activiteiten die we organiseren. Volg ons op Instagram voor de verdere
        inhoud per activiteit en het laatste nieuws!
      </p>

      <Spinner v-if="isLoading" label="" />

      <ul v-else-if="events.length > 0">
        <li
          v-for="event in events"
          :key="event.id"
          :style="{
            '--band-date': `'${formatDisplayDate(event.date)}'`,
            '--band-image': `url(${event.imageUrl || 'default-image.png'})`,
          }"
        >
          <figure>
            <img
              :src="event.imageUrl || 'default-image.png'"
              alt="Event image"
            />
          </figure>
          <div>
            <p>{{ event.band }}</p>
            <p>{{ event.place }}</p>
            <p>{{ event.startTime }} - {{ event.endTime }}</p>
          </div>
        </li>
      </ul>

      <div v-else class="empty-state">
        <span class="empty-icon">🎭</span>
        <h3 class="h3-font">Geen evenementen gepland</h3>
        <p>Op dit moment staan er geen activiteiten in de agenda. Volg ons op Instagram voor het laatste nieuws!</p>
        <a href="https://www.instagram.com/artquake_nl" target="_blank" rel="noopener" class="btn">Volg ons op Instagram</a>
      </div>
    </section>
  </main>
</template>

<style scoped>
section {
  padding-bottom: 3rem;
  min-height: 75vh;
  align-content: start;
}

section.is-empty {
  > *:not(.empty-state) {
    filter: blur(6px);
    opacity: 0.4;
    pointer-events: none;
    user-select: none;
  }

  .empty-state {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    width: min(36rem, 90vw);
    padding: 4rem 3rem;
  }
}

section {
  position: relative;
}

.empty-state {
  display: grid;
  gap: 1.2rem;
  padding: 3rem 2rem;
  border: 1px solid hsla(0, 0%, 100%, 0.12);
  border-radius: var(--br-lg);
  background: hsla(0, 0%, 8%, 0.9);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  text-align: center;
  place-items: center;

  .empty-icon {
    font-size: 3.5rem;
    line-height: 1;
  }

  p {
    color: var(--c-grey);
    max-width: 28rem;
  }
}

ul {
  width: 100%;
  max-width: 55rem;
  padding: 0;
}

li {
  background-size: cover;
  border-radius: var(--br);
  padding: 1.5rem;
  min-height: 10rem;
  margin-top: 4rem;
  background-color: var(--c-bg-alt);
  border-left: 3px solid var(--c-secondary);
  position: relative;
  display: flex;
  list-style: none;
  align-items: center;
  z-index: 0;
  animation: fadeInUp linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 40%;

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

  img {
    width: 7rem;
    border-radius: var(--br);
    grid-area: picture;
    object-fit: cover;
    padding-right: 1rem;
    z-index: 10;

    @media (min-width: 900px) {
      width: 10rem;
    }
  }

  p {
    z-index: 10;
    font-size: 1.2rem;
  }

  p:nth-of-type(1) {
    grid-area: band;
    font-size: 1.2rem;
    font-weight: 700;
  }
  p:nth-of-type(2) {
    grid-area: place;
    font-weight: 100;
    font-size: 1rem;
  }
  p:nth-of-type(3) {
    grid-area: time;
    font-size: 1rem;
  }
  p:nth-of-type(4) {
    grid-area: type;
  }
}
</style>
