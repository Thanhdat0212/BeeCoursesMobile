import { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing } from '../theme';
import { CourseSummary } from '../types';
import { formatVnd } from '../utils/format';

interface CourseCardProps {
  course: CourseSummary;
  onPress: (course: CourseSummary) => void;
}

export const CourseCard = memo(function CourseCard({
  course,
  onPress,
}: CourseCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(course)}
      activeOpacity={0.85}
    >
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

      <View style={styles.info}>
        <View style={styles.badgeRow}>
          {course.categoryName && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{course.categoryName}</Text>
            </View>
          )}
          {course.grades.length > 0 && (
            <Text style={styles.gradeText}>
              Lớp {course.grades.join(', ')}
            </Text>
          )}
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {course.title}
        </Text>

        {course.teacherName && (
          <Text style={styles.teacher} numberOfLines={1}>
            GV: {course.teacherName}
          </Text>
        )}

        <Text style={styles.meta}>
          ⭐ {course.averageRating.toFixed(1)} ({course.reviewCount}) ·{' '}
          {course.studentCount} học viên
          {course.hasFreePreview ? ' · Học thử miễn phí' : ''}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatVnd(course.effectivePriceVnd)}</Text>
          {course.isOnSale && (
            <Text style={styles.originalPrice}>{formatVnd(course.priceVnd)}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  thumbnail: {
    width: 110,
    height: '100%',
    minHeight: 130,
    backgroundColor: colors.line,
  },
  thumbnailFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  thumbnailEmoji: {
    fontSize: 32,
  },
  info: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  badge: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.ink,
  },
  gradeText: {
    fontSize: 11,
    color: colors.gray,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  teacher: {
    fontSize: 12,
    color: colors.gray,
  },
  meta: {
    fontSize: 12,
    color: colors.gray,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 12,
    color: colors.gray,
    textDecorationLine: 'line-through',
  },
});
