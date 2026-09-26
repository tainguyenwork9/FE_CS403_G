<template>
  <header class="navbar">
    <div class="container navbar-content">
      <router-link to="/" class="logo" aria-label="MotoRent home">
        <svg class="brand-mark" viewBox="0 0 160 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="36" height="36" rx="10" fill="#0284c7"/>
          <path d="M10 24C10 21 12 18 15 18H21C24 18 26 21 26 24" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="13" cy="25" r="3.5" stroke="white" stroke-width="2.5"/>
          <circle cx="23" cy="25" r="3.5" stroke="white" stroke-width="2.5"/>
          <path d="M19 18L17 12H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="logo-text">Moto<span class="highlight">Rent</span></span>
      </router-link>

      <nav class="nav-links">
        <router-link to="/" class="nav-item">Trang chủ</router-link>
        <router-link to="/tim-kiem-xe" class="nav-item">Xe thuê</router-link>

        <template v-if="isLoggedIn && isCustomer">
          <router-link to="/ho-so-ca-nhan" class="nav-item">Hồ sơ</router-link>
        </template>

        <template v-if="isLoggedIn && isStaffOrAdmin">
          <router-link to="/kiem-tra-ho-so" class="nav-item">Duyệt hồ sơ</router-link>
        </template>

        <template v-if="isLoggedIn && isAdmin">
          <router-link to="/thong-ke" class="nav-item">Thống kê</router-link>
        </template>

        <template v-if="!isLoggedIn">
          <a href="#why-us" class="nav-item">Vì sao chọn</a>
          <a href="#process" class="nav-item">Quy trình</a>
        </template>
      </nav>

      <div class="nav-actions">
        <template v-if="isLoggedIn">
          <button type="button" class="logout-btn" @click="dangXuat">Đăng xuất</button>
        </template>

        <template v-else>
          <router-link to="/dang-nhap" class="login-btn">Đăng nhập</router-link>
          <router-link to="/dang-ky" class="signup-btn">Đăng ký</router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'

const normalizeRole = (role) => String(role || '').trim().toLowerCase()

const loadAuthUser = () => {
  try {
    const rawUser = localStorage.getItem('auth_user')
    return rawUser ? JSON.parse(rawUser) : null
  } catch (error) {
    return null
  }
}

const authUser = ref(loadAuthUser())

const syncAuthState = () => {
  authUser.value = loadAuthUser()
}

onMounted(() => {
  window.addEventListener('storage', syncAuthState)
  window.addEventListener('auth:updated', syncAuthState)
})

const isLoggedIn = computed(() => Boolean(localStorage.getItem('auth_token')))
const isCustomer = computed(() => ['khach_hang', 'customer'].includes(normalizeRole(authUser.value?.vaiTro)))
const isStaffOrAdmin = computed(() => ['nhan_vien', 'admin'].includes(normalizeRole(authUser.value?.vaiTro)))
const isAdmin = computed(() => normalizeRole(authUser.value?.vaiTro) === 'admin')

function dangXuat() {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')
  authUser.value = null
  window.dispatchEvent(new Event('auth:updated'))
  window.location.assign('/')
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 78px;
  gap: 1.5rem;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  color: var(--text-main);
  font-weight: 800;
  letter-spacing: -0.04em;
}

.brand-mark {
  width: 158px;
  height: 40px;
}

.logo-text {
  font-size: 1.7rem;
}

.highlight {
  color: var(--primary-color);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.8rem;
}

.nav-item {
  color: var(--text-muted);
  font-weight: 600;
  transition: var(--transition);
}

.nav-item:hover,
.nav-item.router-link-active {
  color: var(--primary-color);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.login-btn,
.profile-btn,
.signup-btn,
.logout-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.7rem 1.2rem;
  font-weight: 700;
  transition: var(--transition);
  border: 0;
}

.login-btn,
.profile-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.signup-btn {
  background: #e5e7eb;
  color: #111827;
  border: 1px solid #d1d5db;
  box-shadow: none;
}

.logout-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.signup-btn:hover,
.logout-btn:hover {
  transform: translateY(-1px);
  filter: brightness(0.97);
}
</style>
