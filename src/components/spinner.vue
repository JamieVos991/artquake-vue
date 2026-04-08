<template>
  <div class="loader-container">
    <div class="spinner"></div>
    <p v-if="label">{{ label }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: "Laden...",
  },
});
</script>

<style scoped>
.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1.5rem;
}

.spinner {
  width: 50px;
  height: 50px;
  /* Gebruik je thema kleuren */
  border: 4px solid var(--paarse-kleur, #6200ee);
  border-top: 4px solid var(--oranje-kleur, #ff9800);
  border-right: 4px solid transparent;
  border-radius: 50%;

  /* De "wervel" animatie */
  animation: spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loader-content {
  text-align: center;
}

p {
  color: white;
  font-family: var(--font-family-jost);
  letter-spacing: 1px;
  font-size: 0.9rem;
  opacity: 0.8;
}
</style>
