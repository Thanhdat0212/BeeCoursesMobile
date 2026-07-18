import { useCallback, useEffect, useRef, useState } from 'react';
import { searchCourses } from '../api/courseService';
import { CourseSummary } from '../types';

// Logic danh sách khóa học: tìm kiếm debounce, lọc theo lớp,
// phân trang theo hasNext của backend, pull-to-refresh.
export function useCourses() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState('');
  const [grade, setGrade] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Bỏ qua response về muộn của request cũ (gõ nhanh / đổi filter liên tục)
  const requestId = useRef(0);

  const fetchPage = useCallback(
    async (opts: { reset: boolean; targetPage: number; q: string; grade: number | null }) => {
      const id = ++requestId.current;
      try {
        setError(null);
        const result = await searchCourses({
          page: opts.targetPage,
          q: opts.q.trim() || undefined,
          grade: opts.grade ?? undefined,
        });
        if (id !== requestId.current) return;
        setTotalItems(result.totalItems);
        setHasNext(result.hasNext);
        setPage(result.page);
        setCourses((prev) => (opts.reset ? result.items : [...prev, ...result.items]));
      } catch {
        if (id !== requestId.current) return;
        setError(
          'Không kết nối được máy chủ Bee Academy.\nKiểm tra backend đã chạy và API_BASE_URL trong src/config.ts.'
        );
      } finally {
        if (id === requestId.current) {
          setLoading(false);
          setLoadingMore(false);
          setRefreshing(false);
        }
      }
    },
    []
  );

  // Đổi từ khóa/lớp → debounce 400ms rồi tải lại từ trang 0
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      fetchPage({ reset: true, targetPage: 0, q: query, grade });
    }, 400);
    return () => clearTimeout(timer);
  }, [query, grade, fetchPage]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasNext) return;
    setLoadingMore(true);
    fetchPage({ reset: false, targetPage: page + 1, q: query, grade });
  }, [loading, loadingMore, hasNext, page, query, grade, fetchPage]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    fetchPage({ reset: true, targetPage: 0, q: query, grade });
  }, [query, grade, fetchPage]);

  return {
    courses,
    totalItems,
    query,
    setQuery,
    grade,
    setGrade,
    loading,
    loadingMore,
    refreshing,
    error,
    loadMore,
    refresh,
  };
}
