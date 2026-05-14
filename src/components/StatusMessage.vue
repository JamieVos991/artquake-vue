<script setup>
defineProps({
  show: Boolean,
  type: {
    type: String,
    default: "success",
  },
  message: String,
});
</script>

<template>
  <Transition name="fade">
    <output v-if="show" :class="['status-message', type]" :role="type === 'error' ? 'alert' : 'status'">
      <span v-if="type === 'success'"></span>
      <span v-else>⚠️</span>
      <p>{{ message }}</p>
    </output>
  </Transition>
</template>

<style scoped>
output.status-message {
  position: fixed;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  padding: 1rem 1.5rem;
  border-radius: var(--br);
  display: flex;
  align-items: center;
  color: var(--c-light);
  z-index: 1000;
  box-shadow: 0 4px 12px var(--c-overlay);
}

.success {
  background-color: var(--c-success);
  border: 1px solid var(--c-success-border);
}
.error {
  background-color: var(--c-error);
  border: 1px solid var(--c-error-border);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
