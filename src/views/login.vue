<script setup>
import { ref } from "vue";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const errorMessage = ref("");

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const login = async () => {
  errorMessage.value = "";

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push("/dashboard");
  } catch (error) {
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

      <!-- Linker kolom: intro -->
      <div class="intro">
        <span class="label">Login</span>
        <h2 class="h2-font"><em>Welkom</em> terug</h2>
        <span class="line"></span>
        <p>
          Log in om toegang te krijgen tot het Artquake dashboard.
          Alleen voor crew en beheerders.
        </p>

      </div>

      <!-- Rechter kolom: formulier -->
      <form @submit.prevent="login">
        <fieldset>
          <legend>Inloggegevens</legend>

          <label for="email">E-mailadres</label>
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
              placeholder="••••••••"
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
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>
        </fieldset>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

        <button class="btn submit-btn" type="submit">Inloggen</button>
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

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;

  input {
    width: 100%;
    padding-right: 3rem;
  }
}

.toggle-button {
  position: absolute;
  right: 0.75rem;
  font-size: 1.2rem;
  opacity: 0.6;
  cursor: pointer;

  &:hover { opacity: 1; }
}

.error {
  color: var(--c-error);
  font-size: 0.9rem;
  margin-top: -0.5rem;
}

.submit-btn {
  width: 100%;
  text-align: center;
  justify-content: center;
  margin-top: 0.5rem;
}
</style>
