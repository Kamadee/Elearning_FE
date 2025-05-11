import apiEndpoints from '../config/apiEndpoints'
import http from '@/utils/http'
import qs from 'qs'
import useAPI from '@/composables/useAPI'

const useBlog = () => {
  const getDataBlogs = async (page, perPage, filterData) => {
    const { _get } = useAPI()
    const response = await _get(apiEndpoints.GET_POST_LIST, {
        page,
        perPage,
        ...filterData,
        custom: {
          requireAuth: false,
        }
    });
    if(response) {
      return response
    }
    return null
  }

  const getDetailBlog = async (id) => {
    const { _get } = useAPI()
    try {
      const response = await _get(`api/post/${id}`, {
        custom: {
          requireAuth: false, // <-- chỉ cần thêm dòng này
        }
      })
      if(response) {
        return response.data
      }
      return null
    } catch(err) {
      console.log(err);
    }
  }

  return { 
    getDataBlogs,
    getDetailBlog
  }
}
export default useBlog