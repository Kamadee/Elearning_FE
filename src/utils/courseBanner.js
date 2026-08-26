const MOCK_LEARNERS = '2,081'
const DEFAULT_RATING = 4.5

export const getCourseBannerMetadata = (courseData = {}) => {
  const course = courseData && typeof courseData === 'object' ? courseData : {}
  const category = course.course_categories?.[0]?.category_name || 'Khóa học'
  const rating = Number(course.rating_average ?? DEFAULT_RATING)

  return {
    category,
    title: course.title || 'Khóa học trực tuyến',
    description: course.description || 'Khám phá nội dung học tập và nâng cao kỹ năng của bạn.',
    rating: Number.isFinite(rating) ? rating : DEFAULT_RATING,
    learners: MOCK_LEARNERS,
  }
}
