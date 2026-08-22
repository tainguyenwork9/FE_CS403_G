# Core Vue 3 Frontend Project

Dự án Frontend được xây dựng trên nền tảng **Vue 3**, **Vite** và **Vue Router**, được cấu trúc chuẩn hóa sẵn sàng cho làm việc nhóm (Team Collaboration).

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API with `<script setup>`)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [Vue Router 4](https://router.vuejs.org/)
- **Styling**: Modern CSS Design System (CSS Custom Properties, Responsive Layouts)

---

## 📁 Cấu trúc thư mục (Directory Structure)

```text
corevue/
├── public/                  # Tài nguyên tĩnh công khai (favicons, images...)
├── src/
│   ├── assets/              # Stylesheet toàn cục, hình ảnh, font chữ
│   │   └── main.css         # Design system tokens, CSS reset
│   ├── components/          # Reusable UI components (Navbar, Footer, Modal, Button...)
│   │   ├── Navbar.vue
│   │   └── Footer.vue
│   ├── layouts/             # Khung Layout cho ứng dụng (DefaultLayout, AuthLayout...)
│   │   └── DefaultLayout.vue
│   ├── router/              # Định tuyến Vue Router
│   │   └── index.js
│   ├── views/               # Trang hiển thị tương ứng với từng Route (Home, NotFound...)
│   │   ├── HomeView.vue
│   │   └── NotFoundView.vue
│   ├── App.vue              # Component gốc
│   └── main.js              # Entry point ứng dụng
├── index.html               # Thẻ HTML chính
├── package.json             # Cấu hình dự án & Dependencies
└── vite.config.js           # Cấu hình Vite (đã thiết lập alias '@' trỏ tới 'src/')
```

---

## 🚀 Hướng dẫn dành cho thành viên nhóm (Quick Start)

### 1. Yêu cầu môi trường
- Node.js version `>= 18.0.0`
- NPM version `>= 9.0.0`

### 2. Cài đặt dự án
Sau khi `git clone` dự án về máy:
```bash
npm install
```

### 3. Khởi chạy môi trường phát triển (Dev Server)
```bash
npm run dev
```
Ứng dụng sẽ chạy tại địa chỉ mặc định: `http://localhost:5173`

### 4. Build sản phẩm (Production Build)
```bash
npm run build
```

### 5. Xem trước bản Build (Preview Production)
```bash
npm run preview
```

---

## 💡 Quy tắc mã nguồn & Alias (Coding Conventions)

1. **Path Alias `@`**: Sử dụng `@` đại diện cho thư mục `src/`.
   - *Ví dụ*: `import Navbar from '@/components/Navbar.vue'`
2. **Component Naming**:
   - Tên component đặt theo chuẩn **PascalCase** (ví dụ: `Navbar.vue`, `HomeView.vue`).
   - Tên tệp trong `views/` kết thúc bằng suffix `View.vue` (ví dụ: `HomeView.vue`, `ProfileView.vue`).
3. **Vue 3 SFC Format**:
   - Sử dụng cú pháp `<script setup>` cho tất cả SFC.

---

## 🔀 Quy trình đẩy code lên Git (Git Workflow)

1. **Tạo nhánh tính năng mới**:
   ```bash
   git checkout -b feature/ten-tinh-nang
   ```
2. **Commit theo chuẩn Conventional Commits**:
   - `feat: ...` : Thêm tính năng mới
   - `fix: ...` : Sửa lỗi
   - `style: ...` : Cập nhật giao diện / CSS
   - `refactor: ...` : Tối ưu lại code
3. **Đẩy nhánh lên Remote**:
   ```bash
   git push origin feature/ten-tinh-nang
   ```
