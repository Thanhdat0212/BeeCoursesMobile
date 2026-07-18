import { apiClient } from './client';
import { ApiResponse, Profile } from '../types';

// GET /api/me — endpoint bảo vệ, cần JWT hợp lệ
export async function getMyProfile(): Promise<Profile> {
  const res = await apiClient.get<ApiResponse<Profile>>('/api/me');
  return res.data.data;
}
