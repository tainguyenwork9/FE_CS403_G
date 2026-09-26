<template>
  <div class="container py-4 py-lg-5">
    <div
      class="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4 animate-fade-in"
    >
      <div>
        <p class="text-primary fw-semibold mb-2">KHU VỰC NHÂN VIÊN</p>
        <h1 class="h2 fw-bold mb-2">Kiểm tra hồ sơ</h1>
        <p class="text-secondary mb-0">
          Xem xét giấy tờ xác thực trước khi khách hàng đặt xe.
        </p>
      </div>
      <button
        type="button"
        class="btn btn-outline-primary"
        @click="taiLaiDanhSach"
      >
        <i class="bi bi-arrow-clockwise me-2" aria-hidden="true"></i>
        Cập nhật danh sách
      </button>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-12 col-md-4">
        <div class="stat-card bg-white border rounded-4 shadow-sm p-4 h-100">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <span class="small text-secondary d-block mb-2">Tổng hồ sơ</span>
              <strong class="display-6 fw-bold">{{
                danhSachHoSo.length
              }}</strong>
            </div>
            <span class="stat-icon bg-primary-subtle text-primary rounded-3"
              ><i class="bi bi-folder2-open" aria-hidden="true"></i
            ></span>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="stat-card bg-white border rounded-4 shadow-sm p-4 h-100">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <span class="small text-secondary d-block mb-2">Chờ duyệt</span>
              <strong class="display-6 fw-bold text-warning">{{
                soLuongChoDuyet
              }}</strong>
            </div>
            <span
              class="stat-icon bg-warning-subtle text-warning-emphasis rounded-3"
              ><i class="bi bi-hourglass-split" aria-hidden="true"></i
            ></span>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="stat-card bg-white border rounded-4 shadow-sm p-4 h-100">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <span class="small text-secondary d-block mb-2">Đã xử lý</span>
              <strong class="display-6 fw-bold text-success">{{
                soLuongDaXuLy
              }}</strong>
            </div>
            <span
              class="stat-icon bg-success-subtle text-success-emphasis rounded-3"
              ><i class="bi bi-check2-circle" aria-hidden="true"></i
            ></span>
          </div>
        </div>
      </div>
    </div>

    <section
      class="review-panel bg-white border rounded-4 shadow-sm animate-fade-in"
    >
      <div class="p-4 border-bottom">
        <div class="row g-3 align-items-center">
          <div class="col-12 col-lg-5">
            <label for="timKiemHoSo" class="visually-hidden"
              >Tìm kiếm hồ sơ</label
            >
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0">
                <i class="bi bi-search text-secondary" aria-hidden="true"></i>
              </span>
              <input
                id="timKiemHoSo"
                v-model="tuKhoa"
                type="search"
                class="form-control border-start-0"
                placeholder="Tìm theo tên, CCCD hoặc GPLX"
              />
            </div>
          </div>
          <div class="col-12 col-lg-7">
            <div class="d-flex flex-wrap justify-content-lg-end gap-2">
              <button
                v-for="boLoc in cacBoLoc"
                :key="boLoc.giaTri"
                type="button"
                class="btn btn-sm"
                :class="
                  boLocTrangThai === boLoc.giaTri
                    ? 'btn-primary'
                    : 'btn-outline-secondary'
                "
                @click="boLocTrangThai = boLoc.giaTri"
              >
                {{ boLoc.nhan }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th scope="col" class="ps-4">Khách hàng</th>
              <th scope="col">Giấy tờ</th>
              <th scope="col">Ngày gửi</th>
              <th scope="col">Trạng thái</th>
              <th scope="col" class="text-end pe-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="hoSo in hoSoHienThi" :key="hoSo.maHoSo">
              <td class="ps-4">
                <div class="d-flex align-items-center gap-3">
                  <div
                    class="avatar bg-primary-subtle text-primary rounded-circle"
                  >
                    {{ layChuCaiDau(hoSo.hoTen) }}
                  </div>
                  <div>
                    <strong class="d-block">{{ hoSo.hoTen }}</strong>
                    <span class="small text-secondary">{{ hoSo.email }}</span>
                  </div>
                </div>
              </td>
              <td>
                <span class="small d-block"
                  >CCCD: <strong>{{ hoSo.soCCCD }}</strong></span
                >
                <span class="small text-secondary"
                  >GPLX: {{ hoSo.soGPLX }}</span
                >
              </td>
              <td class="small text-secondary text-nowrap">
                {{ hoSo.ngayGui }}
              </td>
              <td>
                <span
                  class="badge rounded-pill"
                  :class="trangThaiClass(hoSo.trangThai)"
                  >{{ hoSo.trangThai }}</span
                >
              </td>
              <td class="text-end pe-4">
                <div class="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-primary"
                    title="Xem chi tiết hồ sơ"
                    @click="moChiTiet(hoSo)"
                  >
                    <i class="bi bi-eye" aria-hidden="true"></i>
                    <span class="visually-hidden">Xem chi tiết</span>
                  </button>
                  <template v-if="hoSo.trangThai === 'Chờ duyệt'">
                    <button
                      type="button"
                      class="btn btn-sm btn-success"
                      title="Phê duyệt hồ sơ"
                      @click="capNhatTrangThai(hoSo, 'Đã duyệt')"
                    >
                      <i class="bi bi-check-lg" aria-hidden="true"></i>
                      <span class="visually-hidden">Phê duyệt</span>
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-danger"
                      title="Từ chối hồ sơ"
                      @click="capNhatTrangThai(hoSo, 'Từ chối')"
                    >
                      <i class="bi bi-x-lg" aria-hidden="true"></i>
                      <span class="visually-hidden">Từ chối</span>
                    </button>
                  </template>
                </div>
              </td>
            </tr>
            <tr v-if="!hoSoHienThi.length">
              <td colspan="5" class="text-center text-secondary py-5">
                <i class="bi bi-inbox fs-2 d-block mb-2" aria-hidden="true"></i>
                Không có hồ sơ phù hợp với bộ lọc hiện tại.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div
      v-if="thongBao"
      class="alert mt-4 mb-0"
      :class="loi ? 'alert-danger' : 'alert-success'"
      role="status"
    >
      <i class="bi bi-check-circle me-2" aria-hidden="true"></i>{{ thongBao }}
    </div>

    <div
      v-if="hoSoDangXem"
      class="modal-backdrop-custom"
      role="presentation"
      @click.self="dongChiTiet"
    >
      <section
        class="profile-modal bg-white rounded-4 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tieuDeChiTiet"
      >
        <div
          class="d-flex justify-content-between align-items-start gap-3 p-4 border-bottom"
        >
          <div>
            <p class="text-primary fw-semibold mb-1">CHI TIẾT HỒ SƠ</p>
            <h2 id="tieuDeChiTiet" class="h4 fw-bold mb-1">
              {{ hoSoDangXem.hoTen }}
            </h2>
            <span class="small text-secondary">{{ hoSoDangXem.email }}</span>
          </div>
          <button
            type="button"
            class="btn-close"
            aria-label="Đóng chi tiết hồ sơ"
            @click="dongChiTiet"
          ></button>
        </div>

        <div class="p-4 modal-scroll-area">
          <div class="row g-3 mb-4">
            <div class="col-12 col-md-6">
              <span class="small text-secondary d-block mb-1">Số CCCD</span>
              <strong>{{ hoSoDangXem.soCCCD || "Chưa cập nhật" }}</strong>
            </div>
            <div class="col-12 col-md-6">
              <span class="small text-secondary d-block mb-1"
                >Số giấy phép lái xe</span
              >
              <strong>{{ hoSoDangXem.soGPLX || "Chưa cập nhật" }}</strong>
            </div>
            <div class="col-12">
              <span class="small text-secondary d-block mb-1"
                >Trạng thái hồ sơ</span
              >
              <span
                class="badge rounded-pill"
                :class="trangThaiClass(hoSoDangXem.trangThai)"
                >{{ hoSoDangXem.trangThai }}</span
              >
            </div>
          </div>

          <div class="document-section mb-4">
            <h3 class="h6 fw-bold mb-3">Căn cước công dân</h3>
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <span class="small text-secondary d-block mb-2">Mặt trước</span>
                <img
                  :src="hoSoDangXem.anhCCCDMatTruoc"
                  alt="Ảnh CCCD mặt trước"
                  class="document-image"
                />
              </div>
              <div class="col-12 col-md-6">
                <span class="small text-secondary d-block mb-2">Mặt sau</span>
                <img
                  :src="hoSoDangXem.anhCCCDMatSau"
                  alt="Ảnh CCCD mặt sau"
                  class="document-image"
                />
              </div>
            </div>
          </div>

          <div class="document-section">
            <h3 class="h6 fw-bold mb-3">Giấy phép lái xe</h3>
            <img
              :src="hoSoDangXem.anhGPLX"
              alt="Ảnh giấy phép lái xe"
              class="document-image document-image-license"
            />
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2 p-4 border-top">
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="dongChiTiet"
          >
            Đóng
          </button>
          <button
            v-if="hoSoDangXem.trangThai === 'Chờ duyệt'"
            type="button"
            class="btn btn-success"
            title="Xác thực tài khoản"
            :disabled="isUpdatingStatus"
            @click="capNhatTrangThai(hoSoDangXem, 'Đã duyệt')"
          >
            <span
              v-if="isUpdatingStatus"
              class="spinner-border spinner-border-sm me-2"
              aria-hidden="true"
            ></span>
            <i v-else class="bi bi-check-lg me-2" aria-hidden="true"></i>
            Xác thực tài khoản
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import api, { getApiErrorMessage } from "@/services/api";

const tuKhoa = ref("");
const boLocTrangThai = ref("Tat ca");
const thongBao = ref("");
const danhSachHoSo = ref([]);
const loi = ref(false);
const hoSoDangXem = ref(null);
const isUpdatingStatus = ref(false);

const cacBoLoc = [
  { giaTri: "Tat ca", nhan: "Tất cả" },
  { giaTri: "Chờ duyệt", nhan: "Chờ duyệt" },
  { giaTri: "Đã duyệt", nhan: "Đã duyệt" },
  { giaTri: "Từ chối", nhan: "Từ chối" },
];

const hoSoHienThi = computed(() => {
  const tuKhoaChuanHoa = tuKhoa.value.trim().toLowerCase();

  return danhSachHoSo.value.filter((hoSo) => {
    const dungTrangThai =
      boLocTrangThai.value === "Tat ca" ||
      hoSo.trangThai === boLocTrangThai.value;
    const dungTuKhoa =
      !tuKhoaChuanHoa ||
      [hoSo.hoTen, hoSo.soCCCD, hoSo.soGPLX].some((giaTri) =>
        giaTri.toLowerCase().includes(tuKhoaChuanHoa),
      );

    return dungTrangThai && dungTuKhoa;
  });
});

const soLuongChoDuyet = computed(
  () =>
    danhSachHoSo.value.filter((hoSo) => hoSo.trangThai === "Chờ duyệt").length,
);
const soLuongDaXuLy = computed(
  () =>
    danhSachHoSo.value.filter((hoSo) => hoSo.trangThai !== "Chờ duyệt").length,
);

async function taiDanhSachHoSo() {
  try {
    const { data: result } = await api.get("/admin/profiles");

    danhSachHoSo.value = (result.data || []).map((hoSo) => ({
      ...hoSo,
      trangThai: dinhDangTrangThai(hoSo.trangThai),
      ngayGui: hoSo.ngayGui
        ? new Date(hoSo.ngayGui).toLocaleDateString("vi-VN")
        : "",
    }));
    loi.value = false;
    thongBao.value = "";
  } catch (error) {
    loi.value = true;
    thongBao.value = getApiErrorMessage(
      error,
      "Không thể tải danh sách hồ sơ.",
    );
  }
}

onMounted(taiDanhSachHoSo);

async function capNhatTrangThai(hoSo, trangThai) {
  const action = trangThai === "Đã duyệt" ? "duyet" : "tu_choi";
  isUpdatingStatus.value = true;

  try {
    const { data: result } = await api.post("/admin/profiles/update-status", {
      maHoSo: hoSo.maHoSo,
      action,
    });

    hoSo.trangThai = trangThai;
    loi.value = false;
    thongBao.value = result.message;
  } catch (error) {
    loi.value = true;
    thongBao.value = getApiErrorMessage(error, "Không thể cập nhật hồ sơ.");
  } finally {
    isUpdatingStatus.value = false;
  }
}

function moChiTiet(hoSo) {
  hoSoDangXem.value = hoSo;
}

function dongChiTiet() {
  hoSoDangXem.value = null;
}

function taiLaiDanhSach() {
  taiDanhSachHoSo();
}

function layChuCaiDau(hoTen) {
  return hoTen
    .split(" ")
    .map((tu) => tu[0])
    .slice(-2)
    .join("")
    .toUpperCase();
}

function trangThaiClass(trangThai) {
  if (trangThai === "Đã duyệt")
    return "bg-success-subtle text-success-emphasis";
  if (trangThai === "Từ chối") return "bg-danger-subtle text-danger-emphasis";
  return "bg-warning-subtle text-warning-emphasis";
}

function dinhDangTrangThai(status) {
  return (
    { cho_duyet: "Chờ duyệt", da_duyet: "Đã duyệt", tu_choi: "Từ chối" }[
      status
    ] || status
  );
}
</script>

<style scoped>
.stat-card,
.review-panel {
  border-color: var(--border-color) !important;
}

.stat-icon {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  font-size: 1.2rem;
}

.input-group-text,
.form-control {
  border-color: var(--border-color);
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.25rem rgba(37, 99, 235, 0.12);
}

.table > :not(caption) > * > * {
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-color: var(--border-color);
}

.avatar {
  display: grid;
  width: 2.5rem;
  height: 2.5rem;
  flex: 0 0 auto;
  place-items: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  z-index: 1050;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.58);
}

.profile-modal {
  width: min(100%, 780px);
  max-height: calc(100vh - 2rem);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-scroll-area {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}

.document-section {
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.document-image {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-surface-alt);
}

.document-image-license {
  max-width: 24rem;
}
</style>
