<script setup>
import { ref } from "vue";
import { auth } from "../firebase"; // Pas het pad aan naar je firebase.js
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

const router = useRouter();

// State
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const errorMessage = ref("");

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const login = async () => {
  errorMessage.value = ""; // Reset foutmelding

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    // Succesvol ingelogd? Stuur door naar dashboard
    router.push("/dashboard");
  } catch (error) {
    // Simpele foutafhandeling
    switch (error.code) {
      case "auth/user-not-found":
        errorMessage.value = "Gebruiker niet gevonden.";
        break;
      case "auth/wrong-password":
        errorMessage.value = "Onjuist wachtwoord.";
        break;
      default:
        errorMessage.value = "Er is iets misgegaan. Probeer het opnieuw.";
    }
  }
};
</script>

<template>
  <main>
    <section>
      <label class="label">Login</label>
      <h2 class="h2-font">Inloggen</h2>
      <p>
        Ben je de weg kwijt of wil je opnieuw beginnen?
        <a href="/">Klik hier</a> om veilig terug te keren naar de hoofdpagina.
      </p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <form @submit.prevent="login">
        <fieldset>
          <legend>Gegevens</legend>

          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="je@email.nl"
          />

          <label for="password">Wachtwoord</label>
          <div class="password-wrapper">
            <input
              id="password"
              placeholder="••••"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
            />
            <button
              type="button"
              class="toggle-button"
              @click="togglePassword"
              tabindex="-1"
            >
              <span v-if="showPassword">🙈</span>
              <span v-else>👁️</span>
            </button>
          </div>
        </fieldset>
        <button class="btn" type="submit">Login</button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.error {
  color: red;
}

main {
  display: grid;
  place-content: center;
}

section {
  max-width: 30rem;
  padding-bottom: 40px;
}

a {
  color: var(--c-anchor);
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  width: 100%;
  padding-right: 40px;
}

.toggle-button {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
}

.toggle-button:hover {
  opacity: 1;
}
</style>
