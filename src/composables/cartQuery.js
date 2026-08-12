export const CART_QUERY_KEY = ['cart'];

export const invalidateCart = (queryClient) => queryClient.invalidateQueries({
  queryKey: CART_QUERY_KEY,
});
