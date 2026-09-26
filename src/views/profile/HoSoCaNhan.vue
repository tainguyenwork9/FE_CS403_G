<template>
  <div class="container py-4 py-lg-5">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4 animate-fade-in">
      <div>
        <p class="text-primary fw-semibold mb-2">TÀI KHOẢN CỦA TÔI</p>
        <h1 class="h2 fw-bold mb-2">Hồ sơ cá nhân</h1>
        <p class="text-secondary mb-0">Hoàn thiện thông tin để quá trình thuê xe diễn ra nhanh chóng.</p>
      </div>
      <span class="badge rounded-pill bg-warning-subtle text-warning-emphasis px-3 py-2 align-self-start align-self-md-auto">
        <i class="bi bi-clock me-1" aria-hidden="true"></i>
        {{ trangThai }}
      </span>
    </div>

    <form @submit.prevent="xuLyLuuHoSo" novalidate>
      <div class="row g-4">
        <div class="col-12 col-lg-7">
          <section class="profile-section bg-white border rounded-4 shadow-sm p-4 p-md-5 h-100 animate-fade-in">
            <div class="section-heading d-flex align-items-center gap-3 mb-4">
              <div class="section-icon bg-primary-subtle text-primary rounded-3">
                <i class="bi bi-person-vcard" aria-hidden="true"></i>
              </div>
              <div>
                <h2 class="h5 fw-bold mb-1">Thông tin cá nhân</h2>
                <p class="small text-secondary mb-0">Thông tin liên hệ của khách hàng</p>
              </div>
            </div>

            <div class="row g-3">
              <div class="col-12">
                <label for="hoTen" class="form-label fw-semibold">Họ và tên</label>
                <input id="hoTen" v-model="hoTen" type="text" class="form-control" placeholder="Nguyễn Văn A" required />
              </div>
              <div class="col-12 col-md-6">
                <label for="ngaySinh" class="form-label fw-semibold">Ngày sinh</label>
                <input id="ngaySinh" v-model="ngaySinh" type="date" class="form-control" required />
              </div>
              <div class="col-12 col-md-6">
                <label for="soDienThoai" class="form-label fw-semibold">Số điện thoại</label>
                <input id="soDienThoai" v-model="soDienThoai" type="tel" class="form-control" placeholder="09xxxxxxxx" required />
              </div>
              <div class="col-12">
                <label for="email" class="form-label fw-semibold">Email</label>
                <input id="email" v-model="email" type="email" class="form-control" placeholder="you@example.com" required />
              </div>
              <div class="col-12">
                <label for="diaChi" class="form-label fw-semibold">Địa chỉ</label>
                <textarea id="diaChi" v-model="diaChi" class="form-control" rows="3" placeholder="Nhập địa chỉ liên hệ" required></textarea>
              </div>
            </div>
          </section>
        </div>

        <div class="col-12 col-lg-5">
          <section class="profile-section bg-white border rounded-4 shadow-sm p-4 p-md-5 h-100 animate-fade-in">
            <div class="section-heading d-flex align-items-center gap-3 mb-4">
              <div class="section-icon bg-primary-subtle text-primary rounded-3">
                <i class="bi bi-shield-check" aria-hidden="true"></i>
              </div>
              <div>
                <h2 class="h5 fw-bold mb-1">Xác thực danh tính</h2>
                <p class="small text-secondary mb-0">Tài liệu được bảo mật an toàn</p>
              </div>
            </div>

            <div class="mb-4">
              <label for="soCCCD" class="form-label fw-semibold">Số CCCD</label>
              <input id="soCCCD" v-model="soCCCD" type="text" class="form-control" placeholder="Nhập 12 số CCCD" inputmode="numeric" required />
            </div>

            <div class="row g-3 mb-4">
              <div class="col-12 col-sm-6">
                <FileUploadField
                  id="anhCCCDMatTruoc"
                  label="CCCD mặt trước"
                  :preview="previewCCCDMatTruoc"
                  @change="chonTep('anhCCCDMatTruoc', $event)"
                />
              </div>
              <div class="col-12 col-sm-6">
                <FileUploadField
                  id="anhCCCDMatSau"
                  label="CCCD mặt sau"
                  :preview="previewCCCDMatSau"
                  @change="chonTep('anhCCCDMatSau', $event)"
                />
              </div>
            </div>

            <div class="mb-3">
              <label for="soGPLX" class="form-label fw-semibold">Số giấy phép lái xe</label>
              <input id="soGPLX" v-model="soGPLX" type="text" class="form-control" placeholder="Nhập số GPLX" required />
            </div>
            <FileUploadField
              id="anhGPLX"
              label="Ảnh giấy phép lái xe"
              :preview="previewGPLX"
              @change="chonTep('anhGPLX', $event)"
            />

            <p class="small text-secondary mt-3 mb-0">
              <i class="bi bi-info-circle me-1" aria-hidden="true"></i>
              Chấp nhận ảnh JPG, PNG, dung lượng tối đa 5MB.
            </p>
          </section>
        </div>
      </div>

      <div class="d-flex flex-column flex-sm-row justify-content-end gap-2 mt-4">
        <button type="button" class="btn btn-outline-secondary px-4" @click="datLaiForm">
          Hủy thay đổi
        </button>
        <button type="submit" class="btn btn-primary px-4 fw-semibold">
          <i class="bi bi-check2 me-2" aria-hidden="true"></i>
          Lưu hồ sơ
        </button>
      </div>

      <div v-if="thongBao" class="alert mt-4" :class="loi ? 'alert-danger' : 'alert-success'" role="status">
        {{ thongBao }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import FileUploadField from '@/components/FileUploadField.vue'
import api, { getApiErrorMessage } from '@/services/api'

const hoTen = ref('')
const ngaySinh = ref('')
const soDienThoai = ref('')
const email = ref('')
const diaChi = ref('')
const soCCCD = ref('')
const anhCCCDMatTruoc = ref(null)
const anhCCCDMatSau = ref(null)
const soGPLX = ref('')
const anhGPLX = ref(null)
const trangThai = ref('Chưa xác thực')
const previewCCCDMatTruoc = ref('')
const previewCCCDMatSau = ref('')
const previewGPLX = ref('')
const daLuuHoSo = ref(false)
const thongBao = ref('')
const loi = ref(false)
const isLoading = ref(true)
const isSubmitting = ref(false)

async function taiHoSo() {
  try {
    const { data: result } = await api.get('/profile')

    const profile = result.data
    const customer = profile.khachHang || {}
    const documents = profile.hoSoXacThuc || {}
    hoTen.value = customer.hoTen || ''
    ngaySinh.value = customer.ngaySinh || ''
    soDienThoai.value = customer.soDienThoai || ''
    email.value = customer.email || ''
    diaChi.value = customer.diaChi || ''
    soCCCD.value = documents.soCCCD || ''
    soGPLX.value = documents.soGPLX || ''
    trangThai.value = dinhDangTrangThai(documents.trangThai)
    previewCCCDMatTruoc.value = documents.anhCCCDMatTruoc || ''
    previewCCCDMatSau.value = documents.anhCCCDMatSau || ''
    previewGPLX.value = documents.anhGPLX || ''
  } catch (error) {
    loi.value = true
    thongBao.value = getApiErrorMessage(error, 'Không thể tải hồ sơ.')
  } finally {
    isLoading.value = false
  }
}

onMounted(taiHoSo)

function chonTep(tenTruong, event) {
  const tep = event.target.files?.[0]

  if (!tep) {
    return
  }

  if (tenTruong === 'anhCCCDMatTruoc') {
    anhCCCDMatTruoc.value = tep
    previewCCCDMatTruoc.value = URL.createObjectURL(tep)
  } else if (tenTruong === 'anhCCCDMatSau') {
    anhCCCDMatSau.value = tep
    previewCCCDMatSau.value = URL.createObjectURL(tep)
  } else {
    anhGPLX.value = tep
    previewGPLX.value = URL.createObjectURL(tep)
  }
}

async function xuLyLuuHoSo() {
  isSubmitting.value = true
  loi.value = false
  thongBao.value = ''

  try {
    await api.put('/profile', {
      hoTen: hoTen.value,
      ngaySinh: ngaySinh.value,
      soDienThoai: soDienThoai.value,
      email: email.value,
      diaChi: diaChi.value
    })

    const documents = [
      ['anhCCCDMatTruoc', anhCCCDMatTruoc.value],
      ['anhCCCDMatSau', anhCCCDMatSau.value],
      ['anhGPLX', anhGPLX.value]
    ].filter(([, file]) => file)

    if (documents.length) {
      const formData = new FormData()
      formData.append('soCCCD', soCCCD.value)
      formData.append('soGPLX', soGPLX.value)
      documents.forEach(([field, file]) => formData.append(field, file))
      await api.post('/profile/upload-docs', formData)
    }

    daLuuHoSo.value = true
    trangThai.value = 'Chờ duyệt'
    thongBao.value = 'Hồ sơ đã được cập nhật và đang chờ kiểm tra.'
  } catch (error) {
    loi.value = true
    thongBao.value = getApiErrorMessage(error, 'Không thể lưu hồ sơ.')
  } finally {
    isSubmitting.value = false
  }
}

function datLaiForm() {
  daLuuHoSo.value = false
  thongBao.value = ''
}

function dinhDangTrangThai(status) {
  return { cho_duyet: 'Chờ duyệt', da_duyet: 'Đã duyệt', tu_choi: 'Từ chối' }[status] || 'Chưa xác thực'
}
</script>

<style scoped>
.profile-section {
  border-color: var(--border-color) !important;
}

.section-icon {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  font-size: 1.2rem;
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