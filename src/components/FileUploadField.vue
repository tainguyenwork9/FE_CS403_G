<template>
  <div>
    <label :for="id" class="form-label fw-semibold">{{ label }}</label>
    <label :for="id" class="upload-box d-flex flex-column align-items-center justify-content-center text-center rounded-3 p-3">
      <img v-if="preview" :src="preview" :alt="`Xem trước ${label}`" class="upload-preview rounded-2 mb-2" />
      <i v-else class="bi bi-cloud-arrow-up text-primary fs-3 mb-2" aria-hidden="true"></i>
      <span class="small fw-semibold text-dark">{{ preview ? 'Đổi ảnh' : 'Tải ảnh lên' }}</span>
      <span class="small text-secondary mt-1">JPG hoặc PNG</span>
    </label>
    <input :id="id" class="visually-hidden" type="file" accept="image/jpeg,image/png" @change="$emit('change', $event)" />
  </div>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  preview: {
    type: String,
    default: ''
  }
})

defineEmits(['change'])
</script>

<style scoped>
.upload-box {
  min-height: 9rem;
  border: 1px dashed var(--border-color);
  background-color: var(--background-color);
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.upload-box:hover {
  border-color: var(--primary-color);
  background-color: var(--primary-light);
}

.upload-preview {
  width: 100%;
  height: 5rem;
  object-fit: cover;
}
</style>