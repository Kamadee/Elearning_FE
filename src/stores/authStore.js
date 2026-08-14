import { defineStore } from 'pinia';
import { authTokenStore } from '@/utils/authTokenStorage';

export const useCounterStore = defineStore('auth', {
  state: () => ({
    token: null,
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
    dataSearch: [],
    keySearch: "",
    inCart: JSON.parse(localStorage.getItem('inCart')) || [],
    gettingData: false,
    isOpenSidebar: false,
    isOpenSearch: false,
    isDropDown: false
  }),
  getters: {
    isLogged: (state) => !!state.token,
    getUser: (state) => state.userInfo,
    getDataSearch(state) {
      return state.dataSearch
    },
    getKeySearch(state) {
      return state.keySearch
    },
    getInCart(state) {
      return state.inCart
    },
    getGettingData(state) {
      return state.gettingData
    },
    getIsOpenSidebar(state) {
      return state.isOpenSidebar
    },
    getIsOpenSearch(state) {
      return state.isOpenSearch
    },
    getIsDropDown(state) {
      return state.isDropDown
    },
  },
  actions: {
    setToken(token) {
      this.token = token;
      authTokenStore.set(token ? `Bearer ${token}` : null);
    },
    setUser(user) {
      this.userInfo = user;
    },
    setDataSearch(dataSearch) {
      this.dataSearch = dataSearch
    },
    setKeySearch(keySearch) {
      this.keySearch = keySearch
    },
    setInCart(id) {
      if(this.inCart.includes(id)) {
        this.inCart = this.inCart.filter(item => item !== id)
      } else {
        this.inCart.push(id)
      }
      localStorage.setItem('inCart', JSON.stringify(this.inCart))
    },
    deleteInCart(id) {
      this.inCart = this.inCart.filter(item => item !== id)
      localStorage.setItem('inCart', JSON.stringify(this.inCart))
    },
    setInCartList(list) {
      this.inCart = list
      localStorage.setItem('inCart', JSON.stringify(list))
    },
    setGettingData(value) {
      this.gettingData = value
    },
    setIsOpenSidebar(value) {
      this.isOpenSidebar = value
    },
    setIsOpenSearch(value) {
      this.isOpenSearch = value
    },
    setIsDropDown(value) {
      this.isDropDown = value
    },
    removeToken() {
      this.token = null;
      this.userInfo = null;
      this.inCart = [];
      localStorage.removeItem('userInfo');
      localStorage.removeItem('inCart');
      authTokenStore.clear();
    }
  }
});
