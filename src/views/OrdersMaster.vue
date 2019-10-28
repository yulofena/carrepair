<template>
  <!-- 订单 师傅  -->
  <!-- 已处理/未处理 -->
  <div class="orders-master">
    <nav-bar></nav-bar>
    <div class="orders-master-list" :style="[scrollHeight]">
      <nut-scroller
          :is-loading="isLoading"
          :type="'vertical'"
          @pulldown="pulldown"
      >
        <div slot="list" class="nut-vert-list-panel">
          <div class="orders-master-list-single" v-for="(item,index) in ordersArr" :key="index">
            <div class="orders-master-list-single-row">
              <div class="orders-master-list-single-row-label">
                订单编号：
              </div>
              <div class="orders-master-list-single-row-val">
                {{item.orderSn}}
              </div>
            </div>
            <div class="table-underline">
            </div>
            <div class="orders-master-list-single-row">
              <div class="orders-master-list-single-row-label">
                用户：
              </div>
              <div class="orders-master-list-single-row-val">
                {{item.userNickname}}
              </div>
            </div>
            <div class="table-underline">
            </div>
            <div class="orders-master-list-single-row">
              <div class="orders-master-list-single-row-label">
                生成时间：
              </div>
              <div class="orders-master-list-single-row-val">
                {{item.cTime}}
              </div>
            </div>
            <div class="table-underline">
            </div>
            <div class="orders-master-list-single-row">
              <div class="orders-master-list-single-row-label">
                结束时间：
              </div>
              <div class="orders-master-list-single-row-val">
                {{item.fTime}}
              </div>
            </div>
            <div class="table-underline">
            </div>
            <div class="orders-master-list-single-row">
              <div class="orders-master-list-single-row-label">
                用户手机：
              </div>
              <div class="orders-master-list-single-row-val">
                {{item.phone}}
              </div>
            </div>
            <div class="table-underline">
            </div>
            <div class="orders-master-list-single-row">
              <div class="orders-master-list-single-row-price">
                <span class="orders-master-list-single-row-price-label">应付：</span>
                <span class="orders-master-list-single-row-price-val">￥{{item.amount}}</span>
              </div>
              <div class="orders-master-list-single-row-handle">
                <nut-button
                  type="actived"
                  shape="circle"
                  small
                  color="red"
                  v-if="!item.finishTime"
                  @click="addGoodsForOrder(item.orderSn)"
                >
                  添加商品
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
  .orders-master{
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
          padding-top: 8px;
          padding-bottom: 8px;
          &-label{
            width: 5em;
            text-align: right;
            color: #2187E7;
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
  name: 'OrdersMaster',
  components: {NavBar},
  data () {
    return {
      // -1：已取消
      // 0：未分配
      // 1：已分配
      // 2：未付款
      // 3：已完成
      status: 0,
      ordersArr: [],
      ifHandleNewOrder: false,
      isLoading: false,
      scrollHeight: {
        height: window.innerHeight - 40 + 'px'
      }
    }
  },
  methods: {
    // 下拉刷新
    pulldown () {
      console.log('刷新')
      this.isLoading = true
      clearTimeout(this.timers)
      this.timer = setTimeout(() => {
        this.isLoading = false
        this.ordersArr = new Array(10)
        // this.pageNum = 1
        this.ordersArr = []
        this.getOrders()
        // this.count = 10
      }, 300)
    },
    // 时间格式的处理
    getCreateTime (t) {
      if (t) {
        let timer = new Date(t)
        let month = Number(timer.getMonth()) + 1
        return timer.getFullYear() + '-' + month + '-' + timer.getDate() + ' ' + timer.getHours() + ':' + timer.getMinutes()
      } else {
        return ''
      }
    },
    getOrders () {
      let that = this
      let req = {
      }
      this.axios.defaults.headers.common['tokenId'] = this.$store.state.masterId
      let status = Number(this.status)
      this.axios.post(that.reqAddress + '/hcOrder/master/' + status, req).then((response) => {
        let resultState = response.data
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
    addGoodsForOrder: function (orderId) {
      // eslint-disable-next-line no-unreachable
      let orderHandleId = this.$store.state.orderHandleId
      if (orderHandleId === '' || orderHandleId === orderId) {
        this.$store.commit('updateOrderHandleId', orderId)
        this.$router.push({path: '/GoodsListMaster', query: {}})
      } else {
        let that = this
        this.$dialog({
          title: '提示',
          content: '当前有订单未处理完！是否放弃处理新订单',
          closeBtn: true, // 显式右上角关闭按钮
          onOkBtn (event) { // 确定按钮点击事件
            that.$store.commit('updateOrderHandleId', orderId)
            that.$store.commit('updateGoodsForOrderArr', '')
            that.ifHandleNewOrder = true
            this.close() // 关闭对话框
          },
          onCancelBtn (event) { // 取消按钮点击事件，默认行为关闭对话框
          },
          onCloseBtn (event) { // 右上角关闭按钮点击事件
            // alert("closeBtn");
            // return false;  // 阻止默认“关闭对话框”的行为
          },
          closeCallback (target) {
            if (that.ifHandleNewOrder) {
              that.ifHandleNewOrder = false
              that.$router.push({path: '/GoodsListMaster', query: {}})
            }
          }
        })
      }
    },
    // 前往详情页
    toOrderDetail (orderSn) {
      this.$router.push({path: '/OrderDetailMaster', query: {orderSn: orderSn}})
    }
  },
  mounted () {
    this.$store.commit('updateLoadImg', 'loading')
    this.$store.commit('updateIsLoading', true)
    this.status = this.$route.query.status
    this.getOrders()
  }
}
</script>
