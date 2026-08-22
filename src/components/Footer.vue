<template>
  <footer class="footer">
    <div class="container footer-content">
      <p>&copy; {{ currentYear }} CoreVue Frontend Core. Built with Vue 3 & Vite.</p>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer {
  border-top: 1px solid var(--border-color);
  padding: 2rem 0;
  margin-top: auto;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
