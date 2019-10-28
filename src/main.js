// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import NutUI from '@nutui/nutui'
import '@nutui/nutui/dist/nutui.css'
import axios from 'axios'
NutUI.install(Vue)
Vue.use(Vuex)
Vue.prototype.axios = axios
Vue.config.productionTip = false
// Vue.prototype.reqAddress = 'http://192.168.31.68:7028'
Vue.prototype.reqAddress = 'http://192.168.31.34:7028'
// Vue.prototype.reqAddress = 'http://hc.app.7peak.cn'
Vue.prototype.muiAddress = 'http://192.168.31.54:8848'
// Vue.prototype.muiAddress = 'http://192.168.31.54:80'
Vue.prototype.vueAddress = 'http://192.168.31.54:8080'
const store = new Vuex.Store({
  state: {
    isLoading: true, // 是否加载中
    loadImg: 'loading', // load状态图片(loading,loadFailure,loadSuccess)
    userName: '' || localStorage.getItem('user_name'), // 用户名
    userId: '' || localStorage.getItem('user_id'), // 用户id
    userAvatar: '' || localStorage.getItem('user_avatar'), // 用户头像
    masterName: '' || localStorage.getItem('master_name'), // 师傅名
    masterId: '' || localStorage.getItem('master_id'), // 师傅id
    masterPhone: '' || localStorage.getItem('master_phone'), // 师傅手机
    orderHandleId: '' || localStorage.getItem('order_handle_id'), // 师傅: 操作的订单id
    goodsForOrderArr: '' || localStorage.getItem('goods_for_order_arr') // 师傅: 操作的订单下的所有物品
  },
  mutations: {
    // 是否加载中
    updateIsLoading (state, isLoading) {
      state.isLoading = isLoading
      if (isLoading === false) {
        state.loadImg = 'loading'
      }
    },
    // load状态图片
    updateLoadImg (state, loadImg) {
      state.loadImg = loadImg
    },
    // 登录用户名
    updateUserName (state, userName) {
      state.userName = userName
      localStorage.setItem('user_name', userName)
    },
    // 登录用户id
    updateUserId (state, userId) {
      state.userId = userId
      localStorage.setItem('user_id', userId)
    },
    // 登录用户头像
    updateUserHeadImg (state, userHeadImg) {
      state.userAvatar = userHeadImg
      localStorage.setItem('user_avatar', userHeadImg)
    },
    // 登录师傅名
    updateMasterName (state, masterName) {
      state.masterName = masterName
      localStorage.setItem('master_name', masterName)
    },
    // 登录师傅id
    updateMasterId (state, masterId) {
      state.masterId = masterId
      localStorage.setItem('master_id', masterId)
    },
    // 登录师傅手机
    updateMasterPhone (state, masterPhone) {
      state.masterPhone = masterPhone
      localStorage.setItem('master_phone', masterPhone)
    },
    // 师傅: 当前处理的订单的id
    updateOrderHandleId (state, orderHandleId) {
      state.orderHandleId = orderHandleId
      localStorage.setItem('order_handle_id', orderHandleId)
    },
    // 师傅: 当前处理的订单的所添加的所有物品
    updateGoodsForOrderArr (state, goodsForOrderArr) {
      state.goodsForOrderArr = goodsForOrderArr
      localStorage.setItem('goods_for_order_arr', goodsForOrderArr)
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
