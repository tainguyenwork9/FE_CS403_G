<template>
  <div class="container py-4 py-lg-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-5">
        <section class="auth-panel bg-white border rounded-4 shadow-sm p-4 p-md-5 animate-fade-in">
          <div class="text-center mb-4">
            <div class="auth-icon bg-primary-subtle text-primary rounded-circle mx-auto mb-3">
              <i class="bi bi-box-arrow-in-right fs-4" aria-hidden="true"></i>
            </div>
            <p class="text-primary fw-semibold mb-2">MOTORIDE</p>
            <h1 class="h3 fw-bold mb-2">Chào mừng trở lại</h1>
            <p class="text-secondary mb-0">Đăng nhập để tiếp tục hành trình của bạn.</p>
          </div>

          <form @submit.prevent="xuLyDangNhap" novalidate>
            <div class="mb-3">
              <label for="tenDangNhap" class="form-label fw-semibold">Tên đăng nhập</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0">
                  <i class="bi bi-person text-secondary" aria-hidden="true"></i>
                </span>
                <input
                  id="tenDangNhap"
                  v-model="tenDangNhap"
                  type="text"
                  class="form-control border-start-0 ps-0"
                  placeholder="Nhập tên đăng nhập"
                  autocomplete="username"
                  required
                />
              </div>
            </div>

            <div class="mb-3">
              <label for="matKhau" class="form-label fw-semibold">Mật khẩu</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0">
                  <i class="bi bi-lock text-secondary" aria-hidden="true"></i>
                </span>
                <input
                  id="matKhau"
                  v-model="matKhau"
                  :type="hienMatKhau ? 'text' : 'password'"
                  class="form-control border-start-0 border-end-0 ps-0"
                  placeholder="Nhập mật khẩu"
                  autocomplete="current-password"
                  required
                />
                <button
                  type="button"
                  class="btn btn-light border border-start-0"
                  :aria-label="hienMatKhau ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
                  @click="hienMatKhau = !hienMatKhau"
                >
                  <i :class="hienMatKhau ? 'bi bi-eye-slash' : 'bi bi-eye'" aria-hidden="true"></i>
                </button>
              </div>
            </div>

            <div class="d-flex justify-content-between align-items-center mb-4">
              <div class="form-check">
                <input id="ghiNhoDangNhap" class="form-check-input" type="checkbox" />
                <label class="form-check-label small text-secondary" for="ghiNhoDangNhap">
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <button type="button" class="btn btn-link btn-sm text-primary text-decoration-none p-0">
                Quên mật khẩu?
              </button>
            </div>

            <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold" :disabled="isSubmitting">
              Đăng nhập
              <i class="bi bi-arrow-right ms-2" aria-hidden="true"></i>
            </button>
          </form>

          <div v-if="thongBao" class="alert mt-4 mb-0" :class="dangNhapThanhCong ? 'alert-success' : 'alert-danger'" role="status">
            {{ thongBao }}
          </div>

          <p class="text-center text-secondary small mt-4 mb-0">
            Chưa có tài khoản?
            <router-link to="/dang-ky" class="text-primary fw-semibold">Đăng ký ngay</router-link>
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api, { getApiErrorMessage } from '@/services/api'

const tenDangNhap = ref('')
const matKhau = ref('')
const hienMatKhau = ref(false)
const isSubmitting = ref(false)
const dangNhapThanhCong = ref(false)
const thongBao = ref('')

async function xuLyDangNhap() {
  isSubmitting.value = true
  thongBao.value = ''

  try {
    const { data: result } = await api.post('/login', {
      tenDangNhap: tenDangNhap.value,
      matKhau: matKhau.value
    })

    localStorage.setItem('auth_token', result.token)
    localStorage.setItem('auth_user', JSON.stringify(result.user))
    window.dispatchEvent(new Event('auth:updated'))
    dangNhapThanhCong.value = true
    thongBao.value = result.message || 'Đăng nhập thành công.'
    window.location.assign('/')
  } catch (error) {
    dangNhapThanhCong.value = false
    thongBao.value = getApiErrorMessage(error, 'Không thể kết nối đến máy chủ.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.auth-panel {
  border-color: var(--border-color) !important;
}

.auth-icon {
  display: grid;
  width: 3.5rem;
  height: 3.5rem;
  place-items: center;
}

.input-group-text,
.form-control,
.btn-light {
  border-color: var(--border-color);
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.25rem rgba(37, 99, 235, 0.12);
}
</style>