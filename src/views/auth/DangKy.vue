<template>
  <div class="container py-4 py-lg-5">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-8 col-xl-7">
        <section class="auth-panel bg-white border rounded-4 shadow-sm p-4 p-md-5 animate-fade-in">
          <div class="text-center mb-4">
            <div class="auth-icon bg-primary-subtle text-primary rounded-circle mx-auto mb-3">
              <i class="bi bi-person-plus fs-4" aria-hidden="true"></i>
            </div>
            <p class="text-primary fw-semibold mb-2">MOTORIDE</p>
            <h1 class="h3 fw-bold mb-2">Tạo tài khoản mới</h1>
            <p class="text-secondary mb-0">Đăng ký nhanh để bắt đầu thuê xe thuận tiện hơn.</p>
          </div>

          <form @submit.prevent="xuLyDangKy" autocomplete="off" novalidate>
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <label for="hoTen" class="form-label fw-semibold">Họ và tên</label>
                <input id="hoTen" v-model="hoTen" type="text" class="form-control" placeholder="Nguyễn Văn A" required />
              </div>
              <div class="col-12 col-md-6">
                <label for="tenDangNhap" class="form-label fw-semibold">Tên đăng nhập</label>
                <input id="tenDangNhap" v-model="tenDangNhap" type="text" class="form-control" placeholder="nguyenvana" autocomplete="off" required />
              </div>
              <div class="col-12 col-md-6">
                <label for="email" class="form-label fw-semibold">Email</label>
                <input id="email" v-model="email" type="email" class="form-control" placeholder="you@example.com" autocomplete="email" required />
              </div>
              <div class="col-12 col-md-6">
                <label for="soDienThoai" class="form-label fw-semibold">Số điện thoại</label>
                <input id="soDienThoai" v-model="soDienThoai" type="tel" class="form-control" placeholder="09xxxxxxxx" autocomplete="tel" required />
              </div>
              <div class="col-12">
                <label for="diaChi" class="form-label fw-semibold">Địa chỉ</label>
                <input id="diaChi" v-model="diaChi" type="text" class="form-control" placeholder="Nhập địa chỉ liên hệ" autocomplete="street-address" />
              </div>
              <div class="col-12 col-md-6">
                <label for="matKhau" class="form-label fw-semibold">Mật khẩu</label>
                <input id="matKhau" v-model="matKhau" type="password" class="form-control" placeholder="Tối thiểu 8 ký tự" autocomplete="new-password" required />
              </div>
              <div class="col-12 col-md-6">
                <label for="xacNhanMatKhau" class="form-label fw-semibold">Xác nhận mật khẩu</label>
                <input id="xacNhanMatKhau" v-model="xacNhanMatKhau" type="password" class="form-control" placeholder="Nhập lại mật khẩu" autocomplete="new-password" required />
              </div>
            </div>

            <div class="form-check mt-4 mb-4">
              <input id="dongYDieuKhoan" v-model="dongYDieuKhoan" class="form-check-input" type="checkbox" required />
              <label class="form-check-label small text-secondary" for="dongYDieuKhoan">
                Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật của Motoride.
              </label>
            </div>

            <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold" :disabled="isSubmitting">
              Tạo tài khoản
              <i class="bi bi-arrow-right ms-2" aria-hidden="true"></i>
            </button>
          </form>

          <div v-if="thongBao" class="alert mt-4 mb-0" :class="dangKyThanhCong ? 'alert-success' : 'alert-danger'" role="status">
            {{ thongBao }}
          </div>

          <p class="text-center text-secondary small mt-4 mb-0">
            Đã có tài khoản?
            <router-link to="/dang-nhap" class="text-primary fw-semibold">Đăng nhập</router-link>
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
const hoTen = ref('')
const email = ref('')
const soDienThoai = ref('')
const diaChi = ref('')
const xacNhanMatKhau = ref('')
const dongYDieuKhoan = ref(false)
const isSubmitting = ref(false)
const dangKyThanhCong = ref(false)
const thongBao = ref('')

async function xuLyDangKy() {
  if (matKhau.value !== xacNhanMatKhau.value) {
    dangKyThanhCong.value = false
    thongBao.value = 'Mật khẩu xác nhận không trùng khớp.'
    return
  }

  isSubmitting.value = true
  thongBao.value = ''

  try {
    const { data: result } = await api.post('/register', {
      tenDangNhap: tenDangNhap.value,
      matKhau: matKhau.value,
      hoTen: hoTen.value,
      soDienThoai: soDienThoai.value,
      email: email.value
    })

    localStorage.setItem('auth_token', result.token)
    localStorage.setItem('auth_user', JSON.stringify(result.user))
    window.dispatchEvent(new Event('auth:updated'))
    dangKyThanhCong.value = true
    thongBao.value = result.message || 'Đăng ký thành công.'
    window.location.assign('/')
  } catch (error) {
    dangKyThanhCong.value = false
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

.form-control {
  border-color: var(--border-color);
  min-height: 2.75rem;
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.25rem rgba(37, 99, 235, 0.12);
}
</style>