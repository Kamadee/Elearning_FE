export const normalizeHotCoursesResponse = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  return Array.isArray(response?.data) ? response.data : [];
};
