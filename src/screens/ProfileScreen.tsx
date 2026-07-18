import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getMyProfile } from '../api/profileService';
import { useAuthStore } from '../store/authStore';
import { colors, radius, spacing } from '../theme';
import { Profile } from '../types';

const ROLE_LABEL: Record<string, string> = {
  student: 'Học sinh',
  parent: 'Phụ huynh',
  teacher: 'Giáo viên',
  admin: 'Quản trị viên',
};

export function ProfileScreen() {
  const logout = useAuthStore((s) => s.logout);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Gọi lại /api/me thay vì dùng user trong store — demo endpoint bảo vệ
  // và luôn có dữ liệu mới nhất (phone, bio... store không giữ)
  useEffect(() => {
    let cancelled = false;
    getMyProfile()
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch(() => {
        if (!cancelled) setError('Không tải được hồ sơ.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function confirmLogout() {
    Alert.alert('Đăng xuất', 'Bạn chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout },
    ]);
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const initials = profile.fullName
    .split(' ')
    .map((w) => w[0])
    .slice(-2)
    .join('')
    .toUpperCase();

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        {profile.avatarUrl ? (
          <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
        )}
        <Text style={styles.name}>{profile.fullName}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>
            {ROLE_LABEL[profile.role] ?? profile.role}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{profile.email}</Text>
        </View>
        {profile.phone && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Điện thoại</Text>
            <Text style={styles.infoValue}>{profile.phone}</Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Thành viên từ</Text>
          <Text style={styles.infoValue}>
            {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
          </Text>
        </View>
      </View>

      {profile.bio && (
        <View style={styles.bioCard}>
          <Text style={styles.bioTitle}>Giới thiệu</Text>
          <Text style={styles.bioText}>{profile.bio}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>

      <Text style={styles.footnote}>
        Hồ sơ lấy từ GET /api/me — JWT gắn tự động, tự refresh khi hết hạn
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: spacing.sm,
  },
  avatarFallback: {
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.primary,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.ink,
  },
  roleBadge: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    marginBottom: spacing.md,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.ink,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    gap: spacing.md,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.gray,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.ink,
    flexShrink: 1,
    textAlign: 'right',
  },
  bioCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.line,
  },
  bioTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  bioText: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 21,
  },
  logoutButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.pill,
    paddingVertical: 13,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  logoutText: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: '700',
  },
  footnote: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
  },
});
