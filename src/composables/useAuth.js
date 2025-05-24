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

  const login = async (email, password) => {
    const { _post } = useAPI()
    try {
      const response = await _post('/api/customer/login', { email: email, password: password });
      
      
      if (response.status === 200) {
        const token = response.access_token;
        const expiration = jwtDecode(token).exp * 1000;
  
        setAuthenticated(token, expiration);
        useCounterStore().setToken(token);
        setUser(response.user)
        
        return authUser;
      } else {
        // handleError(response);
        return null;
      }
    } catch (error) {
        handleError(error);
    }
  };
  
  const handleError = (error) => {
    const response = error.response?.data
    console.log(response);
    
    let messages = [];
    if (response?.status === 404) {
      messages = [response?.error || 'Resource not found.'];
    } else if (response?.status === 422) {
      const validatorError = response?.errors
      if(validatorError) {
        const emailValidate = validatorError.email || []
        const passValidate = validatorError.password || []
        messages = [...emailValidate, ...passValidate]
      }
    } else {
      messages = [response?.error || 'Password is incorrect'];
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
        // handleError(response);
        return null;
      }
    } catch (error) {
      handleError(error)
    }
  }

  const verifyEmail = async (verifyCode) => {
    const { _post } = useAPI()
    const response = await _post('/api/customer/verify', {code: verifyCode,})
    if(response) {
      return response
    }
    return null
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
    console.log(firstName, lastName, phone);
    
    const response = await _patch(apiEndpoints.UPDATE_PROFILE, {
      first_name: firstName,
      last_name: lastName,
      phone: phone
    })
    console.log(response);
    
    if(response) {
      return response
    }
    return null
  }

  return { 
    login,
    register,
    verifyEmail,
    logOut,
    getDataProfile,
    editProfile,
    forgotPass,
    resetPass
  }
}
export default useAuth