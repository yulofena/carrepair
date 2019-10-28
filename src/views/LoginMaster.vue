<template>
  <div class="login-master">
    <nav-bar></nav-bar>
    <div class="login-input">
      <nut-textinput
        v-model="masterAccount"
        label="账号"
        placeholder="请输入账号"
        :clearBtn="true"
        :disabled="false"
      />
      <nut-textinput
        placeholder="请输入密码"
        v-model="masterPassword"
        label="密码"
        type="password"
      />
    </div>
    <div class="login-btn">
      <nut-button
        block
        @click="loginSubmit"
      >
        登录
      </nut-button>
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
  name: 'LoginMaster',
  components: {NavBar},
  data () {
    return {
      masterAccount: '',
      masterPassword: ''
    }
  },
  methods: {
    loginSuccess () {
      this.$router.push({path: '/MasterTarbarPage', query: {}})
    },
    loginSubmit () {
      let masterAccount = this.masterAccount
      let masterPassword = this.masterPassword
      let that = this
      let req = {
        phone: masterAccount, // string true 普通参数 手机号
        pwd: masterPassword // string true 普通参数 密码
      }
      // this.axios.defaults.headers.common['tokenId'] = this.$store.state.userId
      this.axios.post(that.reqAddress + '/hcMaster/login', req).then((response) => {
        let resultState = response.data // code,data
        let code = resultState.code
        if (code === '0') {
          let resultPage = resultState.data
          let masterId = resultPage.masterId // 师傅id
          let masterName = resultPage.name // 师傅名
          let masterPhone = resultPage.phone // 师傅手机
          that.$store.commit('updateMasterId', masterId) // 师傅id存储本地
          that.$store.commit('updateMasterName', masterName) // 师傅名存储本地
          that.$store.commit('updateMasterPhone', masterPhone) // 师傅手机存储本地
          that.$toast.success('登录成功！', {
            duration: 2000, // 展示时长
            center: true, // 是否居中展示，值为false时展示在页面底部
            bottom: 40, // 展示在页面底部时，距底部的距离（px)
            textAlignCenter: true, // 多行文本是否居中展示，值为false时单行居中，多行居左
            onClose: that.loginSuccess
          })
        } else {
          that.$toast.fail(response.data.message, {
            duration: 2000, // 展示时长
            center: true, // 是否居中展示，值为false时展示在页面底部
            bottom: 40, // 展示在页面底部时，距底部的距离（px)
            textAlignCenter: true // 多行文本是否居中展示，值为false时单行居中，多行居左
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .login-master{
    padding-top: 50px;
    .login-input{
      padding-left: 10px;
      padding-right: 10px;
      .nut{
        &-textinput{
          padding-bottom: 10px;
          &-label{
            width: 20%;
            text-align: right;
            padding-right: 10px;
            font-weight: bold;
            font-size: 18px;
            letter-spacing: 0.5em;
          }
        }
      }
    }
    .login-btn{
      padding-left: 10px;
      padding-right: 10px;
      .nut-button{
        span{
          font-size: 16px;
          letter-spacing: 1em;
        }
      }
    }
  }
</style>
