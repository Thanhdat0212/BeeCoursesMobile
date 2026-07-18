// Types khớp 1-1 với DTO response của backend Bee Academy (Spring Boot).
// Backend: github.com/Thanhdat0212/BeeAcademyProject

// Mọi response thành công đều bọc trong wrapper này (ApiResponse.java)
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// PageResponse.java — shape phân trang tự định nghĩa, không dùng Page của Spring
export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
}

// UserSummaryResponse.java
export interface AuthUser {
  id: string;
  email: string;
  role: 'student' | 'parent' | 'teacher' | 'admin';
  fullName: string;
  avatarUrl: string | null;
}

// AuthTokenResponse.java — login và refresh trả cùng shape
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: AuthUser | null; // refresh có thể không kèm user
}

// CourseSummaryResponse.java — chỉ khai báo field app mobile dùng
export interface CourseSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  categoryName: string | null;
  teacherName: string | null;
  grades: number[];
  priceVnd: number;
  salePriceVnd: number | null;
  effectivePriceVnd: number;
  isOnSale: boolean;
  hasFreePreview: boolean;
  averageRating: number;
  reviewCount: number;
  studentCount: number;
  totalChapters: number | null;
  totalLessons: number | null;
  totalDurationSec: number | null;
}

// LessonResponse.java
export interface Lesson {
  id: string;
  title: string;
  videoUrl: string | null;
  durationSec: number | null;
  position: number;
  isFree: boolean | null;
}

// ChapterResponse.java
export interface Chapter {
  id: string;
  title: string;
  description: string | null;
  position: number;
  lessons: Lesson[];
  hasQuizConfig: boolean;
}

// CourseDetailResponse.java — summary + nội dung chương/bài + trạng thái ghi danh
export interface CourseDetail extends CourseSummary {
  objective: string | null;
  audience: string | null;
  chapters: Chapter[];
  enrolled: boolean;
}

// ProfileResponse.java (GET /api/me)
export interface Profile {
  id: string;
  email: string;
  role: string;
  fullName: string;
  phone: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
}
