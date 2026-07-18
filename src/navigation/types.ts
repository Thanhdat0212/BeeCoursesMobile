// Param list tách file riêng — screen import không tạo vòng lặp với AppNavigator
export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  // Truyền title để header hiện tên khóa ngay khi đang tải chi tiết
  CourseDetail: { courseId: string; title: string };
};

export type MainTabParamList = {
  Courses: undefined;
  Profile: undefined;
};
