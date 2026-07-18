import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../config';
import { ApiResponse, AuthTokens } from '../types';

export const ACCESS_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Gắn JWT cho mọi request — screen/service không đụng vào token
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// authStore đăng ký handler khi khởi tạo — không import store trực tiếp
// để tránh vòng lặp import client → store → service → client
let sessionExpiredHandler: (() => void) | null = null;

export function setSessionExpiredHandler(handler: () => void) {
  sessionExpiredHandler = handler;
}

export async function saveTokens(accessToken: string, refreshToken: string) {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}

// Đánh dấu request đã retry để không lặp vô hạn khi refresh xong vẫn 401
interface RetryableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const config = error.config as RetryableConfig | undefined;

    // Chỉ xử lý 401 của request CHƯA retry, và không phải chính request refresh
    const isAuthCall = config?.url?.includes('/api/auth/');
    if (error.response?.status !== 401 || !config || config._retried || isAuthCall) {
      return Promise.reject(error);
    }

    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      await clearTokens();
      sessionExpiredHandler?.();
      return Promise.reject(error);
    }

    try {
      // Dùng axios gốc (không phải apiClient) để request refresh
      // không đi qua interceptor này lần nữa
      const res = await axios.post<ApiResponse<AuthTokens>>(
        `${API_BASE_URL}/api/auth/refresh`,
        { refreshToken },
        { timeout: 15000 }
      );
      const tokens = res.data.data;
      await saveTokens(tokens.accessToken, tokens.refreshToken);

      // Retry request gốc đúng 1 lần với token mới
      config._retried = true;
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
      return apiClient(config);
    } catch {
      // Refresh cũng fail → phiên hết hạn thật sự, về màn Login
      await clearTokens();
      sessionExpiredHandler?.();
      return Promise.reject(error);
    }
  }
);
