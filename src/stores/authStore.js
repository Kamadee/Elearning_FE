import { defineStore } from 'pinia';

export const useCounterStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('Authorization') || null,
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
    dataSearch: [],
    keySearch: "",
    inCart: false,
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
    setInCart(inCart) {
      this.inCart = inCart
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
      localStorage.removeItem('Authorization');
    }
  }
});