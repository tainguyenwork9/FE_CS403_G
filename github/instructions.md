# Quy tắc code Frontend (VehicleRental_FE)
- Công nghệ: Vue 3 (bắt buộc dùng Composition API với `<script setup>`), Vue Router, Axios, Bootstrap 5.
- Cấu trúc gọi API: Không viết cứng URL trong component. Luôn gọi qua instance Axios cấu hình sẵn và bám sát cấu trúc JSON trong `VehicleRental_BE/docs/api-contract.md`.
- Giao diện: Sử dụng class của Bootstrap 5, thiết kế gọn gàng, luôn có trạng thái loading (spinner) và hiển thị thông báo lỗi rõ ràng khi gọi API thất bại.