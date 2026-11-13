<template>
  <div class="container py-4 py-lg-5">
    <div v-if="isLoading" class="bg-white border rounded-4 shadow-sm p-5 text-center">
      <span class="spinner-border text-primary mb-3" role="status" aria-hidden="true"></span>
      <p class="text-secondary mb-0">Đang tải thông tin thanh toán đơn đặt xe...</p>
    </div>

    <div v-else-if="loadError" class="alert alert-danger rounded-4 shadow-sm p-4" role="alert">
      <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h2 class="h5 fw-bold mb-1">Không thể tải thông tin đơn đặt xe</h2>
          <p class="mb-0">{{ loadError }}</p>
        </div>
        <router-link to="/tim-kiem-xe" class="btn btn-outline-danger">Quay lại danh sách xe</router-link>
      </div>
    </div>

    <!-- Màn hình Đặt xe thành công (Redirect tự động khi PAID / CONFIRMED) -->
    <section
      v-else-if="isPaid && booking"
      class="success-panel bg-white border rounded-4 shadow-sm p-4 p-md-5 text-center mx-auto animate-fade-in"
    >
      <div class="success-badge bg-success-subtle text-success rounded-circle mx-auto mb-3">
        <i class="bi bi-check2-circle display-5" aria-hidden="true"></i>
      </div>
      <span class="badge rounded-pill bg-success-subtle text-success-emphasis px-3 py-2 mb-3">
        ĐÃ XÁC NHẬN THANH TOÁN TỰ ĐỘNG
      </span>
      <h1 class="h2 fw-bold mb-2">Đặt xe thành công!</h1>
      <p class="text-secondary mb-4">
        Hệ thống đã ghi nhận giao dịch chuyển khoản cho đơn <strong>#{{ booking.id }}</strong>. Hợp đồng điện tử và xe của bạn đã sẵn sàng.
      </p>

      <div class="contract-card bg-light border rounded-4 p-4 text-start mb-4">
        <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
          <div>
            <span class="small text-secondary d-block">Mã hợp đồng / Mã đơn</span>
            <strong class="fs-5 text-primary">#HD-{{ booking.id }} ({{ booking.transfer_code }})</strong>
          </div>
          <span class="badge bg-success">PAID</span>
        </div>

        <div class="row g-3">
          <div class="col-12 col-sm-6">
            <span class="small text-secondary d-block">Xe thuê</span>
            <strong>{{ booking.vehicle?.tenXe || 'Xe máy MotoRent' }}</strong>
            <span v-if="booking.vehicle?.bienSo" class="small text-secondary d-block">
              Biển số: {{ booking.vehicle.bienSo }}
            </span>
          </div>
          <div class="col-12 col-sm-6">
            <span class="small text-secondary d-block">Tổng tiền đã thanh toán</span>
            <strong class="text-success fs-5">{{ dinhDangTien(booking.total_amount) }}đ</strong>
          </div>
          <div class="col-12 col-sm-6">
            <span class="small text-secondary d-block">Thời gian nhận xe</span>
            <strong>{{ dinhDangNgayGio(booking.start_date) }}</strong>
          </div>
          <div class="col-12 col-sm-6">
            <span class="small text-secondary d-block">Thời gian trả xe</span>
            <strong>{{ dinhDangNgayGio(booking.end_date) }}</strong>
          </div>
          <div class="col-12">
            <span class="small text-secondary d-block">Địa điểm & Hướng dẫn nhận xe</span>
            <p class="mb-0 small fw-medium">
              Quầy giao nhận MotoRent - Vui lòng xuất trình CCCD & GPLX bản gốc trùng khớp với hồ sơ xác thực khi nhận bàn giao xe.
            </p>
          </div>
        </div>
      </div>

      <div class="d-flex flex-wrap justify-content-center gap-3">
        <router-link to="/tim-kiem-xe" class="btn btn-primary px-4 py-2 fw-semibold">
          <i class="bi bi-bicycle me-2" aria-hidden="true"></i>Tiếp tục khám phá đội xe
        </router-link>
        <router-link to="/ho-so-ca-nhan" class="btn btn-outline-secondary px-4 py-2">
          Xem hồ sơ cá nhân
        </router-link>
      </div>
    </section>

    <!-- Màn hình Thanh toán VietQR & Auto-check status -->
    <div v-else-if="booking" class="row g-4 align-items-start animate-fade-in">
      <div class="col-12">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <p class="text-primary fw-semibold mb-1">THANH TOÁN ĐƠN ĐẶT XE #{{ booking.id }}</p>
            <h1 class="h3 fw-bold mb-0">Quét mã VietQR để hoàn tất đặt xe</h1>
          </div>

          <div class="d-flex align-items-center gap-3">
            <div
              class="countdown-box px-3 py-2 rounded-3 border d-flex align-items-center gap-2"
              :class="remainingSeconds <= 60 ? 'bg-danger-subtle border-danger text-danger' : 'bg-warning-subtle border-warning text-dark'"
            >
              <i class="bi bi-stopwatch fs-5" aria-hidden="true"></i>
              <div>
                <span class="small d-block lh-1">Thời gian giữ xe</span>
                <strong class="fs-5">{{ formattedCountdown }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cảnh báo trạng thái ngoại lệ -->
      <div v-if="booking.status === 'EXPIRED' || remainingSeconds <= 0" class="col-12">
        <div class="alert alert-danger rounded-4 d-flex align-items-center justify-content-between flex-wrap gap-3 mb-0">
          <div>
            <strong class="d-block">Đơn đặt xe đã hết hạn thanh toán (EXPIRED)</strong>
            <span>Thời gian giữ xe đã kết thúc và lịch xe đã được giải phóng. Vui lòng tạo yêu cầu thuê xe mới.</span>
          </div>
          <router-link to="/tim-kiem-xe" class="btn btn-danger">Đặt lại xe</router-link>
        </div>
      </div>

      <div v-if="booking.status === 'PAYMENT_MISMATCH'" class="col-12">
        <div class="alert alert-warning rounded-4 mb-0">
          <strong class="d-block"><i class="bi bi-exclamation-triangle me-2"></i>Cảnh báo sai lệch số tiền (PAYMENT_MISMATCH)</strong>
          <span>Hệ thống nhận được giao dịch nhưng số tiền chuyển vào nhỏ hơn tổng tiền cần thanh toán. Cảnh báo đã được gửi tới Quản trị viên để hỗ trợ đối soát.</span>
        </div>
      </div>

      <!-- Cột hiển thị mã VietQR và thông tin chuyển khoản -->
      <div class="col-12 col-lg-7">
        <section class="bg-white border rounded-4 shadow-sm p-4 p-md-5">
          <div class="row g-4 align-items-center">
            <div class="col-12 col-md-6 text-center">
              <div class="qr-frame border rounded-4 p-3 bg-light d-inline-block">
                <img
                  :src="vietQrUrl"
                  :alt="`Mã VietQR thanh toán đơn ${booking.transfer_code}`"
                  class="img-fluid rounded-3 qr-image"
                />
              </div>
              <div class="d-flex align-items-center justify-content-center gap-2 text-secondary small mt-3">
                <template v-if="remainingSeconds > 0 && booking.status !== 'EXPIRED'">
                  <span class="spinner-grow spinner-grow-sm text-primary" role="status" aria-hidden="true"></span>
                  <span>Đang tự động kiểm tra giao dịch mỗi 3 giây (trong 1 phút)...</span>
                </template>
                <span v-else class="text-danger fw-medium">
                  Đã dừng tự động kiểm tra (Hết thời gian 1 phút).
                </span>
              </div>
            </div>

            <div class="col-12 col-md-6">
              <h2 class="h6 fw-bold text-uppercase text-secondary mb-3">Thông tin chuyển khoản</h2>

              <div class="transfer-field border rounded-3 p-3 mb-3">
                <span class="small text-secondary d-block">Ngân hàng thụ hưởng</span>
                <strong>Vietcombank (VCB)</strong>
                <span class="small text-secondary d-block mt-1">Chủ TK: {{ paymentInfo.account_name }}</span>
              </div>

              <div class="transfer-field border rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center gap-2">
                <div>
                  <span class="small text-secondary d-block">Số tài khoản</span>
                  <strong class="fs-5 font-monospace">{{ paymentInfo.account_number }}</strong>
                </div>
                <button
                  type="button"
                  class="btn btn-sm btn-outline-primary text-nowrap"
                  @click="saoChep(paymentInfo.account_number, 'account')"
                >
                  <i :class="copiedField === 'account' ? 'bi bi-check2' : 'bi bi-clipboard'" class="me-1"></i>
                  {{ copiedField === 'account' ? 'Đã chép' : 'Copy' }}
                </button>
              </div>

              <div class="transfer-field border rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center gap-2">
                <div>
                  <span class="small text-secondary d-block">Số tiền thanh toán</span>
                  <strong class="fs-5 text-primary">{{ dinhDangTien(paymentInfo.amount) }}đ</strong>
                </div>
                <button
                  type="button"
                  class="btn btn-sm btn-outline-primary text-nowrap"
                  @click="saoChep(String(paymentInfo.amount), 'amount')"
                >
                  <i :class="copiedField === 'amount' ? 'bi bi-check2' : 'bi bi-clipboard'" class="me-1"></i>
                  {{ copiedField === 'amount' ? 'Đã chép' : 'Copy' }}
                </button>
              </div>

              <div class="transfer-field border border-primary-subtle bg-primary-subtle rounded-3 p-3 d-flex justify-content-between align-items-center gap-2">
                <div>
                  <span class="small text-secondary d-block">Nội dung chuyển khoản (Bắt buộc)</span>
                  <strong class="fs-5 text-primary font-monospace">{{ paymentInfo.description }}</strong>
                </div>
                <button
                  type="button"
                  class="btn btn-sm btn-primary text-nowrap"
                  @click="saoChep(paymentInfo.description, 'description')"
                >
                  <i :class="copiedField === 'description' ? 'bi bi-check2' : 'bi bi-clipboard'" class="me-1"></i>
                  {{ copiedField === 'description' ? 'Đã chép' : 'Copy' }}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Cột tóm tắt đơn thuê xe & Giả lập Webhook test nhanh -->
      <div class="col-12 col-lg-5">
        <section class="bg-white border rounded-4 shadow-sm p-4 mb-4">
          <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
            <h2 class="h5 fw-bold mb-0">Tóm tắt đơn đặt xe</h2>
            <span class="badge rounded-pill bg-warning-subtle text-warning-emphasis">
              {{ booking.status }}
            </span>
          </div>

          <div v-if="booking.vehicle" class="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
            <img
              v-if="booking.vehicle.hinhAnh"
              :src="booking.vehicle.hinhAnh"
              :alt="booking.vehicle.tenXe"
              class="summary-thumb rounded-3 border"
            />
            <div>
              <strong class="d-block fs-5">{{ booking.vehicle.tenXe }}</strong>
              <span class="small text-secondary d-block">
                {{ booking.vehicle.hangXe }} · {{ booking.vehicle.loaiXe }}
              </span>
              <span class="small text-secondary">Mã xe: {{ booking.vehicle.maXe }}</span>
            </div>
          </div>

          <dl class="row g-2 small mb-0">
            <dt class="col-5 text-secondary fw-normal">Mã đơn đặt xe:</dt>
            <dd class="col-7 fw-semibold text-end">#{{ booking.id }}</dd>

            <dt class="col-5 text-secondary fw-normal">Nhận xe:</dt>
            <dd class="col-7 fw-semibold text-end">{{ dinhDangNgayGio(booking.start_date) }}</dd>

            <dt class="col-5 text-secondary fw-normal">Trả xe:</dt>
            <dd class="col-7 fw-semibold text-end">{{ dinhDangNgayGio(booking.end_date) }}</dd>

            <template v-if="booking.options && booking.options.length">
              <dt class="col-5 text-secondary fw-normal">Tuỳ chọn đi kèm:</dt>
              <dd class="col-7 text-end">
                <span v-for="(opt, idx) in booking.options" :key="idx" class="d-block">
                  {{ opt.name || opt }}
                </span>
              </dd>
            </template>

            <dt class="col-5 text-secondary fw-semibold border-top pt-3 mt-2 fs-6">Tổng thanh toán:</dt>
            <dd class="col-7 fw-bold text-primary text-end border-top pt-3 mt-2 fs-5">
              {{ dinhDangTien(booking.total_amount) }}đ
            </dd>
          </dl>
        </section>

        <!-- Công cụ mô phỏng Webhook ngân hàng phục vụ kiểm thử -->
        <section class="bg-white border rounded-4 shadow-sm p-4">
          <h3 class="h6 fw-bold mb-2">
            <i class="bi bi-lightning-charge text-primary me-1"></i>
            Kiểm tra trạng thái / Giả lập biến động số dư
          </h3>
          <p class="small text-secondary mb-3">
            Hệ thống tự động kiểm tra trạng thái đơn định kỳ. Bạn cũng có thể bấm kiểm tra ngay hoặc mô phỏng tín hiệu Webhook từ ngân hàng:
          </p>

          <div class="d-grid gap-2">
            <button
              type="button"
              class="btn btn-outline-primary btn-sm"
              :disabled="isCheckingStatus"
              @click="kiemTraTrangThaiNgay"
            >
              <span v-if="isCheckingStatus" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-arrow-repeat me-1"></i>
              Kiểm tra trạng thái đơn ngay
            </button>

            <button
              type="button"
              class="btn btn-success btn-sm"
              :disabled="isSimulatingWebhook || booking.status === 'EXPIRED'"
              @click="giaLapWebhookThanhToan(true)"
            >
              <span v-if="isSimulatingWebhook" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-check2-all me-1"></i>
              Giả lập Webhook chuyển khoản đúng số tiền
            </button>

            <button
              type="button"
              class="btn btn-outline-warning btn-sm"
              :disabled="isSimulatingWebhook || booking.status === 'EXPIRED'"
              @click="giaLapWebhookThanhToan(false)"
            >
              Giả lập Webhook chuyển thiếu tiền (PAYMENT_MISMATCH)
            </button>
          </div>

          <div v-if="webhookMessage" class="alert alert-info small mt-3 mb-0 py-2">
            {{ webhookMessage }}
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api, { getApiErrorMessage } from '@/services/api'

const route = useRoute()

const booking = ref(null)
const isLoading = ref(true)
const loadError = ref('')
const isCheckingStatus = ref(false)
const isSimulatingWebhook = ref(false)
const webhookMessage = ref('')
const copiedField = ref('')
const remainingSeconds = ref(900)

let pollingTimer = null
let countdownTimer = null

const isPaid = computed(() => {
  return booking.value && ['PAID', 'CONFIRMED'].includes(booking.value.status)
})

const paymentInfo = computed(() => {
  const amount = Math.round(Number(booking.value?.total_amount || 0))
  const description = booking.value?.transfer_code || `THUEXE_${booking.value?.id || ''}`

  return {
    account_number: booking.value?.payment_info?.account_number || '9813002890',
    account_name: booking.value?.payment_info?.account_name || 'NGUYEN LE MINH TUAN',
    amount: booking.value?.payment_info?.amount || amount,
    description: booking.value?.payment_info?.description || description
  }
})

const vietQrUrl = computed(() => {
  if (booking.value?.payment_info?.qr_url) {
    return booking.value.payment_info.qr_url
  }

  const amount = encodeURIComponent(String(paymentInfo.value.amount))
  const addInfo = encodeURIComponent(String(paymentInfo.value.description))
  return `https://img.vietqr.io/image/vcb-9813002890-compact2.svg?amount=${amount}&addInfo=${addInfo}&accountName=NGUYEN%20LE%20MINH%20TUAN`
})

const formattedCountdown = computed(() => {
  const total = Math.max(0, remainingSeconds.value)
  const minutes = String(Math.floor(total / 60)).padStart(2, '0')
  const seconds = String(total % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
})

async function layTrangThaiDon(isInitial = false) {
  if (isInitial) {
    isLoading.value = true
    loadError.value = ''
  }

  try {
    const { data: result } = await api.get(`/bookings/${route.params.id}/status`)
    booking.value = result.data

    if (typeof booking.value?.remaining_seconds === 'number') {
      remainingSeconds.value = booking.value.remaining_seconds
    }

    if (isPaid.value || booking.value?.status === 'EXPIRED') {
      dungBoDemVaPolling()
    }
  } catch (error) {
    if (isInitial) {
      loadError.value = getApiErrorMessage(error, 'Không thể tải trạng thái đơn đặt xe.')
    }
  } finally {
    if (isInitial) {
      isLoading.value = false
    }
  }
}

async function kiemTraTrangThaiNgay() {
  isCheckingStatus.value = true
  try {
    await layTrangThaiDon(false)
  } finally {
    isCheckingStatus.value = false
  }
}

async function giaLapWebhookThanhToan(duSoTien = true) {
  if (!booking.value) return

  isSimulatingWebhook.value = true
  webhookMessage.value = ''

  const simulatedAmount = duSoTien
    ? Number(booking.value.total_amount)
    : Math.max(1000, Number(booking.value.total_amount) - 50000)

  try {
    const { data: result } = await api.post('/payments/webhook', {
      bank_trans_id: `VCB_${booking.value.id}_${Date.now()}`,
      amount: simulatedAmount,
      trans_description: `Chuyen khoan ${booking.value.transfer_code}`,
      booking_id: booking.value.id
    })

    webhookMessage.value = result.message || 'Đã gửi tín hiệu webhook.'
    await layTrangThaiDon(false)
  } catch (error) {
    webhookMessage.value = getApiErrorMessage(error, 'Đã ghi nhận phản hồi từ webhook.')
    await layTrangThaiDon(false)
  } finally {
    isSimulatingWebhook.value = false
  }
}

async function saoChep(giaTri, tenTruong) {
  try {
    await navigator.clipboard.writeText(giaTri)
    copiedField.value = tenTruong
    setTimeout(() => {
      if (copiedField.value === tenTruong) {
        copiedField.value = ''
      }
    }, 2000)
  } catch {
    copiedField.value = ''
  }
}

function batDauPollingVaCountdown() {
  // Short polling mỗi 3 giây kiểm tra trạng thái đơn
  pollingTimer = setInterval(() => {
    if (!isPaid.value && booking.value?.status !== 'EXPIRED') {
      layTrangThaiDon(false)
    }
  }, 3000)

  // Đếm ngược thời gian giữ xe mỗi giây
  countdownTimer = setInterval(() => {
    if (remainingSeconds.value > 0 && !isPaid.value) {
      remainingSeconds.value -= 1
      if (remainingSeconds.value === 0) {
        layTrangThaiDon(false)
      }
    }
  }, 1000)
}

function dungBoDemVaPolling() {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
  }
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

onMounted(async () => {
  await layTrangThaiDon(true)
  if (!isPaid.value && booking.value?.status !== 'EXPIRED') {
    batDauPollingVaCountdown()
  }
})

onUnmounted(() => {
  dungBoDemVaPolling()
})

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
</script>

<style scoped>
.qr-image {
  max-width: 280px;
  width: 100%;
}

.summary-thumb {
  width: 84px;
  height: 64px;
  object-fit: cover;
}

.success-panel {
  max-width: 720px;
}

.success-badge {
  width: 5rem;
  height: 5rem;
  display: grid;
  place-items: center;
}
</style>

