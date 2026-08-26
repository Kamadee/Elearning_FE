import test from 'node:test'
import assert from 'node:assert/strict'
import { getCourseBannerMetadata } from '../src/utils/courseBanner.js'

test('builds banner metadata from course details with mock learner count', () => {
  const metadata = getCourseBannerMetadata({
    title: 'Learn Vue',
    description: 'Build modern Vue applications.',
    course_categories: [{ category_name: 'Development' }],
    rating_average: 4.5,
  })

  assert.deepEqual(metadata, {
    category: 'Development',
    title: 'Learn Vue',
    description: 'Build modern Vue applications.',
    rating: 4.5,
    learners: '2,081',
  })
})
