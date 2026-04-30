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
    events.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
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
    <section>
      <label class="label">Agenda</label>
      <h2 class="h2-font">Aankomende <em>events</em> van Artquake</h2>
      <p>
        Hieronder vind je een overzicht van alle aankomende evenementen en
        activiteiten die we organiseren. Volg ons op Instagram voor de verdere
        inhoud per activiteit en het laatste nieuws!
      </p>

      <Spinner v-if="isLoading" label="Events ophalen..." />

      <ul v-else-if="events.length > 0">
        <li
          v-for="event in events"
          :key="event.id"
          :style="{
            '--band-date': `'${formatDisplayDate(event.date)}'`,
            '--band-image': `url(${event.imageUrl || 'default-image.png'})`,
          }"
        >
          <div>
            <img
              :src="event.imageUrl || 'default-image.png'"
              alt="Event image"
            />
          </div>
          <div>
            <p>{{ event.band }}</p>
            <p>{{ event.place }}</p>
            <p>{{ event.startTime }} - {{ event.endTime }}</p>
            <!-- <p>{{ event.type }}</p> -->
          </div>
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

/* Je bestaande styles */
li {
  background-size: cover;
  border-radius: var(--br);
  padding: 1.5rem;
  min-height: 10rem;
  margin-top: 4rem;
  background-color: #363636;
  position: relative;
  display: flex;
  list-style: none;
  align-items: center;
  z-index: 0;

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
