<template>
  <!-- 订单 用户 -->
  <!-- 已处理/未处理 -->
  <div class="orders">
    <nav-bar></nav-bar>
    <div class="orders-list"  :style="[scrollHeight]">
      <nut-scroller
          :is-loading="isLoading"
          :type="'vertical'"
          @pulldown="pulldown"
      >
        <div slot="list" class="nut-vert-list-panel">
          <div class="orders-list-single" v-for="(item, index) in ordersArr" :key="index">
            <div class="orders-list-single-row">
              <div class="orders-list-single-row-label">
                订单编号：
              </div>
              <div class="orders-list-single-row-val">
                {{item.orderSn}}
              </div>
            </div>
            <div class="table-underline">
            </div>
            <div class="orders-list-single-row">
              <div class="orders-list-single-row-label">
                订单时间：
              </div>
              <div class="orders-list-single-row-val">
                {{item.cTime}}
              </div>
            </div>
            <div class="table-underline">
            </div>
            <div class="orders-list-single-row">
              <div class="orders-list-single-row-label">
                师傅：
              </div>
              <div class="orders-list-single-row-val">
                {{item.masterName}}
              </div>
            </div>
            <div class="table-underline">
            </div>
            <div class="orders-list-single-row">
              <div class="orders-list-single-row-label">
                师傅手机：
              </div>
              <div class="orders-list-single-row-val">
                {{item.masterPhone}}
              </div>
            </div>
            <div class="table-underline">
            </div>
            <div class="orders-list-single-row">
              <div class="orders-list-single-row-price">
                <span class="orders-list-single-row-price-label">应付：</span>
                <span class="orders-list-single-row-price-val">￥{{item.amount}}</span>
              </div>
            </div>
            <div class="orders-list-single-row">
              <div class="orders-list-single-row-handle">
                <nut-button
                  type="actived"
                  shape="circle"
                  small
                  color="red"
                  v-if="item.productIds"
                  @click="toPay(item.orderSn, item.productIds)"
                >
                  付款
                </nut-button>
                <nut-button
                  type="actived"
                  shape="circle"
                  small
                  color="red"
                  @click="toOrderDetail(item.orderSn)"
                >
                  详情
                </nut-button>
              </div>
            </div>
          </div>
        </div>
      </nut-scroller>
    </div>
  </div>
</template>

<style lang="scss">
  .orders{
    padding-top: 50px;
    .table-underline{
      border: 1px solid #EFEFF4;
      margin-top: 2px;
      margin-bottom: 2px;
    }
    &-list{
      padding: 0 10px 0 10px;
      &-single{
        background-color: #fff;
        padding: 10px 10px 10px 10px;
        margin-bottom: 10px;
        border-radius: 5px;
        &-row{
          text-align: left;
          padding-top: 5px;
          padding-bottom: 5px;
          &-label{
            width: 5em;
            text-align: right;
            color: #2187E7;
            padding-bottom: 5px;
            display: inline-block;
          }
          &-val{
            display: inline-block;
          }
          &-price{
            &-label{
              width: 5em;
              text-align: right;
              color: #2187E7;
              display: inline-block;
            }
            &-val{
              color: red;
              display: inline-block;
            }
          }
          &-handle{
            padding-top: 10px;
            text-align: right;
          }
        }
      }
    }
  }
</style>

<script>
import NavBar from '@/components/NavHeader'
// eslint-disable-next-line no-unused-vars
import router from '@/router'
// eslint-disable-next-line no-unused-vars
import {mapGetters, mapActions} from 'vuex'
export default {
  name: 'Orders',
  components: {NavBar},
  data () {
    return {
      // -1：已取消
      // 0：未分配
      // 1：已分配
      // 2：未付款
      // 3：已完成
      ordersArr: [],
      status: 0,
      isLoading: false,
      scrollHeight: {
        height: window.innerHeight - 40 + 'px'
      }
    }
  },

  methods: {
    pulldown () {
      console.log('刷新')
      this.isLoading = true
      clearTimeout(this.timers)
      this.timer = setTimeout(() => {
        this.isLoading = false
        this.ordersArr = new Array(10)
        this.ordersArr = []
        this.getOrders(this.status)
      }, 300)
    },
    getCreateTime (t) {
      if (t) {
        let timer = new Date(t)
        let month = Number(timer.getMonth()) + 1
        return timer.getFullYear() + '-' + month + '-' + timer.getDate() + ' ' + timer.getHours() + ':' + timer.getMinutes()
      } else {
        return ''
      }
    },
    getOrders (status) {
      let that = this
      let req = {
      }
      this.axios.defaults.headers.common['tokenId'] = this.$store.state.userId
      this.axios.post(that.reqAddress + '/hcOrder/' + status, req).then((response) => {
        let resultState = response.data // code,data
        let code = resultState.code
        let resultPage = resultState.data
        if (code === '0') {
          for (let i = 0; i < resultPage.length; i++) {
            resultPage[i].cTime = this.getCreateTime(resultPage[i].createTime)
            resultPage[i].fTime = this.getCreateTime(resultPage[i].finishTime)
          }
          this.ordersArr = resultPage
          if (resultPage.length === 0) {
            // 返回没问题，但数据0条
            this.$store.commit('updateLoadImg', 'loadSuccess')
            this.$store.commit('updateIsLoading', true)
          } else {
            // 返回的数据至少有一条
            this.$store.commit('updateIsLoading', false)
          }
        } else {
          // 返回的code不为0，有问题，显示加载失败动画
          this.$store.commit('updateLoadImg', 'loadFailure')
          this.$store.commit('updateIsLoading', true)
        }
      }).catch((err) => {
        console.log(err.response)
        // 返回的code不为0，有问题，显示加载失败动画
        this.$store.commit('updateLoadImg', 'loadFailure')
        this.$store.commit('updateIsLoading', true)
      })
    },
    // 前往付款页
    toPay (orderSn, productIds) {
      let reproductIds = JSON.parse(productIds)
      let ids = ''
      for (let i = 0; i < reproductIds.length; i++) {
        ids += reproductIds[i].productId
        if (i < reproductIds.length) {
          ids += ','
        }
      }
      window.location.href = this.muiAddress + '/repaircarmuimodule/order_pay.html?orderSn=' + orderSn + '&productIds=' + ids
    },
    // 前往详情页
    toOrderDetail (orderSn) {
      this.$router.push({path: '/OrderDetail', query: {orderSn: orderSn}})
    }
  },
  mounted () {
    this.$store.commit('updateLoadImg', 'loading')
    this.$store.commit('updateIsLoading', true)
    let status = this.$route.query.status
    this.status = status
    this.getOrders(status)
  }
}
</script>
