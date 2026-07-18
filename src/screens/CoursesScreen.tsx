import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CourseCard } from '../components/CourseCard';
import { useCourses } from '../hooks/useCourses';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme';
import { CourseSummary } from '../types';

// Bee Academy phục vụ học sinh THCS — lọc theo 4 khối lớp
const GRADES = [6, 7, 8, 9];

export function CoursesScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
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
  } = useCourses();

  function openDetail(course: CourseSummary) {
    navigation.navigate('CourseDetail', {
      courseId: course.id,
      title: course.title,
    });
  }

  return (
    <View style={styles.root}>
      <TextInput
        style={styles.search}
        placeholder="Tìm khóa học... (vd: Toán 8)"
        placeholderTextColor={colors.gray}
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
      />

      <View style={styles.gradeRow}>
        {GRADES.map((g) => {
          const selected = grade === g;
          return (
            <TouchableOpacity
              key={g}
              style={[styles.gradeChip, selected && styles.gradeChipSelected]}
              // Bấm lại chip đang chọn → bỏ lọc
              onPress={() => setGrade(selected ? null : g)}
            >
              <Text
                style={[styles.gradeChipText, selected && styles.gradeChipTextSelected]}
              >
                Lớp {g}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color={colors.primary} />
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <CourseCard course={item} onPress={openDetail} />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              colors={[colors.primary]}
            />
          }
          ListHeaderComponent={
            <Text style={styles.resultCount}>{totalItems} khóa học</Text>
          }
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator style={styles.footerLoader} color={colors.primary} />
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyText}>
                Không tìm thấy khóa học phù hợp
              </Text>
            </View>
          }
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  search: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.ink,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  gradeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  gradeChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 7,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  gradeChipSelected: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  gradeChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray,
  },
  gradeChipTextSelected: {
    color: '#FFFFFF',
  },
  loader: {
    marginTop: spacing.xl * 2,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  resultCount: {
    fontSize: 13,
    color: colors.gray,
  },
  footerLoader: {
    paddingVertical: spacing.lg,
  },
  center: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  errorText: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 21,
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  emptyEmoji: {
    fontSize: 40,
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray,
  },
});
