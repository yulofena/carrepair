<template>
  <div class="master-tarbar-page">
    <div class="headerImgCard">
      <img class="headerImgCardImage" src="../../dist/static/img/weixiu.3792419.png" />
      <div class="headerImgCardUsername">
        <a href="#" target="_blank" v-if="ifLogin">{{masterName}}</a>
        <router-link to="/LoginMaster" v-else>点击登录</router-link>
      </div>
    </div>
    <div class="cellContent">
      <!-- 师傅端 -->
      <nut-cell
        title = "商品"
        :isLink = "true"
        :linkUrl = "vueAddress + '/#/GoodsListMaster'"
        :showIcon = "true"
      >
      </nut-cell>
      <nut-cell
        title = "已分配订单"
        :isLink = "true"
        :linkUrl = "vueAddress + '/#/OrdersMaster?status=1'"
        :showIcon = "true"
        v-if="ifLogin"
      >
      </nut-cell>
      <nut-cell
        title = "未付款订单"
        :isLink = "true"
        :linkUrl = "vueAddress + '/#/OrdersMaster?status=2'"
        :showIcon = "true"
        v-if="ifLogin"
      >
      </nut-cell>
      <nut-cell
        title = "已付款订单"
        :isLink = "true"
        :linkUrl = "vueAddress + '/#/OrdersMaster?status=3'"
        :showIcon = "true"
        v-if="ifLogin"
      >
      </nut-cell>
      <nut-cell
        title = "用户页"
        :isLink = "true"
        :linkUrl = "vueAddress + '/#/home/PersonTarbarPage'"
        :showIcon = "true"
      >
      </nut-cell>
      <nut-cell
        title = "登录"
        :isLink = "true"
        :linkUrl = "vueAddress + '/#/LoginMaster'"
        :showIcon = "true"
      >
      </nut-cell>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import router from '@/router'
// eslint-disable-next-line no-unused-vars
import {mapGetters, mapActions} from 'vuex'
export default {
  name: 'MasterTarbarPage',
  data () {
    return {
    }
  },
  computed: {
    // 师傅名
    masterName () {
      return this.$store.state.masterName
    },
    // 是否已登录
    ifLogin () {
      let masterId = this.$store.state.masterId
      if (masterId && masterId !== '') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
  },
  mounted () {
    this.$store.commit('updateIsLoading', false)
  }
}
</script>

<style lang="scss">
 $contentWidth: 99.5%;
.master-tarbar-page{
  padding-bottom: 100px;
  .headerImgCard{
    width: $contentWidth;
    height: 12rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    background: linear-gradient(to bottom, $mainStyleColor, #fff);
    &Image{
      width: 7rem;
      height: 7rem;
      margin: 0.8rem auto;
      border-radius: 50%;
      display: block;
    }
    &Username{
      display: inline-block;
      margin: 0.8rem auto;
      a{
        font-size: 20px;
        color: #000;
        font-weight: bold;
      }
    }
  }
  .cellContent{
    margin-top: 1rem;
    .nut-cell-title{
      text-align: left;
    }
  }
}
</style>
