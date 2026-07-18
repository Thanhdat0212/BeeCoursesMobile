import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getCourseDetail } from '../api/courseService';
import { ChapterAccordion } from '../components/ChapterAccordion';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme';
import { CourseDetail } from '../types';
import { formatDuration, formatVnd } from '../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseDetail'>;

export function CourseDetailScreen({ route }: Props) {
  const { courseId } = route.params;

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getCourseDetail(courseId)
      .then((data) => {
        if (!cancelled) setCourse(data);
      })
      .catch(() => {
        if (!cancelled) setError('Không tải được chi tiết khóa học.');
      });
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      {course.thumbnailUrl ? (
        <Image
          source={{ uri: course.thumbnailUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.thumbnail, styles.thumbnailFallback]}>
          <Text style={styles.thumbnailEmoji}>🐝</Text>
        </View>
      )}

      <View style={styles.body}>
        {course.enrolled && (
          <View style={styles.enrolledBadge}>
            <Text style={styles.enrolledText}>✓ Bạn đã sở hữu khóa học này</Text>
          </View>
        )}

        <Text style={styles.title}>{course.title}</Text>

        <Text style={styles.meta}>
          {course.categoryName ?? 'Khóa học'} · Lớp {course.grades.join(', ')}
          {course.teacherName ? ` · GV ${course.teacherName}` : ''}
        </Text>

        <Text style={styles.meta}>
          ⭐ {course.averageRating.toFixed(1)} ({course.reviewCount} đánh giá) ·{' '}
          {course.studentCount} học viên
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatVnd(course.effectivePriceVnd)}</Text>
          {course.isOnSale && (
            <Text style={styles.originalPrice}>{formatVnd(course.priceVnd)}</Text>
          )}
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{course.totalChapters ?? 0}</Text>
            <Text style={styles.statLabel}>Chương</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{course.totalLessons ?? 0}</Text>
            <Text style={styles.statLabel}>Bài học</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {formatDuration(course.totalDurationSec)}
            </Text>
            <Text style={styles.statLabel}>Thời lượng</Text>
          </View>
        </View>

        {course.description && (
          <>
            <Text style={styles.sectionTitle}>Giới thiệu</Text>
            <Text style={styles.paragraph}>{course.description}</Text>
          </>
        )}

        {course.objective && (
          <>
            <Text style={styles.sectionTitle}>Mục tiêu khóa học</Text>
            <Text style={styles.paragraph}>{course.objective}</Text>
          </>
        )}

        <Text style={styles.sectionTitle}>Nội dung khóa học</Text>
        <View style={styles.chapterList}>
          {course.chapters.map((chapter, index) => (
            <ChapterAccordion key={chapter.id} chapter={chapter} index={index} />
          ))}
          {course.chapters.length === 0 && (
            <Text style={styles.paragraph}>Nội dung đang được cập nhật.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xl * 2,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    color: colors.gray,
    fontSize: 14,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: colors.line,
  },
  thumbnailFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  thumbnailEmoji: {
    fontSize: 48,
  },
  body: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  enrolledBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: spacing.lg,
    alignSelf: 'flex-start',
  },
  enrolledText: {
    color: '#15803D',
    fontSize: 13,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.ink,
  },
  meta: {
    fontSize: 13,
    color: colors.gray,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 15,
    color: colors.gray,
    textDecorationLine: 'line-through',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: spacing.lg,
    marginTop: spacing.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.line,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.ink,
    marginTop: spacing.lg,
  },
  paragraph: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 21,
  },
  chapterList: {
    gap: spacing.md,
  },
});
