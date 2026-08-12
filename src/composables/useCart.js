// import apiEndpoints from '../config/apiEndpoints';
import useAPI from '@/composables/useAPI';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { CART_QUERY_KEY, invalidateCart } from '@/composables/cartQuery';
import { queryClient } from '@/plugins/queryClient';

const useCart = () => {
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

  const getDataCarts = async () => {
    const { _get } = useAPI()
    const response = await _get('/api/cart/content')
    if (response) {
      return response.data
    }
    return null
  }

  const useCartQuery = () => useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: getDataCarts,
  })

  const removeItem = async (id) => {
    const { _delete } = useAPI()
    const response = await _delete('/api/cart/delete/' + `${id}`)
    if (response) {
      return response
    }
    return null
  }

  const useRemoveCartItemMutation = () => useMutation({
    mutationFn: removeItem,
    onSuccess: () => invalidateCart(queryClient),
  })

  const createPayment = async (couponCode = null) => {
    const { _post } = useAPI()
    const payload = {}
    if (couponCode) {
      payload.coupon_code = couponCode
    }
    const response = await _post('/api/payment/create', payload)
    if (response) {
      return response.data
    }
    return null
  }

  const getCourseCoupons = async (courseId) => {
    const { _get } = useAPI()
    const response = await _get(`/api/course/${courseId}/coupons`)
    if (response) {
      return response.data
    }
    return null
  }

  const applyCoupon = async (couponCode) => {
    const { _post } = useAPI()
    const response = await _post('/api/coupon/apply', {
      coupon_code: couponCode
    })
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
    useCartQuery,
    removeItem,
    useRemoveCartItemMutation,
    createPayment,
    getCourseCoupons,
    applyCoupon,
    getPaymentHistoryList,
    getHistoryDetail,
    updateOrderStatus,
    getOrderByCode
  }
}
export default useCart
