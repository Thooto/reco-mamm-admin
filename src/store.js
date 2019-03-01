import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.token,
    logged: localStorage.logged,
    url: process.env.VUE_APP_API_URL
  },

  mutations: {
    login(state, token) {
      localStorage.token = token;
      state.token = token;
      localStorage.logged = true;
      state.logged = true;
    },
    
    logout(state) {
      localStorage.token = null;
      state.token = null;
      localStorage.logged = false;
      state.logged = false;
    }
  },

  actions: {
    login(context, token) {
      context.commit('login', token);
    },

    logout(context) {
      context.commit('logout');
    }
  }
});
