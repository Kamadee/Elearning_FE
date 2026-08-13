// import apiEndpoints from '../config/apiEndpoints';
import useAPI from '@/composables/useAPI';
import apiEndpoints from '@/config/apiEndpoints';
import { invalidateCart } from '@/composables/cartQuery';
import { queryClient } from '@/plugins/queryClient';
import { normalizeHotCoursesResponse } from '@/composables/courseQueryUtils';

const useCourse = () => {
  const getDataCourses = async (filterData) => {
    const { _get } = useAPI()
    const response = await _get('/api/course/list', filterData, {
      headers: {
        'X-Requires-Auth': 'false'
      }
    });

    if (response) {
      return response.data
    }
    return null
  };

  const getDetailCourse = async (id) => {
    const { _get } = useAPI()
    const response = await _get(`/api/course/detail/${id}`, {}, {
      headers: {
        'X-Requires-Auth': 'optional',
        'X-Redirect-On-401': 'false'
      }
    })

    if (response) {
      return response.data
    }
    return null;
  }

  const getVimeo = async (id) => {
    const { _get } = useAPI()
    const response = await _get('/api/video/vimeo' + `/${id}`)
    if (response) {
      return response.data
    }
    return null
  }

  const addCourse = async (id, quantity = 1) => {
    const { _post } = useAPI()
    const response = await _post('/api/cart/add', {
      course_id: id,
      quantity: quantity
    })
    if (response) {
      await invalidateCart(queryClient)
      return response
    }
    return null
  }

  const getCourseTop = async () => {
    const { _get } = useAPI()
    const response = await _get('/api/course/top', {
      headers: {
        'X-Requires-Auth': 'false'
      }
    })
    if (response) {
      return normalizeHotCoursesResponse(response.data)
    }
    return null
  }

  const getDataOrders = async () => {
    const { _get } = useAPI()
    const response = await _get('/api/customer/orders', {
      headers: {
        'X-Requires-Auth': 'false'
      }
    })
    if (response) {
      return response.data
    }
    return null
  }

  const addReview = async (rating, comment, id) => {
    const { _post } = useAPI()
    const response = await _post(`/api/course/review/add/${id}`, {
      course_id: id,
      comment: comment,
      rate: rating
    })
    if (response) {
      return response
    }
    return null
  }

  const getDataReview = async (id, page, perPage) => {
    const { _get } = useAPI()
    const response = await _get(`/api/course/reiview/${id}`, {
      page: page,
      per_page: perPage,
      headers: {
        'X-Requires-Auth': 'false'
      }
    })
    if (response) {
      return response.data
    }
    return null
  }

  const getCategoryBestOfUser = async () => {
    const { _get } = useAPI()
    const response = await _get('/api/course/customer/best-category')
    if (response) {
      return response.data
    }
    return null
  }

  const getNewCourses = async (id) => {
    const { _get } = useAPI()
    const response = await _get(`/api/course/notifications/new-courses/${id}`)

    if (response) {
      return response.data
    }
    return null
  }

  const getCategories = async () => {
    const { _get } = useAPI()
    const response = await _get('/api/course/categories', {}, {
      headers: {
        'X-Requires-Auth': 'false'
      }
    })
    if (response) {
      return response.data
    }
    return null
  }

  const getTags = async () => {
    const { _get } = useAPI()
    const response = await _get('/api/course/tags', {}, {
      headers: {
        'X-Requires-Auth': 'false'
      }
    })
    if (response) {
      return response.data
    }
    return null
  }

  const updateVideoProgress = async (payload) => {
    const { _post } = useAPI()
    const response = await _post('/api/course/video/progress', payload, {
      headers: {
        'X-Requires-Auth': 'true'
      }
    })
    if (response) {
      return response.data
    }
    return null
  }

  const submitQuiz = async (quizId, answers) => {
    const { _post } = useAPI()
    const response = await _post('/api/course/quiz/submit', {
      quiz_id: quizId,
      answers: answers
    }, {
      headers: {
        'X-Requires-Auth': 'true'
      }
    })
    if (response) {
      return response.data
    }
    return null
  }

  return {
    getDataCourses,
    getDetailCourse,
    addCourse,
    getVimeo,
    getCourseTop,
    getDataOrders,
    addReview,
    getDataReview,
    getCategoryBestOfUser,
    getNewCourses,
    getCategories,
    getTags,
    updateVideoProgress,
    submitQuiz
  }
}
export default useCourse
