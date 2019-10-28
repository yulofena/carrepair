<template>
  <div class="order-detail-master" :style="[scrollHeight]">
    <nav-bar></nav-bar>
    <nut-scroller
        :is-loading="isLoading"
        :type="'vertical'"
        @pulldown="pulldown"
    >
      <div slot="list" class="nut-vert-list-panel">
        <div class="order-sn order-cell">
          <div class="order-label">
            <img src="../img/order.png" alt="">
          </div>
          <div class="order-val">
            {{orderSn}}
          </div>
        </div>
        <div class="people order-cell">
          <div class="order-label">
            <img src="../img/people.png" alt="">
          </div>
          <div class="order-val">
            {{userNickname}}
          </div>
        </div>
        <div class="cellphone order-cell">
          <div class="order-label">
            <img src="../img/phone.png" />
          </div>
          <div class="order-val">
            {{phone}}
          </div>
        </div>
        <div class="gps-address order-cell">
          <div class="order-label">
            <img src="../img/post.png" alt="">
          </div>
          <div class="order-val">
            {{gpsAddress}}
          </div>
        </div>
        <div class="detail-address order-cell">
          <div class="order-label">
            <img src="../img/detail-post.png" alt="">
          </div>
          <div class="order-val">
            {{address}}
          </div>
        </div>
        <div class="problem order-cell">
          <div class="order-label">
            <img src="../img/problem.png" alt="">
          </div>
          <div class="order-val">
            {{problemDetail}}
          </div>
        </div>
        <div class="detail-images order-cell">
          <div class="order-label">
            <img src="../img/images-class.png" alt="">
          </div>
          <div class="order-val">
            <nut-row>
                <nut-col :span="8" class="sy-images-col" v-for="(item, index) in images" :key="index">
                    <div class="flex-content" :style="[imagesHeight]" >
                      <img :src="item" @click="seeImage(item)">
                    </div>
                </nut-col>
            </nut-row>
          </div>
          <div class="detail-images-big" v-show="ifImgBig" @click="closeImage()">

          </div>
          <img class="detail-images-big-img" v-show="ifImgBig" :src="bigImgUrl" alt="" @click="closeImage()">
        </div>
        <div class="money order-cell">
          <div class="order-label">
            <img src="../img/money.png" alt="">
          </div>
          <div class="order-val">
            <div class="labour">
              <div class="label">
                人工费
              </div>
              <div class="val">
                ￥{{labour}}
              </div>
            </div>
            <div class="amount">
              <div class="label">
                合计
              </div>
              <div class="val">
                ￥{{amount}}
              </div>
            </div>
          </div>
        </div>
        <div class="time order-cell">
          <div class="order-label">
            <img src="../img/clock.png" alt="">
          </div>
          <div class="order-val">
            <div class="action">
              <div class="label">
                开始时间
              </div>
              <div class="val">
                {{createTime}}
              </div>
            </div>
            <div class="finish">
              <div class="label">
                结束时间
              </div>
              <div class="val">
                {{finishTime}}
              </div>
            </div>
          </div>
        </div>

      </div>
    </nut-scroller>

  </div>
</template>

<script>
import NavBar from '@/components/NavHeader'
// eslint-disable-next-line no-unused-vars
import router from '@/router'
// eslint-disable-next-line no-unused-vars
import {mapGetters, mapActions} from 'vuex'
export default {
  name: 'OrderDetailMaster',
  components: {NavBar},
  data () {
    return {
      userNickname: '', // 用户昵称
      problemDetail: '', // 问题详情
      gpsAddress: '', // gps定位地址
      address: '', // 地址
      images: [], // 图片
      phone: '', // 手机号
      labour: '', // 人工费
      amount: '', // 总金额
      productIds: '', // 商品id
      createTime: '', // 创建时间
      finishTime: '', // 结束时间
      orderSn: '',
      ifImgBig: false,
      bigImgUrl: '#',
      isLoading: false,
      scrollHeight: {
        height: window.innerHeight - 60 + 'px'
      },
      imagesHeight: {
        height: (window.innerWidth - 100) / 3 + 'px'
      }
    }
  },
  methods: {
    // 放大图片
    seeImage (url) {
      if (this.ifImgBig === false) {
        this.bigImgUrl = url
        this.ifImgBig = true
      }
    },
    // 关闭放大的图片
    closeImage () {
      if (this.ifImgBig === true) {
        this.ifImgBig = false
      }
    },
    pulldown () {
      console.log('刷新')
      this.isLoading = true
      clearTimeout(this.timers)
      this.timer = setTimeout(() => {
        this.isLoading = false
        this.getOrderDetail()
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
    // 获取订单详情
    getOrderDetail () {
      let that = this
      let req = {
        orderSn: this.orderSn
      }
      this.axios.defaults.headers.common['tokenId'] = this.$store.state.masterId
      this.axios.post(that.reqAddress + '/hcOrder/masterDetail', req).then((response) => {
        let resultState = response.data
        let code = resultState.code
        let resultPage = resultState.data
        if (code === '0') {
          let order = resultPage.order
          this.userNickname = order.userNickname // 用户昵称
          this.problemDetail = order.problemDetail // 问题详情
          this.gpsAddress = order.gpsAddress // gps定位地址
          this.address = order.address // 地址
          this.phone = order.phone // 手机号
          this.labour = order.labour // 人工费
          this.amount = order.amount // 总金额
          this.productIds = order.productIds // 商品id
          this.images = order.images.split(',') // 图片
          this.createTime = this.getCreateTime(order.createTime)
          this.finishTime = this.getCreateTime(order.finishTime)
          this.$store.commit('updateIsLoading', false)
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
    }
  },
  computed: {
  },
  mounted () {
    this.$store.commit('updateLoadImg', 'loading')
    this.$store.commit('updateIsLoading', true)
    this.orderSn = this.$route.query.orderSn
    this.getOrderDetail()
  }

}
</script>

<style lang="scss">
.order-detail-master{
  padding-top: 50px;
  padding-left: 10px;
  padding-right: 10px;
  .order{
    &-cell{
      padding: 10px 10px 10px 50px;
      margin-bottom: 10px;
      border-radius: 8px;
      background-color: #fff;
      position: relative;
    }
    &-label{
      width: 30px;
      height: 30px;
      position: absolute;
      top: 10px;
      left: 10px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    &-val{
      text-align: left;
    }
    &-sn{
      height: 30px;
      .order-label{
        width: 30px;
        height: 30px;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .order-val{
        line-height: 2;
      }
    }
  }
  .people{
    height: 30px;
    .order-label{
      width: 30px;
      height: 30px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .order-val{
      line-height: 2;
    }
  }
  .cellphone{
    height: 30px;
    .order-label{
      width: 30px;
      height: 30px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .order-val{
      line-height: 2;
    }
  }
  .gps-address{
    min-height: 30px;
    .order-label{

    }
    .order-val{

    }
  }
  .detail-address{
    min-height: 30px;
    .order-label{

    }
    .order-val{

    }
  }
  .problem{
    min-height: 30px;
    .order-label{

    }
    .order-val{

    }
  }
  .detail-images{
    min-height: 30px;
    padding-top: 50px;
    padding-left: 10px;
    .order-label{

    }
    .order-val{
      .nut-col{
        padding: 10px 10px 10px 10px;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
    &-big{
      position: fixed;
      z-index: 1003;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: grey;
      opacity: 0.5;
      &-img{
        width: 100%;
        height: 500px;
        position: fixed;
        top: 100px;
        bottom: 50px;
        left: 0;
        right: 0;
        opacity: 1;
        z-index: 1004;
      }
    }
  }
  .money{
    min-height: 30px;
    padding-top: 50px;
    padding-left: 10px;
    .order-label{
    }
    .order-val{
      padding-left: 10px;
      .label{
        width: 4em;
        text-align: right;
        display: inline-block;
        color: $mainStyleColor;
      }
      .val{
        display: inline-block;
        padding-left: 20px;
        line-height: 1.5;
      }
    }
  }
  .time{
    min-height: 30px;
    padding-top: 50px;
    padding-left: 10px;
    .order-label{
    }
    .order-val{
      padding-left: 10px;
      .label{
        width: 4em;
        text-align: right;
        display: inline-block;
        color: $mainStyleColor;
      }
      .val{
        display: inline-block;
        padding-left: 20px;
        line-height: 1.5;
      }
    }
  }

}
</style>
