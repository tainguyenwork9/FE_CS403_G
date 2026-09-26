<template>
  <div class="layout-wrapper d-flex flex-column min-vh-100">
    <Navbar />
    <main class="main-content flex-grow-1 py-4">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
</script>
