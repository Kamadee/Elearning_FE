import { defineStore } from 'pinia';

export const useCounterStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('Authorization') || null,
    dataSearch: [],
    keySearch: "",
    inCart: false
  }),
  getters: {
    isLogged: (state) => !!state.token,
    getDataSearch(state) {
      return state.dataSearch
    },
    getKeySearch(state) {
      return state.keySearch
    },
    getInCart(state) {
      return state.inCart
    }
  },
  actions: {
    setToken(token) {
      this.token = token;
    },
    setDataSearch(dataSearch) {
      this.dataSearch = dataSearch
    },
    setKeySearch(keySearch) {
      this.keySearch = keySearch
    },
    setInCart(inCart) {
      this.inCart = inCart
    },
    removeToken() {
      this.token = null;
      localStorage.removeItem('Authorization');
    }
  }
});