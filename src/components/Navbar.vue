<template>
  <header class="navbar">
    <div class="container navbar-content">
      <router-link to="/" class="logo">
        <span class="logo-icon">⚡</span>
        <span class="logo-text">Core<span class="highlight">Vue</span></span>
      </router-link>
      <nav class="nav-links">
        <router-link to="/" class="nav-item">Trang chủ</router-link>
        <a href="https://vuejs.org" target="_blank" rel="noopener" class="nav-item">Vue Docs</a>
        <a href="https://vitejs.dev" target="_blank" rel="noopener" class="nav-item">Vite Docs</a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  background-color: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
}

.highlight {
  color: var(--primary-color);
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-item {
  color: var(--text-muted);
  font-weight: 500;
  transition: var(--transition);
}

.nav-item:hover,
.nav-item.router-link-active {
  color: var(--primary-color);
}
</style>
