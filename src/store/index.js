import { createStore } from 'vuex'

export default createStore({
  state: {
    registrationData: null,
  },
  getters: {
  },
  mutations: {
    setRegistrationData(state, data) {
      state.registrationData = data;
    },
  },
  actions: {
   
  },
  modules: {
  }
})
