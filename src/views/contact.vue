<script setup>
import { ref } from "vue";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Spinner from "../components/spinner.vue";
import StatusMessage from "../components/statusmessage.vue";

const formData = ref({
  naam: "",
  email: "",
  telefoon: "",
  bericht: "",
});

const isSending = ref(false);

// Status state for the custom message component
const status = ref({
  show: false,
  type: "success",
  message: "",
});

// Helper: Show status and hide automatically after 5 seconds
const showStatus = (type, msg) => {
  status.value = { show: true, type, message: msg };
  setTimeout(() => {
    status.value.show = false;
  }, 5000);
};

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

    // Custom success message
    showStatus("success", "Bedankt! Je bericht is succesvol verzonden.");

    // Reset form
    formData.value = { naam: "", email: "", telefoon: "", bericht: "" };
  } catch (error) {
    console.error("Fout bij opslaan:", error);
    // Custom error message
    showStatus("error", "Er ging iets mis. Probeer het later opnieuw.");
  } finally {
    isSending.value = false;
  }
};
</script>

<template>
  <main>
    <!-- Custom status component -->
    <StatusMessage
      :show="status.show"
      :type="status.type"
      :message="status.message"
    />

    <!-- Loading overlay for consistency -->
    <div v-if="isSending" class="loading-overlay">
      <div class="loader-content"><Spinner label="Bericht verzenden..." /></div>
    </div>

    <section>
      <label class="label">Formulier</label>
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
/* Ensure the loading overlay styles match your other component */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
</style>
