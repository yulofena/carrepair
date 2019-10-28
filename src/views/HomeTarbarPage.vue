<template>
  <div class="home-tarbar-page">
    <nav-bar></nav-bar>
    <nut-noticebar
      color="#d37d42"
      text="华为畅享9新品即将上市，活动期间0元预约可参与抽奖，赢HUAWEI WATCH等好礼，更多产品信息请持续关注！"
    >
    </nut-noticebar>
    <nut-swiper
        direction="horizontal"
        ref="demo3"
        :loop="true"
        :canDragging="false"
        :paginationVisible="true"

    >
        <div  class="nut-swiper-slide gray" >
            <span>
              <img class="nut-swiper-img" src="../img/swipe01.jpg" />
            </span>
        </div>
        <div  class="nut-swiper-slide gray_1" >
            <span>
              <img class="nut-swiper-img" src="../img/swipe02.jpg" />
            </span>
        </div>
    </nut-swiper>
    <div class="func">
      <div class="func-title">
        招牌服务
      </div>
      <nut-row>
          <nut-col :span="12">
            <router-link to='/GoodsList'>
              <div class="flex-content">
                <img src="../img/lingjian.png" alt="">
                <span>零件报价</span>
              </div>
            </router-link>
          </nut-col>
          <nut-col :span="12">
            <div class="flex-content flex-content-light" @click="toRepair()">
              <img src="../img/weixiu.png" style="border-radius: 50%;" alt="">
              <span>一键抢修</span>
            </div>
          </nut-col>
      </nut-row>
      <nut-row>
          <nut-col :span="12">
            <router-link to="/GoodsList">
              <div class="flex-content">
                <img src="../img/dianchi.png" alt="">
                <span>电池报价</span>
              </div>
            </router-link>
          </nut-col>
          <nut-col :span="12">
              <div class="flex-content flex-content-light">
                <img src="../img/motobike.png" alt="">
                <span>二手车收购</span>
              </div>
          </nut-col>
      </nut-row>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavHeader'
// eslint-disable-next-line no-unused-vars
import router from '@/router'
// eslint-disable-next-line no-unused-vars
import {mapGetters, mapActions} from 'vuex'
export default {
  name: 'HomeTarbarPage',
  components: {NavBar},
  mounted () {
    this.$store.commit('updateIsLoading', false)
  },
  methods: {
    toRepair () {
      let userId = this.$store.state.userId
      if (!userId || userId === '') {
        this.$toast.fail('您尚未登录', {
          duration: 2000, // 展示时长
          center: true, // 是否居中展示，值为false时展示在页面底部
          bottom: 40, // 展示在页面底部时，距底部的距离（px)
          textAlignCenter: true
        })
      } else {
        let repairPage = this.muiAddress + '/repaircarmuimodule/repair.html'
        window.location.href = repairPage
      }
    }
  }
}
</script>

<style lang="scss">
.home-tarbar-page{
  $mainColor: #ED7961;
  padding-top: 40px;
  padding-bottom: 70px;
  .nut{
    &-swiper{
      span{
        width: 100%;
        height: 100%;
      }
      &-img{
        width: 100%;
        height: 100%;
      }
    }
  }
  .func{
    width: 95%;
    height: 18rem;
    margin: 2rem auto;
    border: 1px solid #F9F9F9;
    background-color: #fff;
    overflow: hidden;
    border-radius: 10px;
    &-title{
      height: 2rem;
      text-align: left;
      color: grey;
      padding: 10px 0 0 10px;
    }
    .nut{
      &-row{}
      &-col{
        border: 1px solid #F9F9F9;
        height: 8rem;
        a{
          color: #000;
        }
        .flex-content{
          img{
            width: 3rem;
            height: 3rem;
            display: block;
            margin: 1rem auto 1rem auto;
          }
          span{}
        }
      }
    }
  }
}
</style>
