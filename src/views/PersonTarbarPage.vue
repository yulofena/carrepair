<template>
  <div class="person-tarbar-page">
    <div class="headerImgCard">
      <img class="headerImgCardImage" :src="headImg" v-if="ifHeadImg" />
      <img class="headerImgCardImage" src="../img/nologin.png" style="border-radius: 50%;" v-else />
      <div class="headerImgCardUsername">
        <a :href="muiAddress + '/repaircarmuimodule/setting.html'" target="_blank" v-if="ifLogin">{{userName}}</a>
        <a :href="muiAddress + '/repaircarmuimodule/login.html'" target="_blank" v-else>点击登录</a>
      </div>
    </div>
    <div class="cellContent">
      <nut-cell
         title = "师傅端"
         :showIcon = "true"
         :linkUrl = "vueAddress + '/#/MasterTarbarPage'"
      >
      </nut-cell>
      <nut-cell
         title = "我的呼叫"
         :showIcon = "true"
      >
      </nut-cell>
      <nut-cell
       title = "投诉建议"
       :showIcon = "true"
       :linkUrl = "vueAddress + '/#/Complaint'"
       v-if="ifLogin"
      >
      </nut-cell>
       <!-- 师傅端 -->
      <nut-cell
       title = "未处理订单"
       :linkUrl = "vueAddress + '/#/Orders?status=2'"
       :showIcon = "true"
       v-if="ifLogin"
      >
      </nut-cell>
      <nut-cell
       title = "已处理订单"
       :linkUrl = "vueAddress + '/#/Orders?status=3'"
       :showIcon = "true"
       v-if="ifLogin"
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
  name: 'PersonTarbarPage',
  data () {
    return {
    }
  },
  computed: {
    // 头像
    headImg () {
      let userAvatar = this.$store.state.userAvatar
      return userAvatar
    },
    // 用户名
    userName () {
      return this.$store.state.userName
    },
    // 是否已登录
    ifLogin () {
      let userId = this.$store.state.userId
      if (userId && userId !== '') {
        return true
      } else {
        return false
      }
    },
    // 是否有头像
    ifHeadImg () {
      let userId = this.$store.state.userId
      // 是否已登录
      if (userId && userId !== '') {
        // 已登录
        let userAvatar = this.$store.state.userAvatar
        // 已登录 头像不为空
        if (userAvatar && userAvatar !== '') {
          return true
        } else {
          return false
        }
      } else {
        // 未登录
        return false
      }
    }
  },
  mounted () {
    this.$store.commit('updateIsLoading', false)
    let queryUserId = this.$route.query.userId // 传参穿过来的用户id
    let queryUserName = this.$route.query.userName // 传参穿过来的用户名
    let queryAvatar = this.$route.query.avatar // 传参穿过来的用户头像
    if (queryUserName && queryUserName !== '' && queryUserName !== '退出') {
      // 登录
      this.$store.commit('updateUserId', queryUserId) // 用户id存储本地
      this.$store.commit('updateUserName', queryUserName) // 用户名存储本地
      this.$store.commit('updateUserHeadImg', queryAvatar)
    } else if (queryUserName && queryUserName !== '' && queryUserName === '退出') {
      // 需要退出
      this.$store.commit('updateUserId', '')
      this.$store.commit('updateUserName', '')
      this.$store.commit('updateUserHeadImg', '')
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
 $contentWidth: 99.5%;
.person-tarbar-page{
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
