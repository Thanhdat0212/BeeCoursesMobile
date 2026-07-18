import { apiClient, clearTokens, saveTokens } from './client';
import { ApiResponse, AuthTokens, AuthUser } from '../types';

// POST /api/auth/login — backend bọc data trong ApiResponse,
// service unwrap sẵn để store/screen chỉ nhận phần cần dùng
export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await apiClient.post<ApiResponse<AuthTokens>>('/api/auth/login', {
    email,
    password,
  });
  const tokens = res.data.data;
  await saveTokens(tokens.accessToken, tokens.refreshToken);
  if (!tokens.user) {
    throw new Error('Login response thiếu thông tin user');
  }
  return tokens.user;
}

export async function logout(): Promise<void> {
  try {
    // Báo backend revoke token phía Supabase — lỗi cũng không sao,
    // quan trọng là token local phải bị xóa
    await apiClient.post('/api/auth/logout');
  } catch {
    // bỏ qua — token có thể đã hết hạn
  } finally {
    await clearTokens();
  }
}
