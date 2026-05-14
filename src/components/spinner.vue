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
