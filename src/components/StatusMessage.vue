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
    <div v-if="show" :class="['status-message', type]">
      <span v-if="type === 'success'"></span>
      <span v-else>⚠️</span>
      <p>{{ message }}</p>
    </div>
  </Transition>
</template>

<style scoped>
.status-message {
  position: fixed;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  color: white;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.success {
  background-color: #2e7d32;
  border: 1px solid #1b5e20;
}
.error {
  background-color: #d32f2f;
  border: 1px solid #b71c1c;
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
