export const theme = {
  colors: {
    // Tông màu Làng Mây (Cloud Blue & Sky Aesthetic)
    primary: '#0EA5E9',          // Xanh bầu trời trong vắt (Vibrant Sky Blue như trên hình mẫu)
    primaryDark: '#0284C7',      // Xanh mây sâu (Deep Sky Blue)
    primaryLight: '#E0F2FE',     // Ánh mây nhạt bồng bềnh (Soft Cloud Tint)
    primaryLighter: '#F8FAFC',   // Trắng sương mây (Airy Cloud White)
    
    // Màu phụ trợ & Ánh nắng mây
    accent: '#38BDF8',           // Xanh ngọc mây phát sáng (Luminous Cloud Cyan)
    accentSoft: '#F0F9FF',       // Sương mây sớm
    star: '#F59E0B',             // Vàng nắng ấm cho sao đánh giá
    background: '#F8FAFC',       // Nền sương mây tinh khôi, thoáng mát, dịu mắt
    card: '#FFFFFF',             // Thẻ trắng mây tinh tế, tương phản trong trẻo
    cardSubtle: '#F1F5F9',       // Thẻ phụ mềm mại
    text: '#0F172A',             // Chữ xanh đen đậm nét, sắc sảo (Slate Dark)
    textSecondary: '#475569',    // Chữ phụ xám xanh thanh lịch (Slate Medium)
    textMuted: '#94A3B8',        // Chữ placeholder mờ chuẩn hình mẫu
    border: '#E2E8F0',           // Viền mây mờ mềm mại (Soft Cloud Border)
    borderFocus: '#0EA5E9',      // Viền xanh sáng khi focus
    
    // Trạng thái sách tông mây nhẹ nhàng (Cloud Pastel Statuses)
    statusToRead: '#0284C7',     // To Read: Xanh mây biếc
    statusToReadBg: '#E0F2FE',
    statusToReadBorder: '#BAE6FD',

    statusReading: '#6366F1',    // Reading: Tím mây hoàng hôn (Sunset Twilight)
    statusReadingBg: '#EEF2FF',
    statusReadingBorder: '#C7D2FE',

    statusFinished: '#059669',   // Finished: Xanh ngọc thảo nguyên mây (Meadow Cloud)
    statusFinishedBg: '#ECFDF5',
    statusFinishedBorder: '#A7F3D0',

    // Thông báo & Hành động
    success: '#059669',
    successBg: '#ECFDF5',
    successBorder: '#A7F3D0',
    error: '#E11D48',
    errorBg: '#FFF1F2',
    errorBorder: '#FECDD3',
    danger: '#E11D48',
    white: '#FFFFFF',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  borderRadius: {
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
    full: 9999,
  },
  shadow: {
    soft: {
      shadowColor: '#0EA5E9',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 14,
      elevation: 3,
    },
    cloud: {
      shadowColor: '#0EA5E9',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 5,
    },
    card: {
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 2,
    },
  },
};
