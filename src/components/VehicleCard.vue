<template>
  <article class="vehicle-card card h-100 border-0 shadow-sm overflow-hidden">
    <div class="vehicle-image-wrap position-relative">
      <img :src="xe.hinhAnh" :alt="xe.tenXe" class="vehicle-image w-100" />
      <span class="availability-badge position-absolute top-0 end-0 m-3 badge rounded-pill bg-success-subtle text-success-emphasis">
        <i class="bi bi-check-circle me-1" aria-hidden="true"></i>
        {{ xe.tinhTrang }}
      </span>
    </div>

    <div class="card-body d-flex flex-column p-4">
      <div class="d-flex justify-content-between align-items-start gap-3 mb-2">
        <div>
          <p class="small text-primary fw-semibold mb-1">{{ xe.hangXe }} · {{ xe.loaiXe }}</p>
          <h2 class="h5 fw-bold mb-0">{{ xe.tenXe }}</h2>
        </div>
        <span class="small text-secondary text-nowrap">{{ xe.maXe }}</span>
      </div>

      <div class="vehicle-specs row g-2 border-top border-bottom py-3 my-3">
        <div class="col-6 small text-secondary">
          <i class="bi bi-palette me-1" aria-hidden="true"></i>{{ xe.mauSac }}
        </div>
        <div class="col-6 small text-secondary">
          <i class="bi bi-calendar3 me-1" aria-hidden="true"></i>{{ xe.namSanXuat }}
        </div>
        <div class="col-12 small text-secondary">
          <i class="bi bi-card-text me-1" aria-hidden="true"></i>{{ xe.bienSo }}
        </div>
      </div>

      <div class="d-flex justify-content-between align-items-end gap-3 mt-auto">
        <div>
          <span class="small text-secondary d-block">Giá thuê từ</span>
          <strong class="text-primary fs-5">{{ dinhDangTien(xe.giaThue) }}đ</strong>
          <span class="small text-secondary"> / ngày</span>
        </div>
        <button type="button" class="btn btn-outline-primary btn-sm" @click="$emit('chon-xe', xe)">
          Chọn xe
          <i class="bi bi-arrow-up-right ms-1" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({
  xe: {
    type: Object,
    required: true
  }
})

defineEmits(['chon-xe'])

function dinhDangTien(giaThue) {
  return new Intl.NumberFormat('vi-VN').format(giaThue)
}
</script>

<style scoped>
.vehicle-card {
  border: 1px solid var(--border-color) !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.vehicle-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 1rem 2rem rgba(15, 23, 42, 0.1) !important;
}

.vehicle-image-wrap {
  aspect-ratio: 16 / 10;
  background-color: var(--primary-light);
}

.vehicle-image {
  height: 100%;
  object-fit: cover;
}

.availability-badge {
  backdrop-filter: blur(6px);
}

.vehicle-specs {
  border-color: var(--border-color) !important;
}
</style>