<template>
  <div class="nav-header">
    <nut-navbar
      @on-click-back="back"
      @on-click-title="title"
      @on-click-more="more"
      :rightShow="false"
    >
    {{titleText}}
      <a slot="back-icon" v-show="ifShowBack">返回</a>
    </nut-navbar>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import router from '@/router'
// eslint-disable-next-line no-unused-vars
import {mapGetters, mapActions} from 'vuex'
export default {
  name: 'NavHeader',
  computed: {
    ifShowBack () {
      let rouArr = ['/home/HomeTarbarPage', '/loginMaster']
      for (let i = 0; i < rouArr.length; i++) {
        if (this.$route.path === rouArr[i]) {
          return false
        }
      }
      return true
    },
    titleText () {
      if (this.$route.path === '/PartQuotation') {
        return '零件报价'
      } else if (this.$route.path === '/BatteryQuote') {
        return '电池报价'
      } else if (this.$route.path === '/loginMaster') {
        return '登录'
      } else if (this.$route.path === '/Complaint') {
        return '投诉'
      } else if (this.$route.path === '/Orders') {
        let status = this.$route.query.status
        let ordersType = ''
        if (status === '2') {
          // 未处理订单
          ordersType = '未处理订单'
        } else if (status === '3') {
          // 已处理订单
          ordersType = '已处理订单'
        } else {
          ordersType = '订单'
        }
        return ordersType
      } else if (this.$route.path === '/OrdersMaster') {
        let status = this.$route.query.status
        let ordersType = ''
        if (status === '1') {
          // 未处理订单
          ordersType = '已分配订单'
        } else if (status === '2') {
          // 已处理订单
          ordersType = '未付款订单'
        } else if (status === '3') {
          // 已处理订单
          ordersType = '已付款订单'
        } else {
          ordersType = '订单'
        }
        return ordersType
      } else {
        return '修车行'
      }
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    title () {
      // alert('header头部， 点击title')
    },
    more () {
      // alert('header头部， 点击更多')
    }
  }
}
</script>

<style lang="scss">
  .nut-navbar{
    background-color: $mainStyleColor;
  }
  .nav{
    &-header{
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1002;
      color: $navFontColor;
    }
    &-left{}
    &-center{
      background-color: $mainStyleColor;
    }
    &-right{}
    &-title{
      letter-spacing: 0.5em;
    }
  }
</style>
