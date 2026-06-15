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
  <Transition name="slide">
    <output
      v-if="show"
      :class="['status-message', type]"
      :role="type === 'error' ? 'alert' : 'status'"
    >
      <span class="icon">{{ type === 'success' ? '✓' : '⚠' }}</span>
      <p>{{ message }}</p>
    </output>
  </Transition>
</template>

<style scoped>
output.status-message {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  left: auto;
  max-width: 22rem;
  width: calc(100vw - 3rem);
  padding: 1rem 1.25rem;
  border-radius: var(--br-lg);
  display: flex;
  align-items: center;
  gap: 0.9rem;
  color: var(--c-light);
  z-index: 9999;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.icon {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
}

p {
  font-size: 0.95rem;
  line-height: 1.4;
  max-width: none;
}

.success {
  background: var(--c-bg-alt);
  border: 1px solid var(--c-success-border);

  .icon {
    background: var(--c-success);
    color: #fff;
  }
}

.error {
  background: var(--c-bg-alt);
  border: 1px solid var(--c-error-border);

  .icon {
    background: var(--c-error);
    color: #fff;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}
</style>
