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
      <span class="label">Formulier</span>
      <h2 class="h2-font">Stel <em>je vraag</em> aan ons team</h2>
      <p>
        De crew is het hart van het team. Samen werken ze hard, helpen ze elkaar
        en zorgen ze dat alles soepel verloopt.
      </p>

      <form @submit.prevent="handleSubmit">
        <fieldset>
          <legend>Contactgegevens</legend>

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

          <label for="bericht">Bericht</label>
          <input
            type="text"
            id="bericht"
            v-model="formData.bericht"
            placeholder="Hoe kunnen we je helpen?"
            required
          />
        </fieldset>

        <button type="submit" class="btn" :disabled="isSending">
          {{ isSending ? "Bezig..." : "Verstuur" }}
        </button>
      </form>
    </section>
  </main>
</template>

<style scoped>
@media (min-width: 900px) {
  section {
    grid-template-columns: 1fr 1fr;
    align-items: start;

    .label,
    h2 {
      grid-column: 1 / -1;
    }

    form {
      grid-column: 2;
      grid-row: 3 / span 2;
      align-self: start;
    }
  }
}
</style>

