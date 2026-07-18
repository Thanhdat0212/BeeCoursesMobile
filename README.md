# 🐝 Bee Courses Mobile — Mobile client cho Bee Academy

App **React Native (Expo) + TypeScript** gọi trực tiếp REST API của [**Bee Academy**](https://github.com/Thanhdat0212/BeeAcademyProject) — nền tảng bán khóa học trực tuyến cho học sinh THCS mà mình làm **team leader & backend developer** (Spring Boot + PostgreSQL/Supabase).

Đây là dự án lớn nhất trong chuỗi dự án mobile của mình, và cũng là dự án đặc biệt nhất: **mình làm cả hai đầu của cùng một REST API** — tự thiết kế & xây API bằng Spring Boot, rồi tự viết mobile client tiêu thụ chính API đó.

## ✨ Tính năng

- 🔐 **Đăng nhập** bằng tài khoản thật của Bee Academy (`POST /api/auth/login` — backend verify qua Supabase GoTrue, JWT ES256)
- 🔄 **Tự refresh token**: access token hết hạn → interceptor gọi `POST /api/auth/refresh`, retry request gốc đúng 1 lần; refresh fail mới đưa về màn Login
- 📚 **Danh sách khóa học**: tìm kiếm debounce, lọc theo khối lớp (6–9), phân trang theo `hasNext` của backend, pull-to-refresh
- 📖 **Chi tiết khóa học**: chương trình học dạng accordion (chương → bài học, badge "Học thử" cho bài miễn phí), giá VND + sale, đánh giá, số học viên, trạng thái đã ghi danh
- 👤 **Hồ sơ cá nhân** từ endpoint bảo vệ `GET /api/me`
- 💾 Token lưu **SecureStore** (Keychain/Keystore), khôi phục phiên khi mở lại app

## 📱 Screenshots

| Đăng nhập | Khóa học | Chi tiết | Hồ sơ |
|---|---|---|---|
| _(đang cập nhật)_ | _(đang cập nhật)_ | _(đang cập nhật)_ | _(đang cập nhật)_ |

## 🏗️ Kiến trúc

```
┌─────────────────────┐        ┌──────────────────────────┐
│  Bee Courses Mobile │  HTTP  │  Bee Academy Backend     │
│  (dự án này)        │──────▶│  Spring Boot 3.2 + JPA   │
│  RN + TS + Expo     │  JSON  │  PostgreSQL (Supabase)   │
└─────────────────────┘        │  JWT ES256 (GoTrue)      │
                               └──────────────────────────┘
```

Types TypeScript trong `src/types.ts` khớp **1-1 với DTO response của backend** (`ApiResponse<T>` wrapper, `PageResponse<T>`, `AuthTokenResponse`, `CourseDetailResponse`...) — vì mình là người viết cả hai phía.

```
src/
├── config.ts              # API_BASE_URL (10.0.2.2 cho Android emulator)
├── api/
│   ├── client.ts          # axios + interceptor JWT + auto-refresh token
│   ├── authService.ts     # login, logout
│   ├── courseService.ts   # tìm kiếm + phân trang + chi tiết
│   └── profileService.ts  # GET /api/me
├── store/authStore.ts     # restoring / guest / authed + khôi phục phiên
├── hooks/useCourses.ts    # debounce search + lọc lớp + infinite scroll
├── navigation/            # đổi cây màn hình theo auth state
├── screens/               # Login, Courses, CourseDetail, Profile
├── components/            # CourseCard, ChapterAccordion
└── utils/format.ts        # format VND + thời lượng
```

**Điểm kỹ thuật đáng chú ý:**
- **Refresh-token flow đầy đủ**: cờ `_retried` chặn vòng lặp vô hạn; request refresh dùng axios gốc để không đi qua chính interceptor đang xử lý 401; refresh thành công thì phát lại request gốc với token mới.
- **Không màn hình nào tự navigate sau login/logout** — auth state trong Zustand quyết định cây màn hình, React Navigation tự chuyển cảnh.
- **Chống race condition** khi tìm kiếm/đổi filter nhanh bằng `requestId` — response về muộn của query cũ bị bỏ.

## 🚀 Chạy dự án

**1. Chạy backend Bee Academy** (repo [BeeAcademyProject](https://github.com/Thanhdat0212/BeeAcademyProject)):

```bash
cd backend
./mvnw spring-boot:run   # chạy ở http://localhost:8080
```

**2. Cấu hình địa chỉ API** trong `src/config.ts`:
- Android emulator: giữ nguyên `http://10.0.2.2:8080`
- Điện thoại thật (Expo Go): đổi thành IP LAN của máy tính, vd `http://192.168.1.10:8080` (cùng Wi-Fi)

**3. Chạy app:**

```bash
npm install
npx expo start
```

Đăng nhập bằng tài khoản học sinh đã đăng ký trên web Bee Academy.

## 👤 Tác giả

**Võ Văn Thành Đạt** — [github.com/Thanhdat0212](https://github.com/Thanhdat0212)

> Chuỗi dự án mobile: [RN_Taskly](https://github.com/Thanhdat0212/RN_Taskly) (nền tảng RN) · [RN_MiniShop](https://github.com/Thanhdat0212/RN_MiniShop) (REST API + JWT) · **BeeCoursesMobile** (client cho backend tự xây)
