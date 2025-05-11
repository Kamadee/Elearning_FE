import { reactive } from 'vue'
import apiEndpoints from '../config/apiEndpoints'
import http from '@/utils/http';
import { useCounterStore } from '@/stores/authStore'
import useAPI from '@/composables/useAPI'
import { jwtDecode } from 'jwt-decode'
import { useNotify } from '@/composables/useNotify'

const useAuth = () => {
  const { notify } = useNotify()
  const authUser = reactive({ value: null });
  const setUser = (user) => {
    if (user) {
      authUser.value = user;
    } else {
      console.error("User is undefined");
    }
  };

  const setAuthenticated = (token, expiresTime) => {
    if (token) {
      localStorage.setItem('Authorization', 'Bearer ' + token);
      localStorage.setItem('tokenExpiry',  expiresTime.toString())
    }
  };

  // const getToken = () => {
  //   return localStorage.getItem('Authorization');
  // };

  const login = async (email, password) => {
    const { _post } = useAPI()
    try {
      const response = await _post(apiEndpoints.AUTH_TOKEN, { email, password });
      if (response.status === 200) {
        const token = response.access_token;
        const expiration = jwtDecode(token).exp * 1000;
  
        setAuthenticated(token, expiration);
        useCounterStore().setToken(token);
        setUser(response.user)
        
        return authUser;
      } else {
        handleError(response);
        return null;
      }
    } catch (error) {
        handleError(error);
    }
  };
  
  const handleError = (error) => {
    let messages = [];
    const { status, data } = error.response;
    if (status === 404) {
      messages = [data.error || 'Resource not found.'];
    } else if (status === 422) {
      messages = data.errors ? Object.values(data.errors).flat() : ['Validation failed.'];
    } else {
      messages = [data.error || 'An unexpected error occurred.'];
    }
    messages.forEach(msg => {
      notify(msg, 'error');
    });
  };

  const register = async (first_name, last_name, email, password) => {
    const { _post } = useAPI()
    try {
      const response = await _post(apiEndpoints.AUTH_REGISTER, {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password
      });
      console.log(response);
      
      if(response.status === 201) {
        return response
      } else {
        handleError(response);
          return null;
      }
    } catch (error) {
      handleError(error)
    }
    
  }

  const logOut = async () => {
    const authToken = localStorage.getItem('Authorization')
    if(authToken) {
      localStorage.removeItem('Authorization')
      localStorage.removeItem('tokenExpiry')
      return true
    }
    return false
  }

  
  const forgotPass = async (email) => {
    const { _post } = useAPI()
    const response = await _post(apiEndpoints.FORGOT_PASSWORD, {
      email: email
    });
    if(response) {
      return response.data
    }
    return null
  }
  
  const resetPass = async (email, password, token) => {
    const { _post } = useAPI()
    const response = await _post(apiEndpoints.RESET_PASSWORD, {
      email: email,
      password: password,
      token: token
    });
    if(response) {
      return response.data
    }
    return null
  }
  
  const getDataProfile = async () => {
    const { _get } = useAPI()
    const response = await _get(apiEndpoints.GET_PROFILE);
    if(response) {
      return response.data
    }
    return null
  }

  const editProfile = async (firstName, lastName, phone) => {
    const { _patch } = useAPI()
    const response = await _patch(apiEndpoints.UPDATE_PROFILE, {
      first_name: firstName,
      last_name: lastName,
      phone: phone
    })
    if(response) {
      return response.data
    }
    return null
  }

  return { 
    login,
    register,
    logOut,
    getDataProfile,
    editProfile,
    forgotPass,
    resetPass
  }
}
export default useAuth