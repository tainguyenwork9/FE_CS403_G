<template>
  <div class="container animate-fade-in not-found">
    <h1>404</h1>
    <h2>Trang không tồn tại</h2>
    <p>Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.</p>
    <router-link to="/" class="btn-home">Về trang chủ</router-link>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 5rem 0;
}

h1 {
  font-size: 6rem;
  font-weight: 900;
  color: var(--primary-color);
  line-height: 1;
}

h2 {
  font-size: 2rem;
  margin-top: 1rem;
}

p {
  color: var(--text-muted);
  margin: 1rem 0 2rem 0;
}

.btn-home {
  display: inline-block;
  background-color: var(--primary-color);
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  transition: var(--transition);
}

.btn-home:hover {
  background-color: var(--primary-hover);
}
</style>
