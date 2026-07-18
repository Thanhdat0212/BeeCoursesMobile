// Giá backend lưu Integer VND — format kiểu Việt Nam: 299.000 ₫
export function formatVnd(amount: number): string {
  return `${amount.toLocaleString('vi-VN')} ₫`;
}

// 4530s → "1g 15p" | 750s → "12p"
export function formatDuration(totalSec: number | null): string {
  if (!totalSec || totalSec <= 0) return '—';
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.round((totalSec % 3600) / 60);
  return hours > 0 ? `${hours}g ${minutes}p` : `${minutes}p`;
}
