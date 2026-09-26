<template>
  <div class="container py-4 py-lg-5">
    <div class="mb-4 animate-fade-in">
      <p class="text-primary fw-semibold mb-2">KHÁM PHÁ ĐỘI XE</p>
      <h1 class="h2 fw-bold mb-2">Tìm chiếc xe phù hợp với bạn</h1>
      <p class="text-secondary mb-0">Lọc theo nhu cầu để tìm được người bạn đồng hành cho hành trình tiếp theo.</p>
    </div>

    <div class="row g-4 align-items-start">
      <aside class="col-12 col-lg-3">
        <section class="filter-panel bg-white border rounded-4 shadow-sm p-4 sticky-lg-top">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="h5 fw-bold mb-0">
              <i class="bi bi-sliders2 me-2 text-primary" aria-hidden="true"></i>Bộ lọc
            </h2>
            <button type="button" class="btn btn-link btn-sm text-primary text-decoration-none p-0" @click="datLaiBoLoc">
              Đặt lại
            </button>
          </div>

          <div class="mb-4">
            <label for="loaiXe" class="form-label fw-semibold">Loại xe</label>
            <select id="loaiXe" v-model="loaiXe" class="form-select">
              <option value="Tat ca">Tất cả loại xe</option>
              <option v-for="loai in danhSachLoaiXe" :key="loai" :value="loai">{{ loai }}</option>
            </select>
          </div>

          <div class="mb-4">
            <label for="hangXe" class="form-label fw-semibold">Hãng xe</label>
            <select id="hangXe" v-model="hangXe" class="form-select">
              <option value="Tat ca">Tất cả hãng xe</option>
              <option v-for="hang in danhSachHangXe" :key="hang" :value="hang">{{ hang }}</option>
            </select>
          </div>

          <div>
            <div class="d-flex justify-content-between align-items-center mb-2">
              <label for="giaThue" class="form-label fw-semibold mb-0">Giá thuê tối đa</label>
              <span class="small text-primary fw-semibold">{{ dinhDangTien(giaThue) }}đ</span>
            </div>
            <input id="giaThue" v-model.number="giaThue" type="range" class="form-range" min="50000" max="500000" step="25000" />
            <div class="d-flex justify-content-between small text-secondary">
              <span>50.000đ</span>
              <span>500.000đ</span>
            </div>
          </div>
        </section>
      </aside>

      <section class="col-12 col-lg-9">
        <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-3">
          <p class="text-secondary mb-0">Tìm thấy <strong class="text-dark">{{ xeDaLoc.length }}</strong> xe phù hợp</p>
          <select v-model="sapXep" class="form-select form-select-sm sort-select" aria-label="Sắp xếp danh sách xe">
            <option value="giaTang">Giá thấp đến cao</option>
            <option value="giaGiam">Giá cao đến thấp</option>
            <option value="tenXe">Tên xe A-Z</option>
          </select>
        </div>

        <div v-if="isLoadingVehicles" class="empty-state bg-white border rounded-4 text-center p-5">
          <span class="spinner-border text-primary mb-3" role="status" aria-hidden="true"></span>
          <p class="text-secondary mb-0">Đang tải danh sách xe...</p>
        </div>

        <div v-else-if="vehicleError" class="alert alert-danger" role="alert">
          {{ vehicleError }}
        </div>

        <div v-else-if="xeDaLoc.length" class="row g-4">
          <div v-for="xe in xeDaLoc" :key="xe.maXe" class="col-12 col-md-6">
            <VehicleCard :xe="xe" @chon-xe="chonXe" />
          </div>
        </div>

        <div v-else class="empty-state bg-white border rounded-4 text-center p-5">
          <i class="bi bi-search text-secondary fs-1" aria-hidden="true"></i>
          <h2 class="h5 fw-bold mt-3">Chưa tìm thấy xe phù hợp</h2>
          <p class="text-secondary mb-3">Hãy thử nới rộng bộ lọc để xem thêm lựa chọn.</p>
          <button type="button" class="btn btn-primary" @click="datLaiBoLoc">Xóa bộ lọc</button>
        </div>

      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import VehicleCard from '@/components/VehicleCard.vue'
import api, { getApiErrorMessage } from '@/services/api'

const loaiXe = ref('Tat ca')
const hangXe = ref('Tat ca')
const giaThue = ref(500000)
const sapXep = ref('giaTang')
const danhSachXe = ref([])
const isLoadingVehicles = ref(true)
const vehicleError = ref('')
const router = useRouter()

const danhSachLoaiXe = computed(() => [...new Set(danhSachXe.value.map((xe) => xe.loaiXe))])
const danhSachHangXe = computed(() => [...new Set(danhSachXe.value.map((xe) => xe.hangXe))])

const xeDaLoc = computed(() => {
  const ketQua = danhSachXe.value.filter((xe) => {
    const dungLoaiXe = loaiXe.value === 'Tat ca' || xe.loaiXe === loaiXe.value
    const dungHangXe = hangXe.value === 'Tat ca' || xe.hangXe === hangXe.value
    const dungGiaThue = xe.giaThue <= giaThue.value

    return dungLoaiXe && dungHangXe && dungGiaThue
  })

  return [...ketQua].sort((xeA, xeB) => {
    if (sapXep.value === 'giaGiam') return xeB.giaThue - xeA.giaThue
    if (sapXep.value === 'tenXe') return xeA.tenXe.localeCompare(xeB.tenXe)
    return xeA.giaThue - xeB.giaThue
  })
})

async function taiDanhSachXe() {
  try {
    const { data: result } = await api.get('/vehicles')
    danhSachXe.value = result.data ?? []
  } catch (error) {
    vehicleError.value = getApiErrorMessage(error, 'Không thể tải danh sách xe.')
  } finally {
    isLoadingVehicles.value = false
  }
}

onMounted(taiDanhSachXe)

function datLaiBoLoc() {
  loaiXe.value = 'Tat ca'
  hangXe.value = 'Tat ca'
  giaThue.value = 500000
  sapXep.value = 'giaTang'
}

function chonXe(xe) {
  router.push({ name: 'ChiTietXe', params: { maXe: xe.maXe } })
}

function dinhDangTien(gia) {
  return new Intl.NumberFormat('vi-VN').format(gia)
}
</script>

<style scoped>
.filter-panel {
  border-color: var(--border-color) !important;
  top: 1.5rem;
}

.form-select,
.sort-select {
  border-color: var(--border-color);
}

.form-select:focus,
.form-range:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.25rem rgba(37, 99, 235, 0.12);
}

.form-range::-webkit-slider-thumb {
  background-color: var(--primary-color);
}

.sort-select {
  width: min(100%, 12rem);
}

.empty-state {
  border-color: var(--border-color) !important;
}
</style>