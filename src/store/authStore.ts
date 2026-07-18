import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { login as loginApi, logout as logoutApi } from '../api/authService';
import { ACCESS_TOKEN_KEY, setSessionExpiredHandler } from '../api/client';
import { getMyProfile } from '../api/profileService';
import { AuthUser } from '../types';

// 'restoring': đang kiểm tra token lúc mở app — hiện splash
// 'guest'    : chưa đăng nhập
// 'authed'   : đã đăng nhập
type AuthStatus = 'restoring' | 'guest' | 'authed';

interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'restoring',
  user: null,

  login: async (email, password) => {
    // authService đã lưu token vào SecureStore trước khi trả user
    const user = await loginApi(email, password);
    set({ status: 'authed', user });
  },

  logout: async () => {
    await logoutApi();
    set({ status: 'guest', user: null });
  },

  // Mở app: còn token → thử gọi /api/me. Thành công thì vào thẳng app,
  // 401 thì interceptor tự refresh; refresh fail mới về Login.
  restoreSession: async () => {
    try {
      const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      if (!token) {
        set({ status: 'guest' });
        return;
      }
      const profile = await getMyProfile();
      set({
        status: 'authed',
        user: {
          id: profile.id,
          email: profile.email,
          role: profile.role as AuthUser['role'],
          fullName: profile.fullName,
          avatarUrl: profile.avatarUrl,
        },
      });
    } catch {
      set({ status: 'guest', user: null });
    }
  },
}));

// Refresh token thất bại ở bất kỳ đâu → đưa về màn Login
setSessionExpiredHandler(() => {
  useAuthStore.setState({ status: 'guest', user: null });
});
