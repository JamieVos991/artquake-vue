<script setup>
import { ref, computed, watch } from "vue";
import emailjs from "@emailjs/browser";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import StatusMessage from "../components/statusmessage.vue";
import LoadingOverlay from "../components/loadingoverlay.vue";
import { useStatus } from "../composables/useStatus.js";

const { status, showStatus } = useStatus();

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

function isPastTime(t) {
  if (form.value.date !== minDate) return false;
  const [h, m] = t.split(":").map(Number);
  const now = new Date();
  return h * 60 + m <= now.getHours() * 60 + now.getMinutes();
}

const startTimes = computed(() => {
  const timesForStart = allTimes.filter((t) => t !== "21:30");
  return timesForStart.map((t) => {
    const isReserved = reservedPeriods.value.some(
      (p) => t >= p.start && t < p.end
    );
    return { time: t, disabled: isReserved || isPastTime(t) };
  });
});

const endTimes = computed(() => {
  if (!form.value.startTime) return [];
  const availableEndTimes = [];
  const nextReservation = reservedPeriods.value
    .filter((p) => p.start > form.value.startTime)
    .sort((a, b) => a.start.localeCompare(b.start))[0];

  const limitTime = nextReservation ? nextReservation.start : "23:59";

  for (const t of allTimes) {
    if (t <= form.value.startTime) continue;
    if (t > limitTime) break;
    const isInsideReserved = reservedPeriods.value.some(
      (p) => t > p.start && t <= p.end
    );
    if (!isInsideReserved) {
      availableEndTimes.push({ time: t, disabled: false });
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

    showStatus(
      "success",
      "Reservering gelukt! Check je e-mail voor de bevestiging."
    );

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
    showStatus(
      "error",
      "Er ging iets mis bij het verzenden. Probeer het opnieuw."
    );
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <main>
    <StatusMessage
      :show="status.show"
      :type="status.type"
      :message="status.message"
    />

    <LoadingOverlay :show="loading" label="Ogenblik geduld..." />

    <section>
      <span class="label">Reserveren</span>
      <h2 class="h2-font"><em>Reserveer</em> hier jouw studio</h2>
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
            <option>Oefenruimte muziek</option>
            <option>Opnamestudio</option>
            <option>Dansstudio</option>
            <option>Atelier</option>
          </select>
          <label>Datum</label>
          <input
            v-model="form.date"
            type="date"
            :min="minDate"
            @click="$event.target.showPicker()"
            required
          />
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

          <p v-if="duration" class="duration-text">
            Totale duur: {{ duration }}
          </p>
        </fieldset>

        <input
          v-model="form.company"
          type="text"
          style="display: none"
          tabindex="-1"
          autocomplete="off"
        />

        <button class="btn" type="submit" :disabled="loading">
          {{ loading ? "Bezig..." : "Bevestig Reservering" }}
        </button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.reserveren-section {
  background: var(--c-bg-alt);
  height: 8rem;
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  padding: 1rem;

  small {
    margin-bottom: 0.7rem;
  }
}

@media (min-width: 900px) {
  section {
    grid-template-columns: 1fr 1fr;
    align-items: start;

    .label,
    h2 {
      grid-column: 1 / -1;
    }

    form {
      grid-column: 1 / -1;
      max-width: 50rem;
    }
  }
}
</style>
