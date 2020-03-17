import Vue from 'vue'
import Vuex from 'vuex'
import {
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_ERROR,
  AUTH_LOGOUT
} from '../store/actions/auth'
import createLogger from '../plugins/logger'
const URL_API = 'http://localhost:3000'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  strict: debug,
  plugins: debug ? [createLogger()] : [],
  state: {
    token: localStorage.getItem('user-token') || '',
    status: ''
  },
  mutations: {
    [AUTH_REQUEST]: state => {
      state.status = 'loading'
    },
    [AUTH_SUCCESS]: (state, token) => {
      state.status = 'success'
      state.token = token
    },
    [AUTH_ERROR]: state => {
      state.status = 'error'
    }
  },
  actions: {
    [AUTH_REQUEST] ({ commit, dispatch }, user) {
      commit(AUTH_REQUEST)
      return new Promise((resolve, reject) => {
        Vue.axios({
          url: `${URL_API}/auth/login`,
          data: user,
          method: 'POST',
          useCredentails: true,
          headers: {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        })
          .then(resp => {
            const token = resp.data.access_token
            localStorage.setItem('user-token', token)
            commit(AUTH_SUCCESS, token)
            resolve(resp)
          })
          .catch(err => {
            commit(AUTH_ERROR, err)
            localStorage.removeItem('user-token') // if the request fails, remove any possible user token if possible
            reject(err)
          })
      })
    },
    [AUTH_LOGOUT]: ({ commit, dispatch }) => {
      return new Promise((resolve, reject) => {
        commit(AUTH_LOGOUT)
        localStorage.removeItem('user-token') // clear your user's token from localstorage
        resolve()
      })
    }
  },
  modules: {}
})
