<script setup>
import { ref } from "vue";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import StatusMessage from "../components/statusmessage.vue";
import LoadingOverlay from "../components/loadingoverlay.vue";
import { useStatus } from "../composables/useStatus.js";

const { status, showStatus } = useStatus();

const formData = ref({
  naam: "",
  email: "",
  telefoon: "",
  bericht: "",
});

const isSending = ref(false);

const handleSubmit = async () => {
  if (isSending.value) return;
  isSending.value = true;

  try {
    await addDoc(collection(db, "contact_aanvragen"), {
      naam: formData.value.naam,
      email: formData.value.email,
      telefoon: formData.value.telefoon,
      bericht: formData.value.bericht,
      datum: serverTimestamp(),
    });

    showStatus("success", "Bedankt! Je bericht is succesvol verzonden.");

    formData.value = { naam: "", email: "", telefoon: "", bericht: "" };
  } catch (error) {
    console.error("Fout bij opslaan:", error);
    showStatus("error", "Er ging iets mis. Probeer het later opnieuw.");
  } finally {
    isSending.value = false;
  }
};

const contactInfo = [
  { icon: "📍", label: "Adres",      value: "Artquake, Creative Space" },
  { icon: "📧", label: "E-mail",     value: "info@art-quake.com" },
  { icon: "📞", label: "Telefoon",   value: "+31 6 00 00 00 00" },
  { icon: "🕐", label: "Openingstijden", value: "Ma – Za: 08:30 – 21:30" },
];
</script>

<template>
  <main>
    <StatusMessage
      :show="status.show"
      :type="status.type"
      :message="status.message"
    />

    <LoadingOverlay :show="isSending" label="Bericht verzenden..." />

    <section>

      <!-- Linker kolom: intro -->
      <div class="intro">
        <span class="label">Contact</span>
        <h2 class="h2-font">Stel <em>je vraag</em> aan ons team</h2>
        <span class="line"></span>
        <p>
          Heb je een vraag, idee of wil je meer weten over onze studio's?
          We helpen je graag verder.
        </p>

        <div class="contact-cards">
          <div v-for="item in contactInfo" :key="item.label" class="contact-card">
            <span class="contact-icon">{{ item.icon }}</span>
            <div>
              <span class="contact-label">{{ item.label }}</span>
              <span class="contact-value">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Rechter kolom: formulier -->
      <form @submit.prevent="handleSubmit">
        <fieldset>
          <legend>Stap 1 — Jouw gegevens</legend>

          <label for="naam">Voor- en achternaam</label>
          <input
            id="naam"
            v-model="formData.naam"
            type="text"
            placeholder="Jan Janssen"
            required
          />

          <label for="email">E-mailadres</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="jan@voorbeeld.nl"
            required
          />

          <label for="tel">Telefoonnummer</label>
          <input
            id="tel"
            v-model="formData.telefoon"
            type="tel"
            placeholder="0612345678"
          />
        </fieldset>

        <fieldset>
          <legend>Stap 2 — Je bericht</legend>

          <label for="bericht">Bericht</label>
          <textarea
            id="bericht"
            v-model="formData.bericht"
            placeholder="Hoe kunnen we je helpen?"
            rows="5"
            required
          />
        </fieldset>

        <button type="submit" class="btn submit-btn" :disabled="isSending">
          {{ isSending ? "Bezig..." : "Verstuur bericht" }}
        </button>
      </form>

    </section>
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

.contact-cards {
  display: grid;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.contact-card {
  background: var(--c-bg-alt);
  border: 1px solid hsla(0,0%,100%,0.08);
  border-radius: var(--br-lg);
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.contact-icon {
  font-size: 1.4rem;
  width: 2.5rem;
  height: 2.5rem;
  background: hsla(0,0%,100%,0.06);
  border-radius: var(--br);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-label {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: hsla(0,0%,100%,0.35);
  margin-bottom: 0.15rem;
}

.contact-value {
  display: block;
  font-size: 0.95rem;
  color: var(--c-light);
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

textarea {
  padding: 0.8rem;
  color: var(--c-input-text);
  width: 100%;
  border: none;
  background: var(--c-input);
  resize: vertical;
  font-family: inherit;
  font-size: 1rem;
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
</style>
