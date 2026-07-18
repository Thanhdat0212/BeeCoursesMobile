import { apiClient } from './client';
import { ApiResponse, CourseDetail, CourseSummary, PageResponse } from '../types';

export const PAGE_SIZE = 10;

interface SearchCoursesParams {
  page: number;
  q?: string;
  grade?: number;
}

// GET /api/courses — endpoint public, hỗ trợ tìm kiếm + lọc lớp + phân trang
export async function searchCourses({
  page,
  q,
  grade,
}: SearchCoursesParams): Promise<PageResponse<CourseSummary>> {
  const res = await apiClient.get<ApiResponse<PageResponse<CourseSummary>>>(
    '/api/courses',
    {
      params: {
        page,
        size: PAGE_SIZE,
        ...(q ? { q } : {}),
        ...(grade ? { grade } : {}),
      },
    }
  );
  return res.data.data;
}

// GET /api/courses/{id} — kèm chapters/lessons và trạng thái enrolled
export async function getCourseDetail(id: string): Promise<CourseDetail> {
  const res = await apiClient.get<ApiResponse<CourseDetail>>(`/api/courses/${id}`);
  return res.data.data;
}
