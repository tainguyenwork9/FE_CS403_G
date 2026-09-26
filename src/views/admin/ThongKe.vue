<template>
  <div class="container py-4 py-lg-5">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4 animate-fade-in">
      <div>
        <p class="text-primary fw-semibold mb-2">KHU VỰC QUẢN TRỊ</p>
        <h1 class="h2 fw-bold mb-2">Thống kê hệ thống</h1>
        <p class="text-secondary mb-0">Theo dõi nhanh tình hình tài khoản, hồ sơ và đội xe.</p>
      </div>
      <button type="button" class="btn btn-outline-primary" :disabled="isLoading" @click="taiThongKe">
        <i class="bi bi-arrow-clockwise me-2" aria-hidden="true"></i>
        Cập nhật số liệu
      </button>
    </div>

    <div v-if="isLoading" class="empty-state bg-white border rounded-4 text-center p-5">
      <span class="spinner-border text-primary mb-3" role="status" aria-hidden="true"></span>
      <p class="text-secondary mb-0">Đang tải số liệu...</p>
    </div>

    <div v-else-if="thongBao" class="alert alert-danger" role="alert">
      {{ thongBao }}
    </div>

    <template v-else>
      <section class="row g-3 mb-4">
        <div v-for="the in cacTheTongQuan" :key="the.nhan" class="col-12 col-sm-6 col-xl-3">
          <div class="stat-card bg-white border rounded-4 shadow-sm p-4 h-100">
            <div class="d-flex justify-content-between align-items-start gap-3">
              <div>
                <span class="small text-secondary d-block mb-2">{{ the.nhan }}</span>
                <strong class="display-6 fw-bold">{{ the.giaTri }}</strong>
              </div>
              <span class="stat-icon rounded-3" :class="the.mau">
                <i :class="the.icon" aria-hidden="true"></i>
              </span>
            </div>
          </div>
        </div>
      </section>

      <div class="row g-4">
        <section v-for="nhom in cacNhomThongKe" :key="nhom.tieuDe" class="col-12 col-lg-4">
          <div class="stats-panel bg-white border rounded-4 shadow-sm h-100">
            <div class="p-4 border-bottom">
              <h2 class="h5 fw-bold mb-1">{{ nhom.tieuDe }}</h2>
              <p class="small text-secondary mb-0">{{ nhom.moTa }}</p>
            </div>
            <div class="p-4">
              <div v-for="dong in nhom.danhSach" :key="dong.nhan" class="d-flex justify-content-between align-items-center py-2">
                <span class="text-secondary">{{ dong.nhan }}</span>
                <strong>{{ dong.giaTri }}</strong>
              </div>
            </div>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import api, { getApiErrorMessage } from '@/services/api'

const isLoading = ref(true)
const thongBao = ref('')
const thongKe = ref(null)

const cacTheTongQuan = computed(() => [
  { nhan: 'Tổng tài khoản', giaTri: thongKe.value?.accounts.total ?? 0, icon: 'bi bi-people', mau: 'bg-primary-subtle text-primary' },
  { nhan: 'Khách hàng', giaTri: thongKe.value?.accounts.customers ?? 0, icon: 'bi bi-person-check', mau: 'bg-info-subtle text-info-emphasis' },
  { nhan: 'Hồ sơ chờ duyệt', giaTri: thongKe.value?.profiles.pending ?? 0, icon: 'bi bi-hourglass-split', mau: 'bg-warning-subtle text-warning-emphasis' },
  { nhan: 'Xe sẵn sàng', giaTri: thongKe.value?.vehicles.available ?? 0, icon: 'bi bi-bicycle', mau: 'bg-success-subtle text-success-emphasis' }
])

const cacNhomThongKe = computed(() => [
  {
    tieuDe: 'Tài khoản',
    moTa: 'Phân bổ người dùng trong hệ thống.',
    danhSach: [
      { nhan: 'Khách hàng', giaTri: thongKe.value?.accounts.customers ?? 0 },
      { nhan: 'Nhân viên', giaTri: thongKe.value?.accounts.staff ?? 0 },
      { nhan: 'Quản trị viên', giaTri: thongKe.value?.accounts.admins ?? 0 }
    ]
  },
  {
    tieuDe: 'Hồ sơ xác thực',
    moTa: 'Trạng thái các hồ sơ khách hàng.',
    danhSach: [
      { nhan: 'Tổng hồ sơ', giaTri: thongKe.value?.profiles.total ?? 0 },
      { nhan: 'Đã duyệt', giaTri: thongKe.value?.profiles.approved ?? 0 },
      { nhan: 'Từ chối', giaTri: thongKe.value?.profiles.rejected ?? 0 }
    ]
  },
  {
    tieuDe: 'Đội xe',
    moTa: 'Tình trạng xe đang được quản lý.',
    danhSach: [
      { nhan: 'Tổng số xe', giaTri: thongKe.value?.vehicles.total ?? 0 },
      { nhan: 'Sẵn sàng', giaTri: thongKe.value?.vehicles.available ?? 0 },
      { nhan: 'Đang thuê', giaTri: thongKe.value?.vehicles.rented ?? 0 }
    ]
  }
])

async function taiThongKe() {
  isLoading.value = true
  thongBao.value = ''

  try {
    const { data: result } = await api.get('/admin/statistics')
    thongKe.value = result.data
  } catch (error) {
    thongBao.value = getApiErrorMessage(error, 'Không thể tải số liệu thống kê.')
  } finally {
    isLoading.value = false
  }
}

onMounted(taiThongKe)
</script>

<style scoped>
.stat-icon {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  font-size: 1.25rem;
}

.stats-panel {
  border-color: var(--border-color) !important;
}

.stats-panel .d-flex + .d-flex {
  border-top: 1px solid var(--border-color);
}
</style>