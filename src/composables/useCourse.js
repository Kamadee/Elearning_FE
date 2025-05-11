// import apiEndpoints from '../config/apiEndpoints';
import useAPI from '@/composables/useAPI';
import apiEndpoints from '@/config/apiEndpoints';

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
    console.log(response);
    
    if(response) {
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
      return response.data
    }
    return null
  }

  return { 
    getDataCourses,
    getDetailCourse,
    addCourse,
    getVimeo,
    getCourseTop
  }
}
export default useCourse