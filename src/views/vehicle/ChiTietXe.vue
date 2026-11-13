<template>
  <div v-if="isLoading" class="container py-5 text-center">
    <span class="spinner-border text-primary" role="status" aria-label="Đang tải thông tin xe"></span>
  </div>

  <div v-else-if="vehicleError" class="container py-5">
    <div class="alert alert-danger" role="alert">{{ vehicleError }}</div>
  </div>

  <div v-else-if="xe" class="container py-4 py-lg-5">
    <nav aria-label="breadcrumb" class="mb-4">
      <ol class="breadcrumb small mb-0">
        <li class="breadcrumb-item"><router-link to="/tim-kiem-xe" class="text-primary">Tìm kiếm xe</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">{{ xe.tenXe }}</li>
      </ol>
    </nav>

    <div class="row g-4 g-xl-5 align-items-start">
      <div class="col-12 col-lg-7">
        <div class="detail-image-panel bg-white border rounded-4 shadow-sm overflow-hidden animate-fade-in mb-4">
          <div class="detail-image-wrap">
            <img :src="xe.hinhAnh" :alt="xe.tenXe" class="detail-image w-100" />
          </div>
        </div>

        <section class="bg-white border rounded-4 shadow-sm p-4 animate-fade-in">
          <h2 class="h6 fw-bold mb-3">Thông số xe</h2>
          <dl class="spec-list row g-0 mb-0">
            <div class="col-6 border-bottom py-3">
              <dt class="small text-secondary fw-normal">Hãng xe</dt>
              <dd class="mb-0 fw-semibold">{{ xe.hangXe }}</dd>
            </div>
            <div class="col-6 border-bottom py-3 ps-3">
              <dt class="small text-secondary fw-normal">Loại xe</dt>
              <dd class="mb-0 fw-semibold">{{ xe.loaiXe }}</dd>
            </div>
            <div class="col-6 border-bottom py-3">
              <dt class="small text-secondary fw-normal">Biển số</dt>
              <dd class="mb-0 fw-semibold">{{ xe.bienSo }}</dd>
            </div>
            <div class="col-6 border-bottom py-3 ps-3">
              <dt class="small text-secondary fw-normal">Màu sắc</dt>
              <dd class="mb-0 fw-semibold">{{ xe.mauSac }}</dd>
            </div>
            <div class="col-6 py-3">
              <dt class="small text-secondary fw-normal">Năm sản xuất</dt>
              <dd class="mb-0 fw-semibold">{{ xe.namSanXuat }}</dd>
            </div>
            <div class="col-6 py-3 ps-3">
              <dt class="small text-secondary fw-normal">Tình trạng</dt>
              <dd class="mb-0 fw-semibold">{{ xe.tinhTrang }}</dd>
            </div>
          </dl>
        </section>
      </div>

      <div class="col-12 col-lg-5">
        <section class="detail-panel bg-white border rounded-4 shadow-sm p-4 p-md-5 animate-fade-in">
          <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
            <div>
              <p class="text-primary fw-semibold mb-2">{{ xe.hangXe }} · {{ xe.loaiXe }}</p>
              <h1 class="h2 fw-bold mb-2">{{ xe.tenXe }}</h1>
              <p class="text-secondary mb-0">Mã xe: {{ xe.maXe }}</p>
            </div>
            <span class="badge rounded-pill bg-success-subtle text-success-emphasis text-nowrap">
              <i class="bi bi-check-circle me-1" aria-hidden="true"></i>{{ xe.tinhTrang }}
            </span>
          </div>

          <div class="price-box bg-primary-subtle rounded-3 p-3 my-4">
            <span class="small text-secondary d-block">Giá thuê mỗi ngày</span>
            <strong class="text-primary display-6 fw-bold">{{ dinhDangTien(xe.giaThue) }}đ</strong>
          </div>

          <form @submit.prevent="taoYeuCauThueXe" novalidate>
            <h2 class="h6 fw-bold mb-3">Chọn thời gian thuê & tuỳ chọn</h2>

            <div class="row g-3 mb-3">
              <div class="col-12 col-sm-6">
                <label for="startDate" class="form-label small fw-semibold">Thời gian nhận xe</label>
                <input
                  id="startDate"
                  v-model="startDate"
                  type="datetime-local"
                  class="form-control"
                  required
                />
              </div>
              <div class="col-12 col-sm-6">
                <label for="endDate" class="form-label small fw-semibold">Thời gian trả xe</label>
                <input
                  id="endDate"
                  v-model="endDate"
                  type="datetime-local"
                  class="form-control"
                  required
                />
              </div>
            </div>

            <div class="mb-3">
              <span class="form-label small fw-semibold d-block mb-2">Tuỳ chọn đi kèm</span>
              <div
                v-for="item in danhSachTuyChon"
                :key="item.id"
                class="form-check d-flex justify-content-between align-items-center border rounded-3 px-3 py-2 mb-2"
              >
                <div>
                  <input
                    :id="item.id"
                    v-model="tuyChonDaChon"
                    :value="item.id"
                    class="form-check-input me-2"
                    type="checkbox"
                  />
                  <label class="form-check-label small fw-medium" :for="item.id">
                    {{ item.name }}
                  </label>
                </div>
                <span class="small fw-semibold text-primary">
                  {{ item.price > 0 ? `+${dinhDangTien(item.price)}đ` : 'Miễn phí' }}
                </span>
              </div>
            </div>

            <div class="bg-light rounded-3 p-3 mb-4">
              <div class="d-flex justify-content-between small text-secondary mb-1">
                <span>Thời lượng thuê dự kiến</span>
                <strong>{{ soNgayThue }} ngày</strong>
              </div>
              <div class="d-flex justify-content-between small text-secondary mb-2">
                <span>Phí tuỳ chọn đi kèm</span>
                <strong>{{ dinhDangTien(phiTuyChon) }}đ</strong>
              </div>
              <div class="d-flex justify-content-between align-items-center border-top pt-2">
                <span class="fw-semibold">Tổng thanh toán (AMOUNT)</span>
                <strong class="fs-5 text-primary">{{ dinhDangTien(tongTienDuKien) }}đ</strong>
              </div>
            </div>

            <button
              type="submit"
              class="btn btn-primary btn-lg w-100 fw-semibold"
              :disabled="isSubmittingBooking"
            >
              <span
                v-if="isSubmittingBooking"
                class="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              <i v-else class="bi bi-qr-code-scan me-2" aria-hidden="true"></i>
              {{ isSubmittingBooking ? 'Đang khởi tạo đơn...' : 'Tạo yêu cầu thuê xe' }}
            </button>
          </form>

          <div v-if="bookingError" class="alert alert-danger mt-3 mb-0 small" role="alert">
            {{ bookingError }}
          </div>

          <p class="small text-secondary text-center mt-3 mb-0">
            <i class="bi bi-shield-check me-1" aria-hidden="true"></i>
            Thanh toán tự động 24/7 qua mã VietQR
          </p>
        </section>
      </div>
    </div>
  </div>

  <div v-else class="container py-5">
    <div class="alert alert-warning" role="alert">
      Không tìm thấy thông tin xe cần xem.
      <router-link to="/tim-kiem-xe" class="alert-link">Quay lại danh sách xe</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api, { getApiErrorMessage } from '@/services/api'

const route = useRoute()
const router = useRouter()

const xe = ref(null)
const isLoading = ref(true)
const vehicleError = ref('')
const isSubmittingBooking = ref(false)
const bookingError = ref('')

function getDefaultDateTimeString(addHours = 1) {
  const date = new Date(Date.now() + addHours * 3600 * 1000)
  date.setMinutes(0, 0, 0)
  const tzOffset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16)
}

const startDate = ref(getDefaultDateTimeString(2))
const endDate = ref(getDefaultDateTimeString(26))

const danhSachTuyChon = [
  { id: 'helmet_pair', name: '2 Mũ bảo hiểm đạt chuẩn + Áo mưa', price: 0 },
  { id: 'insurance', name: 'Gói bảo hiểm chuyến đi toàn diện', price: 30000 },
  { id: 'home_delivery', name: 'Giao xe tận nơi trong nội thành', price: 50000 }
]

const tuyChonDaChon = ref(['helmet_pair'])

const soNgayThue = computed(() => {
  const start = new Date(startDate.value)
  const end = new Date(endDate.value)
  const diffMs = end.getTime() - start.getTime()

  if (Number.isNaN(diffMs) || diffMs <= 0) {
    return 1
  }

  const hours = Math.max(1, diffMs / (1000 * 60 * 60))
  return Math.max(1, Math.ceil(hours / 24))
})

const phiTuyChon = computed(() => {
  return danhSachTuyChon
    .filter((opt) => tuyChonDaChon.value.includes(opt.id))
    .reduce((sum, opt) => sum + opt.price, 0)
})

const tongTienDuKien = computed(() => {
  const giaXe = Number(xe.value?.giaThue || 0)
  return soNgayThue.value * giaXe + phiTuyChon.value
})

async function taiThongTinXe() {
  try {
    const { data: result } = await api.get(`/vehicles/${route.params.maXe}`)
    xe.value = result.data
  } catch (error) {
    vehicleError.value = getApiErrorMessage(error, 'Không thể tải thông tin xe.')
  } finally {
    isLoading.value = false
  }
}

onMounted(taiThongTinXe)

async function taoYeuCauThueXe() {
  bookingError.value = ''

  const token = localStorage.getItem('auth_token')
  if (!token) {
    router.push('/dang-nhap')
    return
  }

  const start = new Date(startDate.value)
  const end = new Date(endDate.value)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    bookingError.value = 'Thời gian trả xe phải sau thời gian nhận xe.'
    return
  }

  isSubmittingBooking.value = true

  try {
    const selectedOptionsPayload = danhSachTuyChon.filter((opt) =>
      tuyChonDaChon.value.includes(opt.id)
    )

    const { data: result } = await api.post('/bookings', {
      car_id: xe.value.maXe,
      start_date: startDate.value,
      end_date: endDate.value,
      options: selectedOptionsPayload,
      total_amount: tongTienDuKien.value
    })

    const bookingData = result.data
    router.push({
      name: 'ThanhToanBooking',
      params: { id: bookingData.id || bookingData.booking_id }
    })
  } catch (error) {
    bookingError.value = getApiErrorMessage(error, 'Không thể khởi tạo đơn đặt xe.')
  } finally {
    isSubmittingBooking.value = false
  }
}

function dinhDangTien(gia) {
  return new Intl.NumberFormat('vi-VN').format(gia || 0)
}
</script>

<style scoped>
.detail-image-panel,
.detail-panel {
  border-color: var(--border-color) !important;
}

.detail-image-wrap {
  aspect-ratio: 4 / 3;
  background-color: var(--primary-light);
}

.detail-image {
  height: 100%;
  object-fit: cover;
}

.price-box {
  border: 1px solid rgba(37, 99, 235, 0.12);
}

.spec-list > div {
  border-color: var(--border-color) !important;
}

@media (min-width: 992px) {
  .detail-panel {
    position: sticky;
    top: 6rem;
  }
}
</style>
