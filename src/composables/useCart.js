// import apiEndpoints from '../config/apiEndpoints';
import useAPI from '@/composables/useAPI';
import qs from 'qs'

const useCart = () => {
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

  const getDataCarts = async () => {
    const { _get } = useAPI()
    const response = await _get('/api/cart/content')
    if (response) {
      return response.data
    }
    return null
  }

  const removeItem = async (id) => {
    const { _delete } = useAPI()
    const response = await _delete('/api/cart/delete/' + `${id}`)
    if (response) {
      return response
    }
    return null
  }

  const createPayment = async () => {
    const { _post } = useAPI()
    const response = await _post('/api/payment/create')
    if (response) {
      return response.data
    }
    return null
  }

  const getPaymentHistoryList = async () => {
    const { _get } = useAPI()
    const response = await _get('/api/customer/orders')
    if (response) {
      return response.data
    }
    return null
  }

  const getHistoryDetail = async (id) => {
    const { _get } = useAPI()
    const response = await _get('/api/customer/orders/' + `${id}`)
    if (response) {
      return response.data
    }
    return null
  }

  const updateOrderStatus = async (payload) => {
    const { _get } = useAPI()
    const { vnp_SecureHash, vnp_TmnCode,vnp_TransactionNo, vnp_Amount, vnp_BankCode, vnp_TxnRef, vnp_ResponseCode, vnp_PayDate, vnp_TransactionStatus, vnp_BankTranNo, vnp_CardType, vnp_OrderInfo } = payload
    const response = await _get('/api/payment/response', {
      vnp_SecureHash, vnp_Amount, vnp_TransactionNo, vnp_TmnCode, vnp_BankCode, vnp_TxnRef, vnp_ResponseCode, vnp_PayDate, vnp_TransactionStatus, vnp_BankTranNo, vnp_CardType, vnp_OrderInfo
    })
    if (response) {
      return response
    }
    return null
  }

  const getOrderByCode = async (code) => {
    const { _get } = useAPI()
    const response = await _get('/api/customer/orders_code/' + `${code}`)
    if (response) {
      return response.data
    }
    return null
  }

  return {
    addCourse,
    getDataCarts,
    removeItem,
    createPayment,
    getPaymentHistoryList,
    getHistoryDetail,
    updateOrderStatus,
    getOrderByCode
  }
}
export default useCart