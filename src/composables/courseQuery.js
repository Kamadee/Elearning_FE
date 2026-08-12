import { computed, unref } from 'vue';
import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import useCourse from '@/composables/useCourse';
import {
  COURSE_POLLING_INTERVAL,
  courseListQueryKey,
  hotCoursesQueryKey,
} from './courseQueryKeys';

export {
  COURSE_POLLING_INTERVAL,
  courseListQueryKey,
  hotCoursesQueryKey,
} from './courseQueryKeys';

export const useCategoryCoursesQuery = ({ category, page, perPage }) => {
  const categoryValue = computed(() => unref(category));
  const pageValue = computed(() => unref(page));
  const perPageValue = computed(() => unref(perPage));

  return useQuery({
    queryKey: computed(() => courseListQueryKey(
      categoryValue.value,
      pageValue.value,
      perPageValue.value,
    )),
    queryFn: () => useCourse().getDataCourses({
      category_name: [categoryValue.value],
      page: pageValue.value,
      per_page: perPageValue.value,
    }),
    enabled: computed(() => Boolean(categoryValue.value)),
    staleTime: COURSE_POLLING_INTERVAL,
    refetchInterval: COURSE_POLLING_INTERVAL,
    placeholderData: keepPreviousData,
  });
};

export const useHotCoursesQuery = () => useQuery({
  queryKey: hotCoursesQueryKey(),
  queryFn: () => useCourse().getCourseTop(),
  staleTime: COURSE_POLLING_INTERVAL,
  refetchInterval: COURSE_POLLING_INTERVAL,
});
