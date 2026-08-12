import test from 'node:test';
import assert from 'node:assert/strict';
import {
  COURSE_POLLING_INTERVAL,
  courseListQueryKey,
  hotCoursesQueryKey,
} from '../src/composables/courseQueryKeys.js';
import {
  getFreeLearningCourses,
  normalizeHotCoursesResponse,
} from '../src/composables/courseQueryUtils.js';

test('uses a separate cache key for each course category page', () => {
  assert.deepEqual(courseListQueryKey('fitness', 1, 12), [
    'courses',
    'category',
    'fitness',
    { page: 1, per_page: 12 },
  ]);

  assert.notDeepEqual(
    courseListQueryKey('fitness', 1, 12),
    courseListQueryKey('fitness', 2, 12),
  );
});

test('uses a stable key for hot courses and polls every 15 minutes', () => {
  assert.deepEqual(hotCoursesQueryKey(), ['courses', 'hot']);
  assert.equal(COURSE_POLLING_INTERVAL, 15 * 60 * 1000);
});

test('normalizes the hot course API envelope into an array', () => {
  const hotCourse = { course: { id: 1 } };

  assert.deepEqual(normalizeHotCoursesResponse({ data: [hotCourse] }), [hotCourse]);
  assert.deepEqual(normalizeHotCoursesResponse([hotCourse]), [hotCourse]);
  assert.deepEqual(normalizeHotCoursesResponse({ data: null }), []);
});

test('keeps free courses in the my learn list', () => {
  const courses = [
    { id: 1, original_price: 0, sale_off_price: 100 },
    { id: 2, original_price: 200, sale_off_price: 0 },
    { id: 3, original_price: 200, sale_off_price: 100 },
  ];

  assert.deepEqual(getFreeLearningCourses(courses).map((course) => course.id), [1, 2]);
});
