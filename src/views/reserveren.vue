<script setup>
import { ref, computed, watch, onUnmounted } from "vue";
import emailjs from "@emailjs/browser";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import StatusMessage from "../components/statusmessage.vue";
import LoadingOverlay from "../components/LoadingOverlay.vue";
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

const studios = [
  { name: "Oefenruimte muziek", icon: "🎵", desc: "Oefen met je band of solo" },
  { name: "Opnamestudio",       icon: "🎙️", desc: "Professionele opnameruimte" },
  { name: "Dansstudio",         icon: "💃", desc: "Grote spiegelruimte" },
  { name: "Atelier",            icon: "🎨", desc: "Creatieve werkruimte" },
];
const reservedPeriods = ref([]);

const verificationStep = ref(false);
const verificationCode = ref("");
const digits = ref(["", "", "", "", "", ""]);
const codeError = ref(false);
const countdown = ref(120);
let countdownTimer = null;

const enteredCode = computed(() => digits.value.join(""));
const allFilled = computed(() => digits.value.every((d) => d !== ""));

function startCountdown() {
  countdown.value = 120;
  clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    if (countdown.value > 0) countdown.value--;
    else clearInterval(countdownTimer);
  }, 1000);
}

const countdownDisplay = computed(() => {
  const m = Math.floor(countdown.value / 60);
  const s = countdown.value % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
});

onUnmounted(() => {
  clearInterval(countdownTimer);
  document.body.style.overflow = "";
});

watch(verificationStep, (val) => {
  document.body.style.overflow = val ? "hidden" : "";
});

function onDigitInput(index, e) {
  const val = e.target.value.replace(/\D/g, "").slice(-1);
  digits.value[index] = val;
  codeError.value = false;
  if (val && index < 5) {
    document.getElementById(`digit-${index + 1}`)?.focus();
  }
}

function onDigitKeydown(index, e) {
  if (e.key === "Backspace" && !digits.value[index] && index > 0) {
    document.getElementById(`digit-${index - 1}`)?.focus();
  }
}

function onDigitPaste(e) {
  const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
  if (pasted.length === 6) {
    digits.value = pasted.split("");
    document.getElementById("digit-5")?.focus();
    e.preventDefault();
  }
}

async function resendCode() {
  if (countdown.value > 0) return;
  loading.value = true;
  try {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    verificationCode.value = code;
    await emailjs.send(
      "service_uqngj85",
      "template_1vaxexh",
      { name: form.value.name, email: form.value.email, code },
      "Jrzv7YJlfecQ-BptO"
    );
    digits.value = ["", "", "", "", "", ""];
    codeError.value = false;
    startCountdown();
  } catch (err) {
    console.error(err);
    showStatus("error", "Verzenden mislukt. Probeer opnieuw.");
  } finally {
    loading.value = false;
  }
}

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
    const code = String(Math.floor(100000 + Math.random() * 900000));
    verificationCode.value = code;

    await emailjs.send(
      "service_uqngj85",
      "template_1vaxexh",
      {
        name: form.value.name,
        email: form.value.email,
        code,
      },
      "Jrzv7YJlfecQ-BptO"
    );

    verificationStep.value = true;
    digits.value = ["", "", "", "", "", ""];
    codeError.value = false;
    startCountdown();
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

const handleVerify = async () => {
  if (loading.value) return;
  if (enteredCode.value !== verificationCode.value) {
    codeError.value = true;
    return;
  }

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
    verificationStep.value = false;
    verificationCode.value = "";
    digits.value = ["", "", "", "", "", ""];
    clearInterval(countdownTimer);
  } catch (err) {
    console.error(err);
    showStatus(
      "error",
      "Er ging iets mis bij het opslaan. Probeer het opnieuw."
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

      <!-- Linker kolom: intro -->
      <div class="intro">
        <span class="label">Reserveren</span>
        <h2 class="h2-font"><em>Reserveer</em> hier jouw studio</h2>
        <span class="line"></span>
        <p>
          Jouw creativiteit verdient een plek. Kies een studio, check de
          beschikbaarheid en leg je tijdslot direct vast.
        </p>

        <div class="studio-cards">
          <button
            v-for="s in studios"
            :key="s.name"
            type="button"
            class="studio-card"
            :class="{ active: form.studio === s.name }"
            @click="form.studio = s.name"
          >
            <span class="studio-icon">{{ s.icon }}</span>
            <span class="studio-name">{{ s.name }}</span>
            <span class="studio-desc">{{ s.desc }}</span>
          </button>
        </div>
      </div>

      <!-- Rechter kolom: formulier -->
      <form @submit.prevent="handleSubmit">
        <fieldset>
          <legend>Stap 1 — Jouw gegevens</legend>
          <label>Naam</label>
          <input v-model="form.name" type="text" required />
          <label>Email</label>
          <input v-model="form.email" type="email" required />
        </fieldset>

        <fieldset>
          <legend>Stap 2 — Studio & datum</legend>
          <label>Studio</label>
          <select v-model="form.studio" required>
            <option disabled value="">Kies een studio</option>
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
          <legend>Stap 3 — Tijdslot</legend>

          <div class="time-row">
            <div>
              <label>Starttijd</label>
              <select
                v-model="form.startTime"
                required
                :disabled="!form.date || !form.studio"
              >
                <option disabled value="">Van</option>
                <option
                  v-for="t in startTimes"
                  :key="t.time"
                  :value="t.time"
                  :disabled="t.disabled"
                >
                  {{ t.time }}{{ t.disabled ? " · bezet" : "" }}
                </option>
              </select>
            </div>
            <div>
              <label>Eindtijd</label>
              <select v-model="form.endTime" required :disabled="!form.startTime">
                <option disabled value="">Tot</option>
                <option
                  v-for="t in endTimes"
                  :key="t.time"
                  :value="t.time"
                  :disabled="t.disabled"
                >
                  {{ t.time }}{{ t.disabled ? " · bezet" : "" }}
                </option>
              </select>
            </div>
          </div>

          <div v-if="duration" class="duration-badge">
            ⏱ {{ duration }}
          </div>
        </fieldset>

        <input
          v-model="form.company"
          type="text"
          style="display: none"
          tabindex="-1"
          autocomplete="off"
        />

        <button class="btn submit-btn" type="submit" :disabled="loading">
          {{ loading ? "Bezig..." : "Bevestig reservering" }}
        </button>
      </form>

    </section>

    <!-- Verificatie popup -->
    <Transition name="fade">
      <div v-if="verificationStep" class="verification-overlay" @click.self="verificationStep = false">
        <div class="verification-box">
          <button class="close-btn" @click="verificationStep = false">✕</button>

          <h3 class="verification-title">Verificatiecode</h3>
          <p class="verification-sub">
            Voer de code in die we hebben gestuurd naar<br />
            <strong>{{ form.email }}</strong>
          </p>

          <div class="digit-row">
            <input
              v-for="(_, i) in digits"
              :key="i"
              :id="`digit-${i}`"
              class="digit-input"
              :class="{ error: codeError }"
              type="text"
              inputmode="numeric"
              maxlength="1"
              :value="digits[i]"
              @input="onDigitInput(i, $event)"
              @keydown="onDigitKeydown(i, $event)"
              @paste="onDigitPaste"
              @focus="$event.target.select()"
            />
          </div>

          <p class="countdown">{{ countdownDisplay }}</p>

          <p v-if="codeError" class="code-error">
            De ingevoerde code is onjuist. Probeer opnieuw.
          </p>

          <button
            class="btn verify-btn"
            :disabled="loading || !allFilled"
            @click="handleVerify"
          >
            {{ loading ? "Bezig..." : "Bevestig" }}
          </button>

          <p class="resend">
            Code niet ontvangen?
            <button
              class="resend-btn"
              :disabled="countdown > 0 || loading"
              @click="resendCode"
            >
              Opnieuw sturen
            </button>
          </p>
        </div>
      </div>
    </Transition>
  </main>
</template>

<style scoped>
/* ── Layout ─────────────────────────────────── */
section {
  display: grid;
  gap: 3rem;
  align-items: start;

  @media (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
}

/* ── Intro kolom ─────────────────────────────── */
.intro {
  display: grid;
  gap: 1.25rem;
}

.studio-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-top: 0.5rem;

  @media (min-width: 500px) {
    grid-template-columns: 1fr 1fr;
  }
}

.studio-card {
  background: var(--c-bg-alt);
  border: 1px solid hsla(0,0%,100%,0.08);
  border-radius: var(--br-lg);
  padding: 1.25rem 1.25rem;
  text-align: left;
  cursor: pointer;
  display: grid;
  grid-template-columns: 2.5rem 1fr;
  grid-template-rows: auto auto;
  column-gap: 0.75rem;
  align-items: center;
  transition: border-color 0.2s, background 0.2s;

  &:hover {
    border-color: var(--c-primary);
  }

  &.active {
    border-color: var(--c-primary);
    background: hsla(272,84%,45%,0.12);

    .studio-name { color: var(--c-light); }
  }
}

.studio-icon {
  font-size: 1.5rem;
  grid-row: 1 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
  background: hsla(0,0%,100%,0.06);
  border-radius: var(--br);
  width: 2.5rem;
  height: 2.5rem;
}

.studio-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--c-grey);
  transition: color 0.2s;
  line-height: 1.2;
}

.studio-desc {
  font-size: 0.78rem;
  color: hsla(0,0%,100%,0.3);
  line-height: 1;
}

/* ── Formulier ───────────────────────────────── */
form {
  max-width: 100%;

  fieldset legend {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--c-grey);
    padding-bottom: 1rem;
  }
}

.time-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.duration-badge {
  margin-top: 0.75rem;
  display: inline-block;
  background: hsla(272,84%,45%,0.15);
  border: 1px solid var(--c-primary);
  color: var(--c-light);
  border-radius: var(--br);
  padding: 0.35rem 0.9rem;
  font-size: 0.9rem;
}

.submit-btn {
  width: 100%;
  justify-content: center;
  text-align: center;
  margin-top: 0.5rem;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.verification-overlay {
  position: fixed;
  inset: 0;
  background: var(--c-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.verification-box {
  position: relative;
  width: 100%;
  max-width: 24rem;
  background: var(--c-bg-alt);
  border-radius: 1rem;
  padding: 2.5rem 2rem;
  text-align: center;
  box-shadow: 0 8px 48px rgba(0,0,0,0.5);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1rem;
  opacity: 0.4;
  cursor: pointer;
  color: inherit;

  &:hover { opacity: 1; }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.verification-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.verification-sub {
  font-size: 0.9rem;
  opacity: 0.65;
  margin-bottom: 1.75rem;
  line-height: 1.5;
}

.digit-row {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.digit-input {
  width: 3rem;
  height: 3.5rem;
  border: 2px solid var(--c-border, #ddd);
  border-radius: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  background: transparent;
  color: inherit;
  transition: border-color 0.15s;

  &:focus {
    outline: none;
    border-color: var(--c-accent, #4f6ef7);
  }

  &.error {
    border-color: var(--c-error, #e74c3c);
    color: var(--c-error, #e74c3c);
  }
}

.countdown {
  font-size: 0.85rem;
  opacity: 0.5;
  margin-bottom: 0.5rem;
}

.code-error {
  color: var(--c-error, #e74c3c);
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
}

.verify-btn {
  width: 100%;
  margin-top: 0.75rem;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.resend {
  font-size: 0.85rem;
  margin-top: 1.25rem;
  opacity: 0.65;
}

.resend-btn {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  color: inherit;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    text-decoration: none;
  }
}
</style>
