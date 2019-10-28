<template>
  <div class="complaint">
    <nav-bar></nav-bar>
    <div class="sy-contact">
     <nut-textinput
        v-model="cellphone"
        label="联系方式："
        placeholder="请输入手机"
        :clearBtn="true"
        :disabled="false"
      />
    </div>

    <div class="sy-content">
      <div class="sy-content-label">
        投诉建议：
      </div>
      <textarea name="content" id="content" v-model="content" cols="30" rows="10" placeholder="请留下您的投诉建议"></textarea>
    </div>
    <div class="sy-btn">
      <nut-button
        block
        @click="submitComplaint"
      >
      提交
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
  name: 'complaint',
  components: {NavBar},
  mounted () {
    this.$store.commit('updateIsLoading', false)
    let userId = this.$store.state.userId
    if (!userId || userId === '') {
      let that = this
      this.$toast.fail('您尚未登录', {
        duration: 2000, // 展示时长
        center: true, // 是否居中展示，值为false时展示在页面底部
        bottom: 40, // 展示在页面底部时，距底部的距离（px)
        textAlignCenter: true, // 多行文本是否居中展示，值为false时单行居中，多行居左
        onClose: function () {
          let userLoginPage = that.muiAddress + '/repaircarmuimodule/login.html'
          window.location.href = userLoginPage
        }
      })
    }
  },
  data () {
    return {
      cellphone: '',
      content: ''
    }
  },
  methods: {
    toBack () {
      this.$router.push({path: '/home/PersonTarbarPage', query: {}})
    },
    matchValues () {
      if (!(/^1[3456789]\d{9}$/.test(this.cellphone))) {
        this.$toast.fail('手机号码有误!', {
          duration: 2000, // 展示时长
          center: true, // 是否居中展示，值为false时展示在页面底部
          bottom: 40, // 展示在页面底部时，距底部的距离（px)
          textAlignCenter: true // 多行文本是否居中展示，值为false时单行居中，多行居左
        })
        return false
      }
      return true
    },
    submitComplaint () {
      if (!(/^1[3456789]\d{9}$/.test(this.cellphone))) {
        this.$toast.fail('手机号码有误!', {
          duration: 2000, // 展示时长
          center: true, // 是否居中展示，值为false时展示在页面底部
          bottom: 40, // 展示在页面底部时，距底部的距离（px)
          textAlignCenter: true // 多行文本是否居中展示，值为false时单行居中，多行居左
        })
      } else {
        let that = this
        let req = {
          content: this.content,
          contact: this.cellphone
        }
        this.axios.post(that.reqAddress + '/hcComplaint/create', req).then((response) => {
          let result = response.data
          let code = result.code
          if (code === '0') {
            this.$toast.success(result.message, {
              duration: 2000, // 展示时长
              center: true, // 是否居中展示，值为false时展示在页面底部
              bottom: 40, // 展示在页面底部时，距底部的距离（px)
              textAlignCenter: true, // 多行文本是否居中展示，值为false时单行居中，多行居左
              onClose: this.toBack
            })
          } else {
            this.$toast.fail(result.message, {
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
}
</script>

<style lang="scss">
  .complaint{
    // width: 100%;
    padding-top: 55px;
    .sy{
      &-contact{
        width: 90%;
        padding: 0 10px 20px 10px;
        margin: 0 auto;
      }
      &-content{
        margin: 0 auto;
        width: 90%;
        // padding: 0 10px 0 10px;
        &-label{
          text-align: left;
          padding: 0 0 10px 0;
        }
        textarea{
          width: 98%;
          -webkit-box-flex: 1;
          flex: 1 1 0%;
          -webkit-appearance: none;
          font-size: 14px;
          box-sizing: border-box;
          border-radius: 4px;
          border: 1px solid rgb(221, 223, 230);
          padding: 10px 30px 0px 10px;
          margin: 0px;
        }
      }
      &-btn{
        width: 90%;
        padding: 20px 10px 20px 10px;
        margin: 0 auto;
      }
    }
  }
</style>
