export const normalizeHotCoursesResponse = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  return Array.isArray(response?.data) ? response.data : [];
};

export const getFreeLearningCourses = (courses = []) => courses.filter((course) => (
  Number(course.original_price) === 0 || Number(course.sale_off_price) === 0
));
