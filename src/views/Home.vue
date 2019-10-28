<template>
  <div class="home">
    <router-view class="tabbar-view"></router-view>
    <div class="nut-tabbar my-tabbar bottom">
      <router-link class="tabbar-nav" :class="{curr: $route.path === '/home/HomeTarbarPage'}" to="/home/HomeTarbarPage">
        <span class="icon-box">
          <div class="icon" :class="{tabbarHomePageBefore: $route.path !== '/home/HomeTarbarPage',tabbarHomePageActive: $route.path === '/home/HomeTarbarPage'}">
          </div>
          <span class="tabbar-nav-word">
            首页
          </span>
        </span>
      </router-link>
      <router-link class="tabbar-nav" :class="{curr: $route.path === '/GoodsList?pageName=secondHand'}" :to="{path:'/GoodsList',query:{pageName: 'secondHand'}}">
        <span class="icon-box">
          <div class="icon" :class="{tabbarSecondHandCarPageBefore: $route.path !== '/GoodsList?pageName=secondHand',tabbarSecondHandCarPageActive: $route.path === '/GoodsList?pageName=secondHand'}">
          </div>
          <span class="tabbar-nav-word">
            二手车
          </span>
        </span>
      </router-link>
      <router-link class="tabbar-nav" :class="{curr: $route.path === '/home/PersonTarbarPage'}" to="/home/PersonTarbarPage">
        <span class="icon-box">
          <div class="icon"
          :class="{tabbarPersonPageBefore: $route.path !== '/home/PersonTarbarPage',tabbarPersonPageActive: $route.path === '/home/PersonTarbarPage'}"
          >
          </div>
          <span class="tabbar-nav-word">
            我的
          </span>
        </span>
      </router-link>
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
  name: 'Home',
  components: {NavBar},
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
  .tabbar{
    /*首页*/
    &HomePageBefore{
      background-image: url('http://img13.360buyimg.com/uba/jfs/t1/29316/38/1115/3203/5c0f3d61E35d0c7da/9e557f2cb5c9dab6.jpg');
    }
    &HomePageActive{
      background-image: url('http://img20.360buyimg.com/uba/jfs/t1/9996/36/8646/4833/5c0f3d61E7c1b7e0f/c98ad61124172e93.jpg');
    }
    /*二手车*/
    &SecondHandCarPageBefore{
      background-image: url('http://img12.360buyimg.com/uba/jfs/t1/25443/23/1062/4600/5c0f3d61E2e9f1360/c9b3421fe18614e2.jpg');
    }
    &SecondHandCarPageActive{
      background-image: url('http://img20.360buyimg.com/uba/jfs/t1/19241/12/1048/8309/5c0f3d61E17ed5a56/c3af0964cade47f8.jpg');
    }
    /*个人页*/
    &PersonPageBefore{
      background-image: url('http://img20.360buyimg.com/uba/jfs/t1/20004/20/1045/3620/5c0f3d61Eaaec1670/9e59db63983b7b9f.jpg');
    }
    &PersonPageActive{
      background-image: url('http://img14.360buyimg.com/uba/jfs/t1/23967/14/1072/6714/5c0f3d61E0ad8991e/8f741953f6e38f15.jpg');
    }

    &-view{

    }
  }
  .home{
    .nut-tabbar{
      border-top: 1px solid #eee;
    }
  }
</style>
