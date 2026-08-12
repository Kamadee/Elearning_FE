export const COURSE_POLLING_INTERVAL = 15 * 60 * 1000;

export const courseListQueryKey = (category, page, perPage) => [
  'courses',
  'category',
  category,
  { page, per_page: perPage },
];

export const hotCoursesQueryKey = () => ['courses', 'hot'];
