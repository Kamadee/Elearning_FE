import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveImageUrl } from '../src/utils/replaceUrlImage.js'

test('resolves relative course images from the API origin when API URL contains /api', () => {
  assert.equal(
    resolveImageUrl('/uploads/course-cover.jpg', 'https://api.viettech.click/api/'),
    'https://api.viettech.click/uploads/course-cover.jpg'
  )
})

test('preserves absolute image URLs', () => {
  const imageUrl = 'https://pub-example.r2.dev/uploads/course-cover.jpg'

  assert.equal(resolveImageUrl(imageUrl, 'https://api.viettech.click/api/'), imageUrl)
})
