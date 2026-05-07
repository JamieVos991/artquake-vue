<script setup>
import Spinner from "./spinner.vue";

defineProps({
  show: Boolean,
  label: { type: String, default: "Bezig..." },
});
</script>

<template>
  <div v-if="show" class="loading-overlay">
    <Spinner :label="label" />
  </div>
</template>
