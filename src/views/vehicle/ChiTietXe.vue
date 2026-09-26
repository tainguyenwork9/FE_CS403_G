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
        <div class="detail-image-panel bg-white border rounded-4 shadow-sm overflow-hidden animate-fade-in">
          <div class="detail-image-wrap">
            <img :src="xe.hinhAnh" :alt="xe.tenXe" class="detail-image w-100" />
          </div>
        </div>
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

          <h2 class="h6 fw-bold mb-3">Thông số xe</h2>
          <dl class="spec-list row g-0 mb-4">
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

          <button type="button" class="btn btn-primary btn-lg w-100 fw-semibold" @click="datXe">
            <i class="bi bi-calendar2-check me-2" aria-hidden="true"></i>
            Đặt xe ngay
          </button>
          <p class="small text-secondary text-center mt-3 mb-0">
            <i class="bi bi-shield-check me-1" aria-hidden="true"></i>
            Không thu phí cho đến khi xác nhận đặt xe
          </p>
        </section>

        <div v-if="daDatXe" class="alert alert-success mt-4 mb-0" role="status">
          Yêu cầu đặt <strong>{{ xe.tenXe }}</strong> đã được ghi nhận trên giao diện.
        </div>
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
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api, { getApiErrorMessage } from '@/services/api'

const route = useRoute()
const daDatXe = ref(false)
const xe = ref(null)
const isLoading = ref(true)
const vehicleError = ref('')

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

function datXe() {
  daDatXe.value = true
}

function dinhDangTien(gia) {
  return new Intl.NumberFormat('vi-VN').format(gia)
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
    top: 1.5rem;
  }
}
</style>