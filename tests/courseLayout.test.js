import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const contentSource = fs.readFileSync(new URL('../src/components/dashboard/Content.vue', import.meta.url), 'utf8')
const listCoursesSource = fs.readFileSync(new URL('../src/components/course/ListCourses.vue', import.meta.url), 'utf8')

test('dashboard course carousels show five cards at the desktop breakpoint', () => {
  assert.match(contentSource, /1024:\s*\{[\s\S]*?slidesPerView:\s*5[\s\S]*?\}/)
})

test('category course list lays out five cards per desktop row', () => {
  assert.match(listCoursesSource, /calc\(\(100%\s*-\s*4\s*\*\s*16px\)\s*\/\s*5\)/)
})

test('category course pages contain a whole number of five-card rows', () => {
  assert.match(listCoursesSource, /const perPage = ref\(15\)/)
})
