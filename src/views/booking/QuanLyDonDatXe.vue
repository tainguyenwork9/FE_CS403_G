<template>
  <div class="container py-4 py-lg-5">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4 animate-fade-in">
      <div>
        <p class="text-primary fw-semibold mb-2">TÀI KHOẢN CỦA TÔI</p>
        <h1 class="h2 fw-bold mb-2">Quản lý đơn đặt xe</h1>
        <p class="text-secondary mb-0">
          Theo dõi lịch sử đặt xe, trạng thái thanh toán VietQR và thông tin nhận xe của bạn.
        </p>
      </div>
      <div class="d-flex gap-2">
        <button
          type="button"
          class="btn btn-outline-primary"
          :disabled="isLoading"
          @click="taiDanhSachDon"
        >
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          <i v-else class="bi bi-arrow-clockwise me-2" aria-hidden="true"></i>
          Làm mới
        </button>
        <router-link to="/tim-kiem-xe" class="btn btn-primary fw-semibold">
          <i class="bi bi-plus-lg me-1" aria-hidden="true"></i>
          Đặt xe mới
        </router-link>
      </div>
    </div>

    <!-- Thẻ thống kê nhanh -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-lg-3">
        <div class="bg-white border rounded-4 shadow-sm p-3 p-md-4 h-100">
          <span class="small text-secondary d-block mb-1">Tổng số đơn</span>
          <strong class="fs-2 fw-bold text-dark">{{ danhSachDon.length }}</strong>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="bg-white border rounded-4 shadow-sm p-3 p-md-4 h-100">
          <span class="small text-secondary d-block mb-1">Chờ thanh toán</span>
          <strong class="fs-2 fw-bold text-warning">{{ demTheoTrangThai(['PENDING_PAYMENT', 'PAYMENT_MISMATCH']) }}</strong>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="bg-white border rounded-4 shadow-sm p-3 p-md-4 h-100">
          <span class="small text-secondary d-block mb-1">Đã thanh toán</span>
          <strong class="fs-2 fw-bold text-success">{{ demTheoTrangThai(['PAID', 'CONFIRMED']) }}</strong>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="bg-white border rounded-4 shadow-sm p-3 p-md-4 h-100">
          <span class="small text-secondary d-block mb-1">Đã hủy / Hết hạn</span>
          <strong class="fs-2 fw-bold text-secondary">{{ demTheoTrangThai(['CANCELLED', 'EXPIRED']) }}</strong>
        </div>
      </div>
    </div>

    <!-- Thanh tìm kiếm & lọc theo trạng thái -->
    <section class="bg-white border rounded-4 shadow-sm p-3 p-md-4 mb-4">
      <div class="row g-3 align-items-center">
        <div class="col-12 col-lg-4">
          <div class="input-group">
            <span class="input-group-text bg-light border-end-0">
              <i class="bi bi-search text-secondary" aria-hidden="true"></i>
            </span>
            <input
              v-model="tuKhoa"
              type="search"
              class="form-control border-start-0"
              placeholder="Tìm theo mã đơn, mã CK (THUEXE_...), tên xe, biển số..."
            />
          </div>
        </div>
        <div class="col-12 col-lg-8">
          <div class="d-flex flex-wrap justify-content-lg-end gap-2">
            <button
              v-for="tab in cacTabTrangThai"
              :key="tab.value"
              type="button"
              class="btn btn-sm rounded-pill px-3"
              :class="boLocTrangThai === tab.value ? 'btn-primary fw-semibold' : 'btn-outline-secondary'"
              @click="boLocTrangThai = tab.value"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Thông báo thao tác -->
    <div v-if="actionMessage" class="alert rounded-4 mb-4" :class="actionError ? 'alert-danger' : 'alert-success'" role="status">
      {{ actionMessage }}
    </div>

    <!-- Trạng thái Loading -->
    <div v-if="isLoading" class="bg-white border rounded-4 shadow-sm text-center p-5">
      <span class="spinner-border text-primary mb-3" role="status" aria-hidden="true"></span>
      <p class="text-secondary mb-0">Đang tải danh sách đơn đặt xe của bạn...</p>
    </div>

    <!-- Trạng thái Lỗi khi gọi API -->
    <div v-else-if="errorMessage" class="alert alert-danger rounded-4 shadow-sm p-4" role="alert">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <span><i class="bi bi-exclamation-octagon me-2"></i>{{ errorMessage }}</span>
        <button type="button" class="btn btn-sm btn-outline-danger" @click="taiDanhSachDon">Thử lại</button>
      </div>
    </div>

    <!-- Danh sách đơn đặt xe -->
    <div v-else-if="donDaLoc.length" class="row g-4">
      <div v-for="don in donDaLoc" :key="don.id" class="col-12">
        <article class="booking-item bg-white border rounded-4 shadow-sm p-4 animate-fade-in">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom pb-3 mb-3 gap-2">
            <div class="d-flex align-items-center flex-wrap gap-2">
              <span class="fw-bold fs-5 text-dark">Đơn #{{ don.id }}</span>
              <span class="badge bg-light text-secondary border font-monospace">
                {{ don.transfer_code }}
              </span>
              <span class="small text-secondary">
                · Tạo lúc {{ dinhDangNgayGio(don.created_at) }}
              </span>
            </div>
            <div>
              <span class="badge rounded-pill px-3 py-2" :class="layBadgeClass(don.status)">
                <i :class="layIconTrangThai(don.status)" class="me-1" aria-hidden="true"></i>
                {{ dinhDangTrangThai(don.status) }}
              </span>
            </div>
          </div>

          <div class="row g-4 align-items-center">
            <div class="col-12 col-md-5">
              <div class="d-flex align-items-center gap-3">
                <img
                  v-if="don.vehicle?.hinhAnh"
                  :src="don.vehicle.hinhAnh"
                  :alt="don.vehicle?.tenXe"
                  class="vehicle-thumb rounded-3 border flex-shrink-0"
                />
                <div
                  v-else
                  class="vehicle-thumb rounded-3 border bg-light d-flex align-items-center justify-content-center text-secondary flex-shrink-0"
                >
                  <i class="bi bi-bicycle fs-3" aria-hidden="true"></i>
                </div>
                <div>
                  <p class="small text-primary fw-semibold mb-1">
                    {{ don.vehicle?.hangXe || 'MotoRent' }} · {{ don.vehicle?.loaiXe || 'Xe máy' }}
                  </p>
                  <h2 class="h5 fw-bold mb-1">
                    {{ don.vehicle?.tenXe || `Xe #${don.car_id}` }}
                  </h2>
                  <p class="small text-secondary mb-0">
                    Mã xe: <strong>{{ don.vehicle?.maXe || `MX00${don.car_id}` }}</strong>
                    <span v-if="don.vehicle?.bienSo"> · Biển số: <strong>{{ don.vehicle.bienSo }}</strong></span>
                  </p>
                </div>
              </div>
            </div>

            <div class="col-12 col-md-4">
              <div class="bg-light rounded-3 p-3 small">
                <div class="d-flex justify-content-between mb-1">
                  <span class="text-secondary">Nhận xe (`start_date`):</span>
                  <strong class="text-dark">{{ dinhDangNgayGio(don.start_date) }}</strong>
                </div>
                <div class="d-flex justify-content-between mb-1">
                  <span class="text-secondary">Trả xe (`end_date`):</span>
                  <strong class="text-dark">{{ dinhDangNgayGio(don.end_date) }}</strong>
                </div>
                <div v-if="don.options && don.options.length" class="border-top pt-2 mt-2">
                  <span class="text-secondary d-block mb-1">Tuỳ chọn đi kèm:</span>
                  <span
                    v-for="(opt, idx) in don.options"
                    :key="idx"
                    class="badge bg-white text-dark border me-1 mb-1 fw-normal"
                  >
                    {{ opt.name || opt }}
                  </span>
                </div>
              </div>
            </div>

            <div class="col-12 col-md-3 text-md-end">
              <span class="small text-secondary d-block">Tổng tiền (`total_amount`)</span>
              <strong class="fs-4 text-primary d-block mb-3">{{ dinhDangTien(don.total_amount) }}đ</strong>

              <div class="d-flex flex-wrap justify-content-md-end gap-2">
                <router-link
                  v-if="don.status === 'PENDING_PAYMENT' || don.status === 'PAYMENT_MISMATCH'"
                  :to="{ name: 'ThanhToanBooking', params: { id: don.id } }"
                  class="btn btn-sm btn-primary fw-semibold"
                >
                  <i class="bi bi-qr-code-scan me-1" aria-hidden="true"></i>
                  Thanh toán QR
                </router-link>

                <router-link
                  v-else-if="don.status === 'PAID' || don.status === 'CONFIRMED'"
                  :to="{ name: 'ThanhToanBooking', params: { id: don.id } }"
                  class="btn btn-sm btn-outline-success fw-semibold"
                >
                  <i class="bi bi-file-earmark-check me-1" aria-hidden="true"></i>
                  Xem hợp đồng
                </router-link>

                <button
                  type="button"
                  class="btn btn-sm btn-outline-secondary"
                  @click="moChiTietDon(don)"
                >
                  Chi tiết
                </button>

                <button
                  v-if="don.status === 'PENDING_PAYMENT' || don.status === 'PAYMENT_MISMATCH'"
                  type="button"
                  class="btn btn-sm btn-outline-danger"
                  :disabled="cancellingId === don.id"
                  @click="huyDonDatXe(don)"
                >
                  <span
                    v-if="cancellingId === don.id"
                    class="spinner-border spinner-border-sm me-1"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Hủy đơn
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>

    <!-- Trạng thái Rỗng -->
    <div v-else class="bg-white border rounded-4 shadow-sm text-center p-5">
      <i class="bi bi-calendar2-x text-secondary display-4" aria-hidden="true"></i>
      <h2 class="h5 fw-bold mt-3">Chưa có đơn đặt xe nào</h2>
      <p class="text-secondary mb-4">
        Bạn chưa có đơn đặt xe nào khớp với bộ lọc hiện tại. Hãy khám phá đội xe và đặt chuyến đi ngay!
      </p>
      <router-link to="/tim-kiem-xe" class="btn btn-primary px-4">
        Tìm kiếm xe ngay
      </router-link>
    </div>

    <!-- Modal xem chi tiết đơn đặt xe -->
    <div
      v-if="donDangXem"
      class="modal-backdrop-custom"
      role="dialog"
      aria-modal="true"
      @click.self="dongChiTietDon"
    >
      <section class="booking-modal bg-white border rounded-4 shadow-lg p-4 p-md-5 animate-fade-in">
        <div class="d-flex justify-content-between align-items-start gap-3 border-bottom pb-3 mb-4">
          <div>
            <p class="text-primary fw-semibold small mb-1">CHI TIẾT ĐƠN ĐẶT XE</p>
            <h2 class="h4 fw-bold mb-0">Đơn #{{ donDangXem.id }} ({{ donDangXem.transfer_code }})</h2>
          </div>
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary rounded-circle"
            aria-label="Đóng"
            @click="dongChiTietDon"
          >
            <i class="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </div>

        <div class="row g-3 small mb-4">
          <div class="col-6">
            <span class="text-secondary d-block">Trạng thái (`status`)</span>
            <span class="badge rounded-pill mt-1" :class="layBadgeClass(donDangXem.status)">
              {{ dinhDangTrangThai(donDangXem.status) }}
            </span>
          </div>
          <div class="col-6">
            <span class="text-secondary d-block">Mã nội dung CK (`transfer_code`)</span>
            <strong class="font-monospace fs-6 text-primary">{{ donDangXem.transfer_code }}</strong>
          </div>
          <div class="col-6">
            <span class="text-secondary d-block">Xe thuê (`car_id`)</span>
            <strong>{{ donDangXem.vehicle?.tenXe || `#${donDangXem.car_id}` }}</strong>
            <span v-if="donDangXem.vehicle?.bienSo" class="text-secondary d-block">
              Biển số: {{ donDangXem.vehicle.bienSo }}
            </span>
          </div>
          <div class="col-6">
            <span class="text-secondary d-block">Tổng thanh toán (`total_amount`)</span>
            <strong class="fs-5 text-primary">{{ dinhDangTien(donDangXem.total_amount) }}đ</strong>
          </div>
          <div class="col-6">
            <span class="text-secondary d-block">Thời gian bắt đầu (`start_date`)</span>
            <strong>{{ dinhDangNgayGio(donDangXem.start_date) }}</strong>
          </div>
          <div class="col-6">
            <span class="text-secondary d-block">Thời gian kết thúc (`end_date`)</span>
            <strong>{{ dinhDangNgayGio(donDangXem.end_date) }}</strong>
          </div>
          <div v-if="donDangXem.expires_at" class="col-6">
            <span class="text-secondary d-block">Hạn thanh toán (`expires_at`)</span>
            <strong>{{ dinhDangNgayGio(donDangXem.expires_at) }}</strong>
          </div>
          <div class="col-6">
            <span class="text-secondary d-block">Ngày tạo đơn (`created_at`)</span>
            <strong>{{ dinhDangNgayGio(donDangXem.created_at) }}</strong>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2 border-top pt-3">
          <button type="button" class="btn btn-outline-secondary" @click="dongChiTietDon">
            Đóng
          </button>
          <router-link
            :to="{ name: 'ThanhToanBooking', params: { id: donDangXem.id } }"
            class="btn btn-primary fw-semibold"
          >
            Đi tới trang Thanh toán / Hợp đồng
          </router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import api, { getApiErrorMessage } from '@/services/api'

const danhSachDon = ref([])
const isLoading = ref(true)
const errorMessage = ref('')
const actionMessage = ref('')
const actionError = ref(false)
const cancellingId = ref(null)
const tuKhoa = ref('')
const boLocTrangThai = ref('ALL')
const donDangXem = ref(null)

const cacTabTrangThai = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PENDING_PAYMENT', label: 'Chờ thanh toán' },
  { value: 'PAID', label: 'Đã thanh toán' },
  { value: 'PAYMENT_MISMATCH', label: 'Sai lệch TT' },
  { value: 'CANCELLED', label: 'Đã hủy' },
  { value: 'EXPIRED', label: 'Hết hạn' }
]

const donDaLoc = computed(() => {
  const keyword = tuKhoa.value.trim().toLowerCase()

  return danhSachDon.value.filter((don) => {
    const hopTrangThai =
      boLocTrangThai.value === 'ALL' ||
      (boLocTrangThai.value === 'PAID'
        ? ['PAID', 'CONFIRMED'].includes(don.status)
        : don.status === boLocTrangThai.value)

    const hopTuKhoa =
      !keyword ||
      [
        String(don.id),
        don.transfer_code,
        don.vehicle?.tenXe,
        don.vehicle?.bienSo,
        don.vehicle?.maXe
      ]
        .filter(Boolean)
        .some((val) => String(val).toLowerCase().includes(keyword))

    return hopTrangThai && hopTuKhoa
  })
})

async function taiDanhSachDon() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const { data: result } = await api.get('/bookings')
    danhSachDon.value = result.data || []
  } catch (error) {
    errorMessage.value = getApiErrorMessage(error, 'Không thể tải danh sách đơn đặt xe.')
  } finally {
    isLoading.value = false
  }
}

async function huyDonDatXe(don) {
  cancellingId.value = don.id
  actionMessage.value = ''
  actionError.value = false

  try {
    const { data: result } = await api.post(`/bookings/${don.id}/cancel`)
    const updated = result.data
    const idx = danhSachDon.value.findIndex((item) => item.id === don.id)
    if (idx !== -1 && updated) {
      danhSachDon.value[idx] = updated
    } else {
      don.status = 'CANCELLED'
    }
    actionMessage.value = result.message || `Đã hủy đơn đặt xe #${don.id} thành công.`
  } catch (error) {
    actionError.value = true
    actionMessage.value = getApiErrorMessage(error, 'Không thể hủy đơn đặt xe này.')
  } finally {
    cancellingId.value = null
  }
}

function demTheoTrangThai(dsTrangThai) {
  return danhSachDon.value.filter((don) => dsTrangThai.includes(don.status)).length
}

function moChiTietDon(don) {
  donDangXem.value = don
}

function dongChiTietDon() {
  donDangXem.value = null
}

function dinhDangTrangThai(status) {
  const map = {
    PENDING_PAYMENT: 'Chờ thanh toán',
    CONFIRMED: 'Đã xác nhận',
    PAID: 'Đã thanh toán',
    PAYMENT_MISMATCH: 'Sai lệch số tiền',
    CANCELLED: 'Đã hủy',
    EXPIRED: 'Hết hạn thanh toán'
  }
  return map[status] || status
}

function layBadgeClass(status) {
  if (['PAID', 'CONFIRMED'].includes(status)) {
    return 'bg-success-subtle text-success-emphasis'
  }
  if (status === 'PENDING_PAYMENT') {
    return 'bg-warning-subtle text-warning-emphasis'
  }
  if (status === 'PAYMENT_MISMATCH') {
    return 'bg-danger-subtle text-danger-emphasis'
  }
  return 'bg-secondary-subtle text-secondary-emphasis'
}

function layIconTrangThai(status) {
  if (['PAID', 'CONFIRMED'].includes(status)) return 'bi bi-check-circle-fill'
  if (status === 'PENDING_PAYMENT') return 'bi bi-hourglass-split'
  if (status === 'PAYMENT_MISMATCH') return 'bi bi-exclamation-triangle-fill'
  return 'bi bi-x-circle'
}

function dinhDangTien(gia) {
  return new Intl.NumberFormat('vi-VN').format(gia || 0)
}

function dinhDangNgayGio(isoString) {
  if (!isoString) return ''
  return new Date(isoString).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

onMounted(taiDanhSachDon)
</script>

<style scoped>
.vehicle-thumb {
  width: 96px;
  height: 72px;
  object-fit: cover;
}

.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  z-index: 1050;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.55);
}

.booking-modal {
  width: min(100%, 620px);
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
}
</style>

