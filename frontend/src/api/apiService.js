import axiosInstance from './axiosConfig';

export const authAPI = {
  register: (data) => axiosInstance.post('/auth/register', data),
  login: (data) => axiosInstance.post('/auth/login', data),
  getCurrentUser: () => axiosInstance.get('/auth/me'),
  logout: () => axiosInstance.post('/auth/logout'),
};

export const courseAPI = {
  getAllCourses: (params) => axiosInstance.get('/courses', { params }),
  getCourseById: (id) => axiosInstance.get(`/courses/${id}`),
  getFeaturedCourses: () => axiosInstance.get('/courses/featured'),
  getInstructorCourses: () => axiosInstance.get('/courses/instructor'),
  createCourse: (data) => axiosInstance.post('/courses', data),
  updateCourse: (id, data) => axiosInstance.put(`/courses/${id}`, data),
  deleteCourse: (id) => axiosInstance.delete(`/courses/${id}`),
  getLessons: (id) => axiosInstance.get(`/courses/${id}/lessons`),
  addLesson: (id, data) => axiosInstance.post(`/courses/${id}/lessons`, data),
  updateLesson: (courseId, lessonId, data) => axiosInstance.put(`/courses/${courseId}/lessons/${lessonId}`, data),
  deleteLesson: (courseId, lessonId) => axiosInstance.delete(`/courses/${courseId}/lessons/${lessonId}`),
  reorderLessons: (courseId, orderedLessonIds) => axiosInstance.put(`/courses/${courseId}/lessons/reorder`, { orderedLessonIds }),
  publishCourse: (id) => axiosInstance.put(`/courses/${id}/publish`, {}),
  unpublishCourse: (id) => axiosInstance.put(`/courses/${id}/unpublish`, {}),
  toggleFeatured: (id) => axiosInstance.put(`/courses/${id}/featured`, {}),
};

export const uploadAPI = {
  uploadCourseThumbnail: (file) => {
    const fd = new FormData();
    fd.append('thumbnail', file);
    return axiosInstance.post('/uploads/course-thumbnail', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadLessonVideo: (file) => {
    const fd = new FormData();
    fd.append('video', file);
    return axiosInstance.post('/uploads/lesson-video', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadAssignmentResources: (files) => {
    const fd = new FormData();
    (files || []).forEach((f) => fd.append('resources', f));
    return axiosInstance.post('/uploads/assignment-resources', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};


export const enrollmentAPI = {
  enrollCourse: (data) => axiosInstance.post('/enrollments/enroll', data),
  getUserEnrollments: () => axiosInstance.get('/enrollments/my-enrollments'),
  getEnrollmentByCourse: (courseId) => axiosInstance.get(`/enrollments/${courseId}`),
  completeLesson: (data) => axiosInstance.put('/enrollments/complete-lesson', data),
  getCourseEnrollments: (courseId) => axiosInstance.get(`/enrollments/course/${courseId}/students`),
};

export const quizAPI = {
  getQuizzesByCourse: (courseId) => axiosInstance.get(`/quizzes/course/${courseId}`),
  getCourseQuizzes: (courseId) => axiosInstance.get(`/courses/${courseId}/quizzes`),
  getQuizById: (quizId) => axiosInstance.get(`/quizzes/${quizId}`),
  createQuiz: (data) => axiosInstance.post('/quizzes', data),
  createCourseQuiz: (courseId, data) => axiosInstance.post(`/courses/${courseId}/quizzes`, data),

  updateQuiz: (quizId, data) => axiosInstance.put(`/quizzes/${quizId}`, data),
  deleteQuiz: (quizId) => axiosInstance.delete(`/quizzes/${quizId}`),

  submitQuiz: (quizId, data) => axiosInstance.post(`/quizzes/${quizId}/submit`, data),
  getQuizAttempts: (quizId) => axiosInstance.get(`/quizzes/${quizId}/attempts`),
};

export const assignmentAPI = {
  getAssignmentsByCourse: (courseId) => axiosInstance.get(`/assignments/course/${courseId}`),
  getCourseAssignments: (courseId) => axiosInstance.get(`/courses/${courseId}/assignments`),
  getAssignmentById: (id) => axiosInstance.get(`/assignments/${id}`),
  createAssignment: (data) => axiosInstance.post('/assignments', data),
  createCourseAssignment: (courseId, data) => axiosInstance.post(`/courses/${courseId}/assignments`, data),

  updateAssignment: (id, data) => axiosInstance.put(`/assignments/${id}`, data),
  deleteAssignment: (id) => axiosInstance.delete(`/assignments/${id}`),
  replaceAssignmentResources: (id, resourceUrls) => axiosInstance.post(`/assignments/${id}/resources/replace`, { resourceUrls }),

  submitAssignment: (id, data) => axiosInstance.post(`/assignments/${id}/submit`, data),
  gradeSubmission: (id, data) => axiosInstance.put(`/assignments/${id}/grade`, data),
  getUserSubmissions: (courseId) => axiosInstance.get(`/assignments/submissions/course/${courseId}`),
};


export const paymentAPI = {
  createPaymentOrder: (data) => axiosInstance.post('/payments/create-order', data),
  verifyPayment: (data) => axiosInstance.post('/payments/verify', data),
  getPaymentHistory: () => axiosInstance.get('/payments/history'),
  getAllPayments: () => axiosInstance.get('/payments'),
};

export const notificationAPI = {
  getNotifications: () => axiosInstance.get('/notifications'),
  markNotificationAsRead: (id) => axiosInstance.put(`/notifications/${id}/read`, {}),
  markAllAsRead: () => axiosInstance.put('/notifications/mark-all/read', {}),
  deleteNotification: (id) => axiosInstance.delete(`/notifications/${id}`),
  getUnreadCount: () => axiosInstance.get('/notifications/unread-count'),
};

export const certificateAPI = {
  generateCertificate: (data) => axiosInstance.post('/certificates/generate', data),
  getCertificateStatus: (courseId) => axiosInstance.get(`/certificates/status/${courseId}`),
};

export const adminAPI = {
  getStats: () => axiosInstance.get('/admin/stats'),
  getAllUsers: (params) => axiosInstance.get('/admin/users', { params }),
  getUserById: (id) => axiosInstance.get(`/admin/users/${id}`),
  createUser: (data) => axiosInstance.post('/admin/users', data),
  updateUser: (id, data) => axiosInstance.put(`/admin/users/${id}`, data),
  deleteUser: (id) => axiosInstance.delete(`/admin/users/${id}`),
  getAllCourses: (params) => axiosInstance.get('/admin/courses', { params }),
  createCourse: (data) => axiosInstance.post('/admin/courses', data),
  updateCourse: (id, data) => axiosInstance.put(`/admin/courses/${id}`, data),
  deleteCourse: (id) => axiosInstance.delete(`/admin/courses/${id}`),
};
