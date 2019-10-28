import Vue from 'vue'
import Router from 'vue-router'
import NavHeader from '@/components/NavHeader'
import Home from '@/views/Home'
import HomeTarbarPage from '@/views/HomeTarbarPage'
import PersonTarbarPage from '@/views/PersonTarbarPage'
import MasterTarbarPage from '@/views/MasterTarbarPage'
import GoodsList from '@/views/GoodsList'
import GoodsListMaster from '@/views/GoodsListMaster'
import GoodsDetail from '@/views/GoodsDetail'
import LoginMaster from '@/views/LoginMaster'
import Complaint from '@/views/Complaint'
import Orders from '@/views/Orders'
import OrdersMaster from '@/views/OrdersMaster'
import OrderDetailMaster from '@/views/OrderDetailMaster'
import OrderDetail from '@/views/OrderDetail'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    }, {
      path: '/navHeader',
      name: 'NavHeader',
      component: NavHeader
    }, {
      path: '/goodsList',
      name: 'GoodsList',
      component: GoodsList
    }, {
      path: '/goodsListMaster',
      name: 'GoodsListMaster',
      component: GoodsListMaster
    }, {
      path: '/goodsDetail',
      name: 'GoodsDetail',
      component: GoodsDetail
    }, {
      path: '/loginMaster',
      name: 'LoginMaster',
      component: LoginMaster
    }, {
      path: '/masterTarbarPage',
      name: 'MasterTarbarPage',
      component: MasterTarbarPage
    }, {
      path: '/orders',
      name: 'Orders',
      component: Orders
    }, {
      path: '/ordersMaster',
      name: 'OrdersMaster',
      component: OrdersMaster
    }, {
      path: '/complaint',
      name: 'Complaint',
      component: Complaint
    }, {
      path: '/orderDetailMaster',
      name: 'OrderDetailMaster',
      component: OrderDetailMaster
    }, {
      path: '/orderDetail',
      name: 'OrderDetail',
      component: OrderDetail
    }, {
      path: '/home',
      component: Home,
      children: [
        {
          path: 'homeTarbarPage',
          component: HomeTarbarPage
        },
        {
          path: 'personTarbarPage',
          component: PersonTarbarPage
        }
      ]
    }
  ]
})
