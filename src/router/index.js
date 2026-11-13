import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DangNhap from '@/views/auth/DangNhap.vue'
import DangKy from '@/views/auth/DangKy.vue'
import DoiMatKhau from '@/views/auth/DoiMatKhau.vue'
import HoSoCaNhan from '@/views/profile/HoSoCaNhan.vue'
import TimKiemXe from '@/views/vehicle/TimKiemXe.vue'
import ChiTietXe from '@/views/vehicle/ChiTietXe.vue'
import ThanhToanBooking from '@/views/booking/ThanhToanBooking.vue'
import QuanLyDonDatXe from '@/views/booking/QuanLyDonDatXe.vue'
import KiemTraHoSo from '@/views/admin/KiemTraHoSo.vue'
import ThongKe from '@/views/admin/ThongKe.vue'

function getAuthUser() {
  try {
    return JSON.parse(localStorage.getItem('auth_user') || 'null')
  } catch {
    return null
  }
}

const routes = [
  {
    path: '/',
    name: 'TrangChu',
    component: HomeView,
    meta: { layout: 'default' }
  },
  {
    path: '/dang-nhap',
    name: 'DangNhap',
    component: DangNhap,
    meta: { layout: 'default' }
  },
  {
    path: '/dang-ky',
    name: 'DangKy',
    component: DangKy,
    meta: { layout: 'default' }
  },
  {
    path: '/doi-mat-khau',
    name: 'DoiMatKhau',
    component: DoiMatKhau,
    meta: { layout: 'default', requiresAuth: true, roles: ['khach_hang'] }
  },
  {
    path: '/ho-so-ca-nhan',
    name: 'HoSoCaNhan',
    component: HoSoCaNhan,
    meta: { layout: 'default', requiresAuth: true, roles: ['khach_hang'] }
  },
  {
    path: '/tim-kiem-xe',
    name: 'TimKiemXe',
    component: TimKiemXe,
    meta: { layout: 'default' }
  },
  {
    path: '/chi-tiet-xe/:maXe',
    name: 'ChiTietXe',
    component: ChiTietXe,
    meta: { layout: 'default' }
  },
  {
    path: '/thanh-toan/:id',
    name: 'ThanhToanBooking',
    component: ThanhToanBooking,
    meta: { layout: 'default', requiresAuth: true }
  },
  {
    path: '/don-dat-xe',
    name: 'QuanLyDonDatXe',
    component: QuanLyDonDatXe,
    meta: { layout: 'default', requiresAuth: true, roles: ['khach_hang'] }
  },
  {
    path: '/kiem-tra-ho-so',
    name: 'KiemTraHoSo',
    component: KiemTraHoSo,
    meta: { layout: 'default', requiresAuth: true, roles: ['nhan_vien', 'admin'] }
  },
  {
    path: '/thong-ke',
    name: 'ThongKe',
    component: ThongKe,
    meta: { layout: 'default', requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { layout: 'default' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token')
  const user = getAuthUser()
  const normalizedRole = String(user?.vaiTro || '').trim().toLowerCase()

  if ((to.path === '/dang-nhap' || to.path === '/dang-ky') && token) {
    return next('/')
  }

  if (to.path === '/ho-so-ca-nhan' && token && ['nhan_vien', 'admin'].includes(normalizedRole)) {
    return next('/kiem-tra-ho-so')
  }

  if (to.meta.requiresAuth && !token) {
    return next('/dang-nhap')
  }

  if (to.meta.roles && (!user || !to.meta.roles.includes(normalizedRole))) {
    if (user && ['nhan_vien', 'admin'].includes(normalizedRole)) {
      return next('/kiem-tra-ho-so')
    }

    return next('/dang-nhap')
  }

  next()
})


export default router