<template>
  <div class="container animate-fade-in">
    <section class="hero">
      <div class="badge">Vue 3 + Vite Setup Clean</div>
      <h1 class="hero-title">Sẵn sàng khởi tạo <span class="gradient-text">Dự án Frontend</span></h1>
      <p class="hero-subtitle">
        Thư mục đã được làm sạch, tối ưu hóa cấu trúc component, layout, routing và CSS sẵn sàng cho việc phát triển dự án.
      </p>
      
      <div class="grid-features">
        <div class="card">
          <div class="card-icon">🚀</div>
          <h3>Vite Speed</h3>
          <p>Tốc độ HMR cực nhanh, build tối ưu cho môi trường Production.</p>
        </div>
        <div class="card">
          <div class="card-icon">⚡</div>
          <h3>Vue 3 Composition API</h3>
          <p>Sử dụng cú pháp <code>&lt;script setup&gt;</code> hiện đại và hiệu quả.</p>
        </div>
        <div class="card">
          <div class="card-icon">📂</div>
          <h3>Clean Architecture</h3>
          <p>Chia cấu trúc <code>components</code>, <code>layouts</code>, <code>views</code>, <code>router</code> rõ ràng.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
</script>

<style scoped>
.hero {
  text-align: center;
  padding: 3rem 0;
}

.badge {
  display: inline-block;
  background-color: var(--primary-light);
  color: var(--primary-color);
  padding: 0.35rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.hero-title {
  font-size: 2.75rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.125rem;
  color: var(--text-muted);
  max-width: 640px;
  margin: 0 auto 3rem auto;
}

.grid-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 1.75rem;
  text-align: left;
  transition: var(--transition);
}

.card:hover {
  transform: translateY(-4px);
  border-color: var(--primary-color);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;

}

.card p {
  color: var(--text-muted);
  font-size: 0.9375rem;
}

code {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-family: monospace;
}
</style>
