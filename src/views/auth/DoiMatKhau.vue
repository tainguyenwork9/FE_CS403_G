<template>
  <div class="container py-4 py-lg-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <section class="auth-panel bg-white border rounded-4 shadow-sm p-4 p-md-5 animate-fade-in">
          <div class="text-center mb-4">
            <div class="auth-icon bg-primary-subtle text-primary rounded-circle mx-auto mb-3">
              <i class="bi bi-shield-lock fs-4" aria-hidden="true"></i>
            </div>
            <p class="text-primary fw-semibold mb-2">BẢO MẬT TÀI KHOẢN</p>
            <h1 class="h3 fw-bold mb-2">Đổi mật khẩu</h1>
            <p class="text-secondary mb-0">Cập nhật mật khẩu để bảo vệ tài khoản của bạn.</p>
          </div>

          <form @submit.prevent="xuLyDoiMatKhau" novalidate>
            <div class="mb-3">
              <label for="matKhauCu" class="form-label fw-semibold">Mật khẩu hiện tại</label>
              <input id="matKhauCu" v-model="matKhauCu" type="password" class="form-control" placeholder="Nhập mật khẩu hiện tại" autocomplete="current-password" required />
            </div>

            <div class="mb-3">
              <label for="matKhauMoi" class="form-label fw-semibold">Mật khẩu mới</label>
              <input id="matKhauMoi" v-model="matKhauMoi" type="password" class="form-control" placeholder="Nhập mật khẩu mới" autocomplete="new-password" required />
            </div>

            <div class="mb-4">
              <label for="xacNhanMatKhauMoi" class="form-label fw-semibold">Xác nhận mật khẩu mới</label>
              <input id="xacNhanMatKhauMoi" v-model="xacNhanMatKhauMoi" type="password" class="form-control" placeholder="Nhập lại mật khẩu mới" autocomplete="new-password" required />
            </div>

            <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold" :disabled="isSubmitting">
              {{ isSubmitting ? 'Đang xử lý...' : 'Cập nhật mật khẩu' }}
            </button>
          </form>

          <div v-if="thongBao" class="alert mt-4 mb-0" :class="thanhCong ? 'alert-success' : 'alert-danger'" role="status">
            {{ thongBao }}
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api, { getApiErrorMessage } from '@/services/api'

const matKhauCu = ref('')
const matKhauMoi = ref('')
const xacNhanMatKhauMoi = ref('')
const isSubmitting = ref(false)
const thongBao = ref('')
const thanhCong = ref(false)
const router = useRouter()

async function xuLyDoiMatKhau() {
  if (!matKhauCu.value || !matKhauMoi.value || !xacNhanMatKhauMoi.value) {
    thongBao.value = 'Vui lòng điền đầy đủ thông tin.'
    thanhCong.value = false
    return
  }

  if (matKhauMoi.value !== xacNhanMatKhauMoi.value) {
    thongBao.value = 'Mật khẩu mới và xác nhận mật khẩu không khớp.'
    thanhCong.value = false
    return
  }

  isSubmitting.value = true
  thongBao.value = ''

  try {
    const { data: result } = await api.post('/change-password', {
      matKhauCu: matKhauCu.value,
      matKhauMoi: matKhauMoi.value
    })

    thanhCong.value = true
    thongBao.value = result.message || 'Đổi mật khẩu thành công.'
    matKhauCu.value = ''
    matKhauMoi.value = ''
    xacNhanMatKhauMoi.value = ''

    setTimeout(() => router.push('/ho-so-ca-nhan'), 800)
  } catch (error) {
    thanhCong.value = false
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
  min-height: 2.8rem;
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.25rem rgba(37, 99, 235, 0.12);
}
</style>
