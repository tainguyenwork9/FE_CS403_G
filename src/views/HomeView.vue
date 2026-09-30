<template>
  <div class="home-page animate-fade-in">
    <section class="hero-section">
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="eyebrow">Thuê xe máy tiện lợi • 24/7</span>
          <h1>
            Di chuyển nhanh hơn<br />
            cùng <span class="highlight-brand">MotoRent</span>
          </h1>
          <p>
            Dịch vụ cho thuê xe máy hiện đại, an toàn và tối ưu chi phí cho du lịch, công việc và di chuyển hàng ngày.
          </p>

          <div class="hero-actions">
            <router-link to="/tim-kiem-xe" class="primary-btn">Tìm xe ngay</router-link>
            <router-link to="/dang-ky" class="secondary-btn">Đăng ký</router-link>
          </div>

          <div class="hero-stats">
            <div>
              <strong>1200+</strong>
              <span>Khách hàng</span>
            </div>
            <div>
              <strong>4.9/5</strong>
              <span>Đánh giá</span>
            </div>
            <div>
              <strong>150+</strong>
              <span>Xe sẵn sàng</span>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="bike-frame">
            <img
              src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=85"
              alt="MotoRent motorcycle rental"
            />
            <div class="floating-card booking-card">
              <span class="label">Giá từ</span>
              <strong>120.000đ/ngày</strong>
            </div>
            <div class="floating-card rating-card">
              <span>⭐</span>
              <strong>4.9/5</strong>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="search-strip container">
      <div class="search-card">
        <div class="search-item">
          <label>Loại xe</label>
          <span>Xe tay ga</span>
        </div>
        <div class="search-item">
          <label>Hãng xe</label>
          <span>Honda / Yamaha</span>
        </div>
        <div class="search-item">
          <label>Ngân sách</label>
          <span>100k - 250k/ngày</span>
        </div>
        <button type="button" class="search-btn">Tìm ngay</button>
      </div>
    </section>

    <section class="fleet-section container">
      <div class="section-heading">
        <div>
          <span class="eyebrow">Bộ sưu tập</span>
          <h2>Xe máy phổ biến nhất</h2>
        </div>
        <router-link to="/tim-kiem-xe" class="view-all">Xem tất cả</router-link>
      </div>

      <div v-if="isLoadingVehicles" class="vehicle-state">
        <span class="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true"></span>
        <span>Đang tải danh sách xe...</span>
      </div>

      <div v-else-if="vehicleError" class="vehicle-state vehicle-state-error" role="alert">
        {{ vehicleError }}
      </div>

      <div v-else-if="featuredVehicles.length" class="vehicle-grid">
        <VehicleCard v-for="xe in featuredVehicles" :key="xe.maXe" :xe="xe" @chon-xe="goToDetail" />
      </div>

      <div v-else class="vehicle-state">
        Hiện chưa có xe sẵn sàng cho thuê.
      </div>
    </section>

    <section id="why-us" class="why-section">
      <div class="container">
        <div class="section-heading centered">
          <span class="eyebrow">Vì sao chọn</span>
          <h2>Đặt xe thật dễ, đúng chuẩn</h2>
        </div>

        <div class="feature-grid">
          <div class="feature-card">
            <div class="icon-wrap blue">⚡</div>
            <h3>Nhận xe nhanh</h3>
            <p>Hỗ trợ nhận xe trong 10 phút với thủ tục đơn giản.</p>
          </div>
          <div class="feature-card">
            <div class="icon-wrap orange">🛡️</div>
            <h3>Bảo hiểm đầy đủ</h3>
            <p>Xe được kiểm tra kỹ lưỡng và bảo hiểm theo chuẩn.</p>
          </div>
          <div class="feature-card">
            <div class="icon-wrap cyan">💬</div>
            <h3>Hỗ trợ 24/7</h3>
            <p>Đội ngũ hỗ trợ khách hàng mọi lúc khi cần hướng dẫn.</p>
          </div>
        </div>
      </div>
    </section>

    <section id="process" class="process-section container">
      <div class="section-heading centered">
        <span class="eyebrow">Quy trình</span>
        <h2>Chỉ 3 bước thuê xe</h2>
      </div>

      <div class="steps-grid">
        <div class="step-card">
          <div class="step-number">01</div>
          <h3>Chọn xe</h3>
          <p>Lọc theo loại xe, giá thuê và thương hiệu phù hợp.</p>
        </div>
        <div class="step-card">
          <div class="step-number">02</div>
          <h3>Đặt lịch</h3>
          <p>Điền thông tin và xác nhận thuê trong vài phút.</p>
        </div>
        <div class="step-card">
          <div class="step-number">03</div>
          <h3>Nhận xe</h3>
          <p>Nhận xe ngay, điền giấy tờ và bắt đầu hành trình.</p>
        </div>
      </div>
    </section>

    <section class="cta-section container">
      <div class="cta-box">
        <div>
          <span class="eyebrow">Sẵn sàng đi nào?</span>
          <h2>Thuê xe máy ngay hôm nay</h2>
        </div>
        <router-link to="/tim-kiem-xe" class="primary-btn inverse">Khám phá xe</router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import VehicleCard from '@/components/VehicleCard.vue'
import api, { getApiErrorMessage } from '@/services/api'

const router = useRouter()
const vehicles = ref([])
const isLoadingVehicles = ref(true)
const vehicleError = ref('')
const featuredVehicles = computed(() => vehicles.value)

async function loadVehicles() {
  try {
    const { data: result } = await api.get('/vehicles')
    vehicles.value = result.data ?? []
  } catch (error) {
    vehicleError.value = getApiErrorMessage(error, 'Không thể tải danh sách xe.')
  } finally {
    isLoadingVehicles.value = false
  }
}

onMounted(loadVehicles)

const goToDetail = (xe) => {
  router.push({ name: 'ChiTietXe', params: { maXe: xe.maXe } })
}
</script>

<style scoped>
.home-page {
  padding-bottom: 4rem;
}

.hero-section {
  padding: 4rem 0 2rem;
  background: radial-gradient(circle at top left, rgba(2, 132, 199, 0.12), transparent 38%),
    radial-gradient(circle at right center, rgba(249, 115, 22, 0.12), transparent 28%);
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  gap: 2.5rem;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.8rem;
  border-radius: 999px;
  background: rgba(2, 132, 199, 0.08);
  color: var(--primary-color);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.hero-copy h1 {
  margin-top: 1.2rem;
  font-size: clamp(2.7rem, 5vw, 5rem);
  line-height: 1.04;
  letter-spacing: -0.06em;
  color: var(--text-main);
}

.highlight-brand {
  color: var(--primary-color);
}

.hero-copy p {
  margin-top: 1.1rem;
  max-width: 600px;
  color: var(--text-muted);
  font-size: 1.08rem;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.primary-btn,
.secondary-btn,
.search-btn,
.view-all {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  transition: var(--transition);
}

.primary-btn {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #0f172a;
  padding: 0.95rem 1.5rem;
  font-weight: 700;
  box-shadow: 0 18px 30px rgba(147, 197, 253, 0.28);
}

.secondary-btn {
  color: #1e3a8a;
  border: 1px solid #bfdbfe;
  padding: 0.95rem 1.5rem;
  background: #eff6ff;
}

.primary-btn.inverse {
  background: rgba(255, 255, 255, 0.92);
  color: #1e3a8a;
  border: 1px solid rgba(147, 197, 253, 0.6);
}

.hero-stats {
  display: flex;
  gap: 2rem;
  margin-top: 2.3rem;
  flex-wrap: wrap;
}

.hero-stats div {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.hero-stats strong {
  font-size: 1.5rem;
  color: var(--text-main);
}

.hero-stats span {
  color: var(--text-muted);
}

.hero-visual {
  display: flex;
  justify-content: center;
}

.bike-frame {
  position: relative;
  width: min(100%, 560px);
  border-radius: 28px;
  overflow: hidden;
  background: linear-gradient(180deg, #dbeafe, #eff6ff);
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.12);
  padding: 16px;
}

.bike-frame img {
  width: 100%;
  height: 540px;
  object-fit: cover;
  border-radius: 22px;
  display: block;
}

.floating-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 18px 32px rgba(15, 23, 42, 0.12);
  border-radius: 18px;
  padding: 1rem 1.2rem;
}

.booking-card {
  left: 30px;
  bottom: 30px;
}

.booking-card .label {
  display: block;
  color: var(--text-muted);
  font-size: 0.8rem;
}

.booking-card strong {
  display: block;
  margin-top: 0.2rem;
  font-size: 1.2rem;
  color: var(--text-main);
}

.rating-card {
  right: 26px;
  top: 26px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 800;
}

.search-strip {
  margin-top: 1rem;
}

.search-card {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  align-items: end;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 0 18px 35px rgba(15, 23, 42, 0.08);
  border-radius: 24px;
  padding: 1rem 1.25rem;
  margin-top: -2.5rem;
}

.search-item {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.8rem 0.9rem;
  border-radius: 14px;
  background: #f8fafc;
}

.search-item label {
  color: var(--text-muted);
  font-size: 0.8rem;
}

.search-item span {
  color: var(--text-main);
  font-weight: 700;
}

.search-btn {
  min-height: 58px;
  border: none;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  font-weight: 700;
  cursor: pointer;
}

.fleet-section,
.process-section {
  padding-top: 5rem;
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
}

.section-heading.centered {
  justify-content: center;
  text-align: center;
  flex-direction: column;
  align-items: center;
}

.section-heading h2 {
  margin-top: 0.7rem;
  font-size: clamp(2rem, 3vw, 3rem);
  letter-spacing: -0.05em;
  color: var(--text-main);
}

.view-all {
  padding: 0.75rem 1.1rem;
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: var(--primary-color);
  background: rgba(2, 132, 199, 0.05);
  font-weight: 700;
}

.vehicle-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.6rem;
}

.why-section {
  margin-top: 5rem;
  padding: 5rem 0;
  background: linear-gradient(180deg, rgba(2, 132, 199, 0.04), rgba(249, 115, 22, 0.04));
}

.feature-grid,
.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.6rem;
}

.feature-card,
.step-card {
  padding: 1.8rem;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.04);
}

.icon-wrap {
  width: 60px;
  height: 60px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  font-size: 1.7rem;
  margin-bottom: 1rem;
}

.icon-wrap.blue {
  background: rgba(2, 132, 199, 0.12);
  color: var(--primary-color);
}

.icon-wrap.orange {
  background: rgba(249, 115, 22, 0.12);
  color: var(--accent-color);
}

.icon-wrap.cyan {
  background: rgba(34, 211, 238, 0.12);
  color: #0891b2;
}

.feature-card h3,
.step-card h3 {
  margin-bottom: 0.6rem;
  color: var(--text-main);
}

.feature-card p,
.step-card p {
  color: var(--text-muted);
}

.step-number {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 15px;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  font-weight: 800;
  margin-bottom: 1rem;
}

.cta-section {
  padding-top: 5rem;
}

.cta-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  background: linear-gradient(135deg, rgba(2, 132, 199, 0.96), rgba(249, 115, 22, 0.9));
  border-radius: 28px;
  padding: 2rem 2.2rem;
  color: white;
}

.cta-box h2 {
  margin-top: 0.5rem;
  font-size: clamp(2rem, 3vw, 2.8rem);
  letter-spacing: -0.04em;
}

@media (max-width: 980px) {
  .hero-grid,
  .vehicle-grid,
  .feature-grid,
  .steps-grid,
  .search-card {
    grid-template-columns: 1fr;
  }

  .nav-links {
    display: none;
  }

  .navbar-content {
    justify-content: space-between;
  }
}

@media (max-width: 640px) {
  .hero-section {
    padding-top: 2.5rem;
  }

  .hero-copy h1 {
    font-size: 2.6rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .cta-box {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
