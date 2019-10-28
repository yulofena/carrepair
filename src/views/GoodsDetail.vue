<template>
  <div class="goods-detail">
    <!-- 导航 -->
    <!-- 轮播 -->
    <div
      class="header-fixed nut-navbar"
      v-show="showAbs"
      :style="opacityStyle"
    >
      <div class="nav-left">
        <div class="back" @click="backLastRoute">
          返回
        </div>
      </div>
      <div class="nav-center">
        <h3 class="nav-title">
        </h3>
      </div>
      <div class="nav-right" style="display: none;">
        <div class="more">
          <i class="more-icon"></i>
        </div>
      </div>
    </div>
    <nut-swiper
        direction="horizontal"
        ref="demo3"

        :paginationVisible="false"
    >
        <div v-for="(item,index) in atlas" :key="index" :class="item.className">
            <span>
              <img class="nut-swiper-img" :src="item.url" />
            </span>
        </div>
    </nut-swiper>
    <div class="easy-introduce" id="introduce">
      <div class="price">
        <span class="nowPrice">
          <nut-price
              :price="price"
              :needSymbol="true"
              :thousands="false"
          />
        </span>
        <span class="oldPrice">
          原价:
          <nut-price
              :price="originalPrice"
              :needSymbol="true"
              :thousands="false"
          />
        </span>
      </div>
      <div class="name">
        {{name}}{{productId}}
      </div>
    </div>
    <a class="link-detail-info nut-cell" @click.prevent="custormAnchor('detail-info')" >
      <div class="nut-cell-box">
        <div class="nut-cell-left">
          <span class="nut-cell-title">
            规格,品牌...
          </span>
          <span class="nut-cell-sub-title">
          </span>
        </div>
        <div class="nut-cell-right">
          <span class="nut-cell-desc">
          </span>
          <span class="nut-cell-icon">
            <img src="data:image/svg+xml,%3Csvg viewBox='0 0 5 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.215 9.757l3.577-4.17a.931.931 0 0 0 0-1.173L1.215.244a.642.642 0 0 0-1.007 0 .929.929 0 0 0 0 1.172L3.283 5 .208 8.584a.93.93 0 0 0 0 1.173.643.643 0 0 0 1.007 0z' fill='rgb(200,200,205)'/%3E%3C/svg%3E" alt="">
          </span>
        </div>
      </div>
    </a>
    <div class="detail-introduce">
      <div class="detail-introduce-title">
        <div class="small-tab"></div>
        <span>商品详情</span>
      </div>
      <div class="table-underline detail-introduce-underline">
      </div>
      <div class="detail-introduce-images" v-html="details">
        {{details}}
      </div>
    </div>
    <div class="detail-info" id="detail-info">
      <div class="detail-info-title">
        <div class="small-tab"></div>
        <span>规格</span>
      </div>
      <div class="table-underline">
      </div>
      <div class="detail-info-table">
        <table>
          <tr v-for="(parameterItem,index) in parameter" :key="index">
            <td class="detail-info-table-label">
              {{parameterItem.paramName}}
            </td>
            <td class="detail-info-table-val">
              {{parameterItem.paramValue}}
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="sy-handle" v-show="false">
      <div class="sy-handle-num">
        <nut-stepper
          :value="0"
          :min="0"
          :max="100"
        ></nut-stepper>
      </div>
      <div class="sy-handle-btn">
        <nut-button
          small
          v-show="ifMaster"
        >
          购买
        </nut-button>
        <nut-button
          small
          v-show="!ifMaster"
          disabled
        >
          购买
        </nut-button>
      </div>
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
  name: 'PersonTarbarPage',
  components: {NavBar},
  data () {
    return {
      showAbs: true,
      opacityStyle: {
        opacity: 1
      },
      winhei: 0,
      ifMaster: false,
      // 商品的信息
      productId: '', // 商品id
      categoryId: '', // 分类id
      name: '', // 产品名称
      price: '', // 价格
      originalPrice: '', // 原价
      details: '', // 商品详情
      cover: '', // 封面
      atlas: '', // 图册（逗号隔开）
      parameter: [], // 商品参数
      // createTime: ,//
      categoryName: '', // 分类id
      brandName: '', // 品牌名字
      brandId: '', // 品牌id
      pageName: ''
      // 商品信息 end
    }
  },
  methods: {
    backLastRoute () {
      this.$router.go(-1)
    },
    custormAnchor (anchorName) {
      // 找到锚点
      let anchorElement = document.getElementById(anchorName)
      // 如果对应id的锚点存在，就跳转到锚点
      if (anchorElement) {
        anchorElement.scrollIntoView()
      }
    },
    getGoodsDetail () {
      let that = this
      let req = {
        productId: this.productId
      }
      this.axios.post(that.reqAddress + '/hcProduct/detail/' + that.productId, req).then((response) => {
        let resultState = response.data // code,data
        let code = resultState.code
        let resultData = resultState.data
        if (code === '0') {
          // 商品的信息
          this.productId = resultData.productId // 商品id
          this.categoryId = resultData.categoryId // 分类id
          this.name = resultData.name // 产品名称
          this.price = resultData.price // 价格
          this.originalPrice = resultData.originalPrice // 原价
          this.details = resultData.details // 商品详情
          this.cover = resultData.cover // 封面
          var atlas = resultData.atlas.split(',') // 图册（逗号隔开）
          let atlasArr = []
          for (let j = 0; j < atlas.length; j++) {
            let className = ''
            if (j === 0) {
              className = 'nut-swiper-slide nut-swiper-slide-selected'
            } else {
              className = 'nut-swiper-slide'
            }
            let obj = {
              url: atlas[j],
              className: className
            }
            atlasArr.push(obj)
          }
          this.atlas = atlasArr
          this.parameter = JSON.parse(resultData.parameter) // reparameter 商品参数
          this.categoryName = resultData.categoryName // 分类id
          this.brandName = resultData.brandName // 品牌名字
          this.brandId = resultData.brandId // 品牌id
          this.$store.commit('updateIsLoading', false)
          // 商品信息 end
        } else {
          // 返回的code不为0，有问题，显示加载失败动画
          this.$store.commit('updateLoadImg', 'loadFailure')
        }
      }).catch((err) => {
        console.log(err.response)
        // 返回的code不为0，有问题，显示加载失败动画
        this.$store.commit('updateLoadImg', 'loadFailure')
      })
    }
  },
  mounted () {
    this.$store.commit('updateLoadImg', 'loading')
    this.$store.commit('updateIsLoading', true)
    this.identity = this.$route.query.identity // 传过来的页面参数
    this.pageName = this.$route.query.pageName // 传过来的页面参数
    if (this.identity === 'master') {
      this.ifMaster = true
    }
    this.productId = this.$route.query.productId // 传过来的页面参数
    this.getGoodsDetail()
    setTimeout(() => {
      this.$refs.demo3.updateEvent(1)
    }, 300)
  }
}
</script>

<style lang="scss">
  .goods-detail{
    padding-top: 52px;
    padding-bottom: 80px;
    .table-underline{
      border: 1px solid #EFEFF4;
      margin-top: 2px;
      margin-bottom: 2px;
    }
    .small-tab{
      width: 5px;
      height: 20px;
      border-radius: 5px;
      background-color: #ED7961;
      display: inline-block;
      vertical-align: middle;
    }
    .nut{
     &-navbar{
        color: #fff;
        a{
          color: #fff;
        }
        .nav-left{
          position: absolute;
          left: 15px;
          top: 50%;
          height: 40px;
          line-height: 40px;
          margin-top: -20px;
          font-size: 14px;
        }
     }
      &-swiper{
        height: 300px;
        span{
          width: 100%;
          height: 100%;
        }
        &-img{
          width: 100%;
          height: 100%;
        }
      }
      &-tab{
        padding: 0;
        &-title{
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1002;
          right: 0;
        }
        &-item{
          height: 100%;
          padding: 51px 0 51px 0;
          border: 1px solid #EFEFF4;
          background-color: #EFEFF4;
        }
        &-panel{
          background-color: #EFEFF4;
        }
      }
    }
    .header-abs{
      position: absolute;
      left: .2rem;
      top: .2rem;
      width: .8rem;
      height: .8rem;
      line-height: .8rem;
      border-radius: .4rem;
      text-align: center;
      background: rgba(0, 0, 0, .8);
    }
    .header-fixed{
      z-index: 1003;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 52px;
      background-color: #ED7961;
    }
    .easy-introduce{
      width: 100%;
      padding-bottom: 10px;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      background-color: #fff;
      .price{
        text-align: left;
        padding: 20px 0 10px 20px;
        .nowPrice{
          color: red;
          .price-symbol{
            font-size: 22px;
          }
          .price-big{
            font-size: 25px;
            font-weight: bold;
          }
          .price-point{
            font-size: 22px;
          }
          .price-small{
            font-size: 22px;
          }
        }
        .oldPrice{
          margin-left: 10px;
          text-decoration: line-through;
        }
      }
      .name{
        padding: 0 20px 10px 20px;
        text-align: left;
        font-size: 25px;
        font-weight: bold;
      }
    }
    .link-detail-info{
      margin: 10px 0 10px 0;
      background-color: #fff;
      .nut-cell-left{
        text-align: left;
      }
    }
    .detail-introduce{
      background-color: #fff;
      margin: 8px 0;
      &-underline{
        margin-left: 10px;
        margin-right: 10px;
      }
      &-title{
        text-align: left;
        font-size: 20px;
        padding: 10px 0 10px 10px;
        span{
          vertical-align: middle;
        }
      }
      &-images{
        min-height: 200px;
        padding: 0 10px 10px 10px;
        img{
          width: 100%;
          height: 300px;
          border-radius: 6px;
          margin-top: 10px;
        }
      }
    }
    .detail-info{
      margin: 8px 0 0 0;
      border-radius: 8px;
      padding: 10px 10px 10px 10px;
      background-color: #fff;
      &-title{
        text-align: left;
        font-size: 20px;
        padding: 5px 0 5px 0;
        span{
          vertical-align: middle;
        }
      }
      &-table{
        // border: 1px solid;
        margin-top: 5px;
        &-label{
          width: 35%;
          text-align: left;
          // border: 1px solid;
          color: grey;
        }
        &-val{
          width: 65%;
          text-align: left;
          // border: 1px solid;
        }
        table{
          width: 100%;
          // border: 1px solid;
          border-spacing: 0;
          tr{

          }
          td{
            padding: 6px 0 6px 0;
            font-size: 15px;
            vertical-align: top;
          }
        }
      }
    }
    .sy-handle{
      height: 45px;
      z-index: 1003;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: #fff;
      border-top: 1px solid #EFEFF4;
      &-num{
        width: 100px;
        height: 30px;
        display: inline-block;
        position: absolute;
        top: 6px;
        left: 30px;
      }
      &-btn{
        position: absolute;
        top: 6px;
        right: 30px;
      }
    }
  }
</style>
