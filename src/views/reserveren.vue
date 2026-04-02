<script setup>
import { ref, computed, watch } from "vue";
import emailjs from "@emailjs/browser";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

// --- Firebase config (Ongewijzigd) ---
const firebaseConfig = {
  apiKey: "AIzaSyDlmqdPTEsJOcbwbjL1Luy51CnE52slGfo",
  authDomain: "artquake-6fceb.firebaseapp.com",
  projectId: "artquake-6fceb",
  storageBucket: "artquake-6fceb.firebasestorage.app",
  messagingSenderId: "202630612295",
  appId: "1:202630612295:web:68bcc60a9cb14425f07862",
  measurementId: "G-N5F8LC5D7V",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = ref({
  name: "",
  email: "",
  studio: "",
  date: "",
  startTime: "",
  endTime: "",
  company: "",
});

const loading = ref(false);
const reservedPeriods = ref([]);

// --- Generate tijden ---
function generateTimes() {
  const times = [];
  let hour = 8,
    minute = 30;
  while (hour < 21 || (hour === 21 && minute <= 30)) {
    times.push(
      `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
    );
    minute += 30;
    if (minute === 60) {
      minute = 0;
      hour++;
    }
  }
  return times;
}
const allTimes = generateTimes();

// --- Datum helpers ---
const pad = (n) => String(n).padStart(2, "0");
const today = new Date();
const minDate = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(
  today.getDate()
)}`;

async function fetchReservedPeriods() {
  if (!form.value.date || !form.value.studio) return [];
  const q = query(
    collection(db, "reservations"),
    where("date", "==", form.value.date),
    where("studio", "==", form.value.studio)
  );
  const snapshot = await getDocs(q);
  const periods = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    periods.push({ start: data.startTime, end: data.endTime });
  });
  return periods;
}

watch([() => form.value.date, () => form.value.studio], async () => {
  reservedPeriods.value = await fetchReservedPeriods();
  form.value.startTime = "";
  form.value.endTime = "";
});

// --- Helper om te checken of een tijdstip in het verleden ligt (vandaag) ---
function isPastTime(t) {
  if (form.value.date !== minDate) return false;
  const [h, m] = t.split(":").map(Number);
  const now = new Date();
  return h * 60 + m <= now.getHours() * 60 + now.getMinutes();
}

// --- Start tijden: Toon alles, disable gereserveerd of verleden ---
// --- Start tijden: Toon alles, markeer gereserveerd/verleden ---
const startTimes = computed(() => {
  return allTimes.map((t) => {
    const isReserved = reservedPeriods.value.some(
      (p) => t >= p.start && t < p.end
    );
    return {
      time: t,
      disabled: isReserved || isPastTime(t),
    };
  });
});

// --- End tijden: Verwijder onmogelijke opties, laat alleen aansluitende blokken zien ---
const endTimes = computed(() => {
  if (!form.value.startTime) return [];

  const availableEndTimes = [];

  // Zoek de eerstvolgende starttijd van een bestaande reservering na de gekozen starttijd
  const nextReservation = reservedPeriods.value
    .filter((p) => p.start > form.value.startTime)
    .sort((a, b) => a.start.localeCompare(b.start))[0];

  const limitTime = nextReservation ? nextReservation.start : "23:59";

  for (const t of allTimes) {
    // 1. Tijd moet na de starttijd liggen
    if (t <= form.value.startTime) continue;

    // 2. Tijd mag niet verder gaan dan het begin van de volgende reservering
    if (t > limitTime) break;

    // 3. Controleer of de tijd zelf in een reservering valt (voor de zekerheid)
    const isInsideReserved = reservedPeriods.value.some(
      (p) => t > p.start && t <= p.end
    );

    if (!isInsideReserved) {
      availableEndTimes.push({
        time: t,
        disabled: false,
      });
    }
  }

  return availableEndTimes;
});

const duration = computed(() => {
  if (!form.value.startTime || !form.value.endTime) return "";
  const [sh, sm] = form.value.startTime.split(":").map(Number);
  const [eh, em] = form.value.endTime.split(":").map(Number);
  const diff = (eh * 60 + em - (sh * 60 + sm)) / 60;
  return `${diff} uur`;
});

const handleSubmit = async () => {
  if (form.value.company) return;
  loading.value = true;
  try {
    await emailjs.send(
      "service_uqngj85",
      "template_b6fh6xq",
      {
        name: form.value.name,
        email: form.value.email,
        studio: form.value.studio,
        date: form.value.date,
        start_time: form.value.startTime,
        end_time: form.value.endTime,
        duration: duration.value,
      },
      "Jrzv7YJlfecQ-BptO"
    );

    await addDoc(collection(db, "reservations"), {
      ...form.value,
      createdAt: new Date(),
    });

    alert("Reservering verstuurd! 📩");
    form.value = {
      name: "",
      email: "",
      studio: "",
      date: "",
      startTime: "",
      endTime: "",
      company: "",
    };
    reservedPeriods.value = [];
  } catch (err) {
    console.error(err);
    alert("Er ging iets mis 😬");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <main>
    <section>
      <label class="label" for="">Reserveren</label>
      <h2 class="h2-font">Reserveer hier jouw studio.</h2>
      <p>
        Jouw creativiteit verdient een plek. Kies een studio, check de
        beschikbaarheid en leg je tijdslot direct vast.
      </p>
      <form @submit.prevent="handleSubmit">
        <fieldset>
          <legend>
            Stap 1: Laat ons weten wie je bent zodat we de bevestiging kunnen
            sturen.
          </legend>
          <label>Naam</label>
          <input v-model="form.name" type="text" required />
          <label>Email</label>
          <input v-model="form.email" type="email" required />
        </fieldset>

        <fieldset>
          <legend>
            Stap 2: Selecteer de gewenste studio en de datum voordat je een tijd
            kiest.
          </legend>
          <label>Studio</label>
          <select v-model="form.studio" required>
            <option disabled value="">Studio's</option>
            <option>Oefen ruimte</option>
            <option>Opneem studio</option>
            <option>Atelier</option>
            <option>Danszaal</option>
            <option>Kleine Theaterzaal</option>
          </select>
          <label>Datum</label>
          <input v-model="form.date" type="date" :min="minDate" required />
        </fieldset>

        <fieldset>
          <legend>Stap 3: Kies een beschikbaar tijdslot dat past.</legend>

          <label>Start tijd</label>
          <select
            v-model="form.startTime"
            required
            :disabled="!form.date || !form.studio"
          >
            <option disabled value="">Kies je starttijd</option>
            <option
              v-for="t in startTimes"
              :key="t.time"
              :value="t.time"
              :disabled="t.disabled"
            >
              {{ t.time }}<span v-if="t.disabled"> - Gereserveerd</span>
            </option>
          </select>

          <label>Eind tijd</label>
          <select v-model="form.endTime" required :disabled="!form.startTime">
            <option disabled value="">Kies je eindtijd</option>
            <option
              v-for="t in endTimes"
              :key="t.time"
              :value="t.time"
              :disabled="t.disabled"
            >
              {{ t.time }}<span v-if="t.disabled"> - Gereserveerd</span>
            </option>
          </select>

          <p v-if="duration">{{ duration }}</p>
        </fieldset>

        <input v-model="form.company" type="text" style="display: none" />

        <button type="submit">{{ loading ? "Bezig..." : "Reserveer" }}</button>
      </form>
    </section>
  </main>
</template>

<style>
.reserveren-section {
  background: #222831;
  height: 8rem;
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  padding: 1rem;

  small {
    margin-bottom: 0.7rem;
  }
}

input {
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85); /* Donkere achtergrond */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000; /* Zorg dat het overal bovenop ligt */
  color: white;
  font-family: "Jost", sans-serif;
}

.loading-overlay.hidden {
  display: none !important;
}

.loader-content {
  text-align: center;
}

.spinner-circle {
  width: 60px;
  height: 60px;
  border: 6px solid rgba(255, 255, 255, 0.2);
  border-top: 6px solid var(--secundaire-kleur); /* Jouw oranje kleur */
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

form {
  color: black;
  display: grid;
  color: #cacaca;
  border: 1px solid grey;
  gap: 2rem;
  border-radius: var(--border-radius);
  padding: 1rem;

  fieldset {
    padding: 1rem;
    display: grid;
    gap: 1rem;
    border: none;

    legend {
      font-size: 1.1rem;
    }

    label {
      position: relative;
      width: max-content;

      &::after {
        content: "*";
        color: #c00707;
        font-size: 0.9rem;
        position: absolute;
        right: -15px;
        top: 0px;
      }
    }

    input,
    select {
      padding: 0.8rem 0.5rem;
      color: #cacaca;
      border: none;
      background: #232323;
    }

    input[type="date"]::-webkit-calendar-picker-indicator {
      filter: invert(85%) sepia(6%) saturate(22%) hue-rotate(321deg)
        brightness(95%) contrast(88%);
      cursor: pointer;
    }

    select {
      /* Stap 1: Verwijder de standaard browser-pijl */
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;

      /* Stap 3: Voeg een eigen pijltje toe via een achtergrond-afbeelding */
      background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23cacaca%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;

      /* Stap 4: Positioneer je eigen pijltje exact waar je wilt t.o.v. de rand */
      background-position: right 15px top 50%;
      background-size: 20px auto;
    }
  }
}
</style>
