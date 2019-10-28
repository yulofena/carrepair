<template>
  <div class="goods-list">
    <div class="sy-nav">
      <div class="sy-nav-back">
        <span><a href="javascript:history.back();" slot="back-icon" >返回</a></span>
      </div>
      <div class="sy-nav-input">
        <nut-searchbar
            :placeText="请输入关键字"
            searchIconColor="#fff"
            searchBtnIconColor="#fff"
            @input="inputFun"
            @submit="searchGoods"
        >
        </nut-searchbar>
      </div>
    </div>
    <div class="sy-filter">
      <a href="#" @click="isVisible1True"><span>种类</span></a>
      <a href="#" @click="isVisible2True"><span>品牌</span></a>
    </div>
    <nut-menu
      :isVisible="visible.isVisible1"
      :list="list1"
      type="simple"
      @close="switchMenu('isVisible1',1)"
      @choose="chooseMenu1">
    </nut-menu>
    <nut-menu
      :isVisible="visible.isVisible2"
      :list="list2"
      type="simple"
      @choose="chooseMenu2"
      @close="switchMenu('isVisible2',1)"
    >
    </nut-menu>
    <div class="listGoods" :style="[scrollHeight]">
        <nut-scroller
            :is-un-more="isUnMore2"
            :is-loading="isLoading2"
            :type="'vertical'"
            @loadMore="loadMoreVert2"
            @pulldown="pulldown2"
        >
          <div slot="list" class="nut-vert-list-panel">
            <div class="nut-vert-list-item" v-for="(item,index) in goodsListArr" :key="index">
              <router-link :to="{path:'/GoodsDetail',query: {productId: item.productId, identity: identity, pageName: pageName}}">
                <div class="nut-scroller-item-info syCell" >
                  <img class="syCellImg" :src="item.cover" alt="">
                  <div class="syCellContent">
                    <div class="syCellContentTitle">
                      <div class="syCellContentTitleTag">
                        <span>一口价</span>
                      </div>
                      <span>{{item.name}}</span>
                    </div>
                    <div class="syCellContentTip">
                      {{item.brandName}}
                    </div>
                    <div class="syCellContentOriginalPrice">
                      <nut-price
                          :price="item.price"
                          :needSymbol="true"
                          :thousands="false"
                      />
                    </div>
                    <div class="syCellContentPresentPrice">
                      <span class="syCellContentPresentPrice">原价</span>
                      <nut-price
                          class="syCellContentPresentPriceVal"
                          :price="item.originalPrice"
                          :needSymbol="true"
                          :thousands="false"
                      />
                    </div>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </nut-scroller>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import router from '@/router'
// eslint-disable-next-line no-unused-vars
import {mapGetters, mapActions} from 'vuex'
export default {
  name: 'GoodsList',
  data () {
    return {
      pageNum: 1, // 普通参数 1 第几页 number false
      pageSize: 10, // number false 普通参数 10 每页的数据
      categoryId: '', // string false 普通参数 分类id
      brandId: '', // string false 普通参数 品牌id
      productTitle: '', // string false 普通参数 产品名称
      num: 1, // 过滤参数
      titlenum: 1, // 过滤参数
      max: 6, // 过滤参数
      visible: { // 过滤参数
        isVisible1: false,
        isVisible2: false
      },
      list1: [],
      list2: [], // 过滤参数
      // 滑动事件需要高度
      scrollHeight: {
        height: window.innerHeight - 40 + 'px'
      },
      isUnMore2: false,
      isLoading2: false,
      goodsListArr: [], // 商品的数据
      maxPages: 10,
      page2: 1,
      timers: null,
      identity: 'user',
      pageName: '', // 页面的参数名
      // count: []
      backData: ''
    }
  },
  mounted () {
    this.$store.commit('updateLoadImg', 'loading')
    this.$store.commit('updateIsLoading', true)
    this.pageName = this.$route.query.pageName // 传过来的页面参数
    this.identity = this.$route.query.identity // 传过来的页面参数
    if (this.pageName === 'secondHand') {
      // 如果是二手车页面
    }
    // 获取筛选条件，品牌，种类
    this.getScreenForGoods()
    this.getGoodsList()
    const that = this
    window.onresize = () => {
      return (() => {
        that.scrollHeight = {
          height: this.window.innerHeight - 40 + 'px'
        }
      })()
    }
  },
  methods: {
    inputFun (value) {
      this.productTitle = value
    },
    isVisible1True () {
      this.visible.isVisible1 = true
      this.visible.isVisible2 = false
    },
    isVisible2True () {
      this.visible.isVisible2 = true
      this.visible.isVisible1 = false
    },
    switchMenu (param, num) {
      this.num = num
      this.titlenum = param.split('isVisible')[1]
      for (let key in this.visible) {
        if (key !== param) {
          this.visible[key] = false
        }
      }
      Array.from(document.querySelectorAll('.list')).forEach(item => {
        item.style.zIndex = 0
      })
      if (!this.visible[`${param}`]) {
        document.querySelector('.list' + this.num).style.zIndex = 9999
      }
      this.visible[`${param}`] = !this.visible[`${param}`]
    },
    chooseMenu1 (item, index) {
      this.switchMenu('isVisible1', 1)
      // eslint-disable-next-line no-return-assign
      this.list1.map((value, key) => value.selected = false)
      this.$set(this.list1[index], 'selected', true)
      let obj = this.list1[index]
      if (obj.text === '全部' && obj.id === 0) {
        this.categoryId = null
      } else {
        this.categoryId = obj.categoryId
      }
      this.pulldown2()
      this.$refs.title1.innerText = item.text
    },
    chooseMenu2 (item, index) {
      this.switchMenu('isVisible2', 1)
      // eslint-disable-next-line no-return-assign
      this.list2.map((value, key) => value.selected = false)
      this.$set(this.list2[index], 'selected', true)
      let obj = this.list2[index]
      if (obj.text === '全部' && obj.id === 0) {
        this.brandId = null
      } else {
        this.brandId = obj.brandId
      }
      this.pulldown2()
      this.$refs.title1.innerText = item.text
    },
    loadMoreVert2 () {
      console.log('加载更多')
      this.isLoading2 = true
      if (this.page2 > this.maxPages2) {
        this.isUnMore2 = true
        this.isLoading2 = false
      } else {
        clearTimeout(this.timers)
        this.timer = setTimeout(() => {
          this.isLoading2 = false
          this.isUnMore2 = false
          this.pageNum++
          this.getGoodsList()
        }, 300)
      }
    },
    pulldown2 () {
      console.log('刷新')
      this.isLoading2 = true
      clearTimeout(this.timers)
      this.timer = setTimeout(() => {
        this.isLoading2 = false
        this.isUnMore2 = false
        this.goodsListArr = new Array(10)
        this.pageNum = 1
        this.goodsListArr = []
        this.getGoodsList()
        // this.count = 10
      }, 300)
    },
    // 获取商品列表
    getGoodsList () {
      let that = this
      let req = {
        pageNum: this.pageNum, // number false 普通参数 1 第几页
        pageSize: this.pageSize, // number false 普通参数 10 每页的数据
        categoryId: this.categoryId, // string false 普通参数 分类id
        brandId: this.brandId, // string false 普通参数 品牌id
        productTitle: this.productTitle // string false 普通参数 产品名称
      }
      // this.axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
      this.axios.post(that.reqAddress + '/hcProduct/listByParams', req).then((response) => {
        let resultState = response.data // code,data
        let code = resultState.code
        let resultPage = resultState.data // page,row,pageCount,rowCount,data
        let resultData = resultPage.data // array:
        if (code === '0') {
          this.backData = JSON.stringify(resultData)
          for (let i = 0; i < resultData.length; i++) {
            this.goodsListArr.push(resultData[i])
          }
          if (resultData.length === 0) {
            this.pageNum--
          }
          if (resultData.length === 0) {
            // 返回没问题，但数据0条
            this.$store.commit('updateLoadImg', 'loadSuccess')
            this.$store.commit('updateIsLoading', true)
          } else {
            // 返回的数据至少有一条
            this.$store.commit('updateIsLoading', false)
          }
        } else {
          this.$store.commit('updateLoadImg', 'loadFailure')
          this.$store.commit('updateIsLoading', true)
        }
      }).catch((err) => {
        console.log(err.response)
        // 返回的code不为0，有问题，显示加载失败动画
        this.$store.commit('updateLoadImg', 'loadFailure')
      })
    },
    // 获取筛选的参数
    getScreenForGoods () {
      let that = this
      let req = {
      }
      // this.axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
      this.axios.post(that.reqAddress + '/hcProduct/categoryAndBrand', req).then((response) => {
        let resultState = response.data // code,data
        let code = resultState.code
        let resultPage = resultState.data // page,row,pageCount,rowCount,data
        let categorys = resultPage.categorys // 分类
        let brands = resultPage.brands // 品牌
        if (code === '0') {
          let allSelect = {
            id: 0,
            text: '全部',
            selected: false
          }
          this.list1.push(allSelect)
          for (let i = 0; i < categorys.length; i++) {
            let singleSelect = {
              id: i,
              categoryId: categorys[i].categoryId,
              text: categorys[i].categoryName,
              selected: false
            }
            this.list1.push(singleSelect)
          }
          let allSelect2 = {
            id: 0,
            text: '全部',
            selected: false
          }
          this.list2.push(allSelect2)
          for (let j = 0; j < brands.length; j++) {
            let singleSelect = {
              id: j,
              brandId: brands[j].brandId,
              text: brands[j].brandName,
              selected: false
            }
            this.list2.push(singleSelect)
          }
        } else {
        }
      })
    },
    searchGoods () {
      this.pageNum = 1
      this.goodsListArr = []
      this.getGoodsList()
    }
  }
}
</script>

<style lang="scss">
  .goods-list{
    padding-top: 85px;
    .sy-nav{
      height: 50px;
      padding-left: 35px;
      background-color: $mainStyleColor;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      &-back{
        position: absolute;
        top: 15px;
        left: 5px;
        vertical-align: middle;
        color: #fff;
        a{
          color: #fff;
        }
      }
      &-input{
        display: inline-block;
        width: 100%;
      }
      .nut{
        &-searchbar{
          padding-left: 8px;
          padding-right: 8px;
          padding-top: 5px;
          padding-bottom: 5px;
          background-color: $mainStyleColor;
          .search-input input{
            border-radius: 20px;
          }
        }
      }
    }
    .sy-filter{
      position: fixed;
      height: 35px;
      top: 50px;
      left: 0;
      right: 0;
      background-color: #fff;
      z-index: 9999;
      border-bottom: 1px solid #EFEFF4;
      a{
        width: 30%;
        height: 35px;
        display: inline-block;
        font-size: 20px;
        color: #000;
        span{
          vertical-align: middle;
        }
      }
    }
    .nut-menu{
      &-panel{
        top: 85px;
      }
    }
  }
  .listGoods{
    a{
      color: #000;
    }
    .syCell{
      width: 96%;
      height: 6.5rem;
      background-color: #fff;
      text-align: left;
      margin: 0.3rem auto;
      border-radius: 10px;
      padding: 0.5rem 0 0.5rem 0;
      position:relative;
      &Img{
        width: 5rem;
        height: 6.2rem;
        margin-left: 10px;
        vertical-align: middle;
      }
      &Content{
        position: absolute;
        left: 6.5rem;
        top: 0.5rem;
        right: 0.5rem;
        bottom: 0.5rem;
        &Title{
          font-size: 16px;
          padding: 0 0 0.4rem 0;
          span{
            vertical-align: middle;
          }
          &Tag{
            padding: 0.2rem 0.2rem 0.1rem 0.2rem;
            color: #fff;
            font-size: 10px;
            display: inline-block;
            background-color: red;
          }
        }
        &Tip{
          color: #8f8f94;
        }
        &OriginalPrice{
          color: red;
          text-align: right;
          padding-right: 10px;
        }
        &PresentPrice{
          text-align: right;
          padding-right: 10px;
          &Val{
            text-decoration: line-through;
          }
        }
      }
    }
  }

</style>
