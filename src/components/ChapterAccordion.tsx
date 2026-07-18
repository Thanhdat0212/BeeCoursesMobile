import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing } from '../theme';
import { Chapter } from '../types';
import { formatDuration } from '../utils/format';

interface ChapterAccordionProps {
  chapter: Chapter;
  index: number;
}

// Accordion tự quản lý state mở/đóng — mỗi chương độc lập
export function ChapterAccordion({ chapter, index }: ChapterAccordionProps) {
  const [expanded, setExpanded] = useState(index === 0); // chương đầu mở sẵn

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded((prev) => !prev)}
        activeOpacity={0.7}
      >
        <View style={styles.headerText}>
          <Text style={styles.chapterTitle} numberOfLines={2}>
            Chương {index + 1}: {chapter.title}
          </Text>
          <Text style={styles.chapterMeta}>
            {chapter.lessons.length} bài học
            {chapter.hasQuizConfig ? ' · Có quiz cuối chương' : ''}
          </Text>
        </View>
        <Text style={styles.chevron}>{expanded ? '▴' : '▾'}</Text>
      </TouchableOpacity>

      {expanded &&
        chapter.lessons.map((lesson, i) => (
          <View key={lesson.id} style={styles.lessonRow}>
            <Text style={styles.lessonIndex}>{i + 1}</Text>
            <View style={styles.lessonInfo}>
              <Text style={styles.lessonTitle} numberOfLines={2}>
                {lesson.title}
              </Text>
              <Text style={styles.lessonMeta}>
                🎬 {formatDuration(lesson.durationSec)}
              </Text>
            </View>
            {lesson.isFree && (
              <View style={styles.freeBadge}>
                <Text style={styles.freeBadgeText}>Học thử</Text>
              </View>
            )}
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  chapterTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
  },
  chapterMeta: {
    fontSize: 12,
    color: colors.gray,
  },
  chevron: {
    fontSize: 16,
    color: colors.gray,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    gap: spacing.md,
  },
  lessonIndex: {
    width: 22,
    fontSize: 13,
    color: colors.gray,
    textAlign: 'center',
  },
  lessonInfo: {
    flex: 1,
    gap: 2,
  },
  lessonTitle: {
    fontSize: 13,
    color: colors.ink,
  },
  lessonMeta: {
    fontSize: 11,
    color: colors.gray,
  },
  freeBadge: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  freeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.ink,
  },
});
