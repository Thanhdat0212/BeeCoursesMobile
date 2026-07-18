import { Platform } from 'react-native';

// Backend Bee Academy (Spring Boot) chạy local ở port 8080.
//
// - Android emulator KHÔNG thấy localhost của máy tính — phải dùng 10.0.2.2
//   (địa chỉ alias trỏ về host machine của emulator).
// - Chạy trên điện thoại thật (Expo Go): thay bằng IP LAN của máy tính,
//   vd 'http://192.168.1.10:8080' (máy tính và điện thoại cùng Wi-Fi).
// - iOS simulator dùng được localhost trực tiếp.
export const API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8080',
  default: 'http://localhost:8080',
});
