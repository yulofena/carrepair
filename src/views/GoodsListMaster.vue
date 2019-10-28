<template>
  <div class="goods-list-master">
    <div class="sy-nav">
      <div class="sy-nav-back">
        <span><a href="javascript:history.back();" slot="back-icon" >返回</a></span>
      </div>
      <div class="sy-nav-input">
        <nut-searchbar
            placeText="请输入关键字"
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
              <div class="nut-scroller-item-info syCell" >
                <nut-badge
                  :value="singleGoodsAmount(item.productId)"
                  class="item"
                >
                  <img class="syCellImg" :src="item.cover" alt="">
                </nut-badge>
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
                  <div class="syCellContentHandleBtn">
                    <nut-button
                      type="actived"
                      shape="circle"
                      icon="minus"
                      @click="GoodsAmountSub(item.productId)"
                      small
                    >
                    </nut-button>
                    <nut-button
                      type="actived"
                      shape="circle"
                      icon="plus"
                      @click="GoodsAmountAdd(item.productId, item.price)"
                      small
                    >
                    </nut-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nut-scroller>
    </div>
    <div class="sy-handle-btn">

      <div class="sy-handle-price">
        <div class="sy-handle-labour">
          <span class="sy-handle-labour-label">
            人工费
          </span>
          <nut-stepper
            :value.sync="labour"
            decimalPlaces="2"
          ></nut-stepper>
        </div>
        <div class="sy-handle-amount">
          <span class="sy-handle-amount-label">
            总费用
          </span>
          <nut-price
            :price="getTotalPrice"
            :decimalDigits="2"
            :needSymbol="true"
            :thousands="true"
          />
        </div>
      </div>

      <div class="sy-handle-btn-group">
        <nut-button-group>
          <nut-button
            type="light"
            @click="resetProducts"
          >
            重置
          </nut-button>
          <nut-button @click="subForProductMatchOrder">
            确定
          </nut-button>
        </nut-button-group>
      </div>

    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import router from '@/router'
// eslint-disable-next-line no-unused-vars
import {mapGetters, mapActions} from 'vuex'
export default {
  name: 'GoodsListMaster',
  data () {
    return {
      pageNum: 1, // 普通参数 1 第几页 number false
      pageSize: 10, // number false 普通参数 10 每页的数据
      categoryId: '', // string false 普通参数 分类id
      brandId: '', // string false 普通参数 品牌id
      productTitle: '', // 搜索框 产品名称
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
        height: window.innerHeight - 40 - 74 - 53 - 10 + 'px'
      },
      isUnMore2: false,
      isLoading2: false,
      goodsListArr: [], // 商品的数据
      maxPages: 10,
      page2: 1,
      timers: null,
      identity: 'user',
      backData: '',
      labour: 0,
      totalPrice: 0
      // count: []
    }
  },
  computed: {
    getTotalPrice () {
      let goodsForOrderArr = this.$store.state.goodsForOrderArr
      // 尚未有数组存在本地
      if (goodsForOrderArr === '' || goodsForOrderArr === null) {
        return this.labour
      }
      let total = Number(this.labour)
      let goodsArr = JSON.parse(goodsForOrderArr)
      for (let i = 0; i < goodsArr.length; i++) {
        if (goodsArr[i].price || goodsArr[i].num > 0) {
          let num = Number(goodsArr[i].num)
          let price = Number(goodsArr[i].price)
          total += (price * num)
        }
      }
      return total
    }
  },
  mounted () {
    this.$store.commit('updateLoadImg', 'loading')
    this.$store.commit('updateIsLoading', true)
    let pageName = this.$route.query.pageName // 传过来的页面参数
    this.identity = this.$route.query.identity // 传过来的页面参数
    if (pageName === 'secondHand') {
      // 如果是二手车页面
    }
    // 获取商品列表
    this.getGoodsList()
    // 获取筛选条件，品牌，种类
    this.getScreenForGoods()
    const that = this
    window.onresize = () => {
      return (() => {
        that.scrollHeight = {
          height: this.window.innerHeight - 40 - 74 - 53 - 10 + 'px'
        }
      })()
    }
  },
  methods: {
    // 搜索的值
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
      this.isLoading2 = true
      clearTimeout(this.timers)
      this.timer = setTimeout(() => {
        this.isLoading2 = false
        this.isUnMore2 = false
        this.goodsListArr = new Array(10)
        this.pageNum = 1
        this.goodsListArr = []
        this.getGoodsList()
      }, 300)
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
        // window.alert('ba:' + JSON.stringify(brands))
        // window.alert('ca:' + JSON.stringify(categorys))
        if (code === '0') {
          let allSelect = {
            id: 0,
            text: '全部',
            selected: false
          }
          this.list1.push(allSelect)
          for (let i = 0; i < categorys.length; i++) {
            let singleSelect = {
              id: i + 1,
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
              id: j + 1,
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
          // 返回的code不为0，有问题，显示加载失败动画
          this.$store.commit('updateLoadImg', 'loadFailure')
          this.$store.commit('updateIsLoading', true)
        }
      }).catch((err) => {
        console.log(err.response)
        // 返回的code不为0，有问题，显示加载失败动画
        this.$store.commit('updateLoadImg', 'loadFailure')
      })
    },
    // 搜索按钮事件
    searchGoods () {
      this.pageNum = 1
      this.goodsListArr = []
      this.pulldown2()
    },
    singleGoodsAmount (productId) {
      // let orderHandleId = this.$store.state.orderHandleId
      let goodsForOrderArr = this.$store.state.goodsForOrderArr
      if (goodsForOrderArr === '' || goodsForOrderArr === null) {
        goodsForOrderArr = '[]'
      }
      let num = 0
      let goodsArr = JSON.parse(goodsForOrderArr)
      for (let i = 0; i < goodsArr.length; i++) {
        if (productId === goodsArr[i].productId) {
          num = goodsArr[i].num
        }
      }
      return num
    },
    // 添加商品数量
    GoodsAmountAdd (productId, price) {
      let product = {
        productId: productId,
        num: 1,
        price: price
      }
      // let orderHandleId = this.$store.state.orderHandleId
      let goodsForOrderArr = this.$store.state.goodsForOrderArr
      // 尚未有数组存在本地
      if (goodsForOrderArr === '' || goodsForOrderArr === null) {
        let newArr = []
        newArr.push(product)
        this.$store.commit('updateGoodsForOrderArr', JSON.stringify(newArr))
        return true
      }
      let ifHasGoods = false
      let goodsArr = JSON.parse(goodsForOrderArr)
      for (let i = 0; i < goodsArr.length; i++) {
        if (productId === goodsArr[i].productId) {
          goodsArr[i].num++
          ifHasGoods = true
        }
      }
      if (ifHasGoods === false) {
        goodsArr.push(product)
      }
      this.$store.commit('updateGoodsForOrderArr', JSON.stringify(goodsArr))
      return true
    },
    // 减少商品数量
    GoodsAmountSub (productId) {
      let goodsForOrderArr = this.$store.state.goodsForOrderArr
      if (goodsForOrderArr === '' || goodsForOrderArr === null) {
        return true
      }
      let goodsArr = JSON.parse(goodsForOrderArr)
      for (let i = 0; i < goodsArr.length; i++) {
        if (productId === goodsArr[i].productId) {
          if (goodsArr[i].num > 0) {
            goodsArr[i].num--
          }
        }
      }
      this.$store.commit('updateGoodsForOrderArr', JSON.stringify(goodsArr))
      return true
    },
    // 重置
    resetProducts () {
      this.$store.commit('updateGoodsForOrderArr', '')
      this.categoryId = ''
      this.brandId = ''
      this.productTitle = ''
      this.pulldown2()
    },
    // 添加成功，返回上一页
    submitSuccess () {
      this.$router.go(-1)
    },
    // 提交关联订单信息
    subForProductMatchOrder () {
      let productIds = JSON.parse(this.$store.state.goodsForOrderArr)
      let orderHandleId = this.$store.state.orderHandleId
      let that = this
      let those = this
      let labour = Number(this.labour)
      let hlabour = labour.toFixed(2)
      let req = {
        productIds: productIds,
        orderNo: orderHandleId,
        labour: hlabour
      }
      // this.axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
      this.axios.post(that.reqAddress + '/hcOrder/selected_product', req).then((response) => {
        let resultState = response.data // code,data
        let code = resultState.code
        let message = resultState.message // page,row,pageCount,rowCount,data
        if (code === '0') {
          that.$toast.success(message, {
            duration: 2000, // 展示时长
            center: true, // 是否居中展示，值为false时展示在页面底部
            bottom: 40, // 展示在页面底部时，距底部的距离（px)
            textAlignCenter: true, // 多行文本是否居中展示，值为false时单行居中，多行居左
            onClose: those.submitSuccess
          })
        } else {
          that.$toast.fail(message, {
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
  .goods-list-master{
    padding-top: 5.5rem;
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
    .sy-handle{
      &-btn{
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 0 18px 0 0;
        background-color: #fff;
        border-top: 1px solid #EFEFF4;
        &-group{
          width: 100%;
          height: 40px;
          padding: 5px 0 8px 0;
          text-align: right;
        }
      }
      &-price{
        width: 100%;
      }
      &-labour{
        height: 35px;
        padding: 5px 15px 0 10px;
        text-align: left;
        &-label{
          font-size: 16px;
          padding: 5px 0 0 10px;
          float: left;
        }
        .nut-stepper-simple{
          float: right;
        }
      }
      &-amount{
        font-size: 30px;
        text-align: right;
        padding: 0 15px 0 10px;
        &-label{
          font-size: 16px;
          padding: 12px 0 0 10px;
          float: left;
        }
        .nut-price{
          color: red;
        }
      }
    }
  }
  .listGoods{
    a{
      color: #000;
    }
    .syCell{
      width: 96%;
      height: 7.8rem;
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
        &HandleBtn{
          text-align: right;
          padding-right: 10px;
          padding-top: 5px;
        }
      }
    }
  }
</style>
