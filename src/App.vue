<template>
  <div id="app">
    <router-view/>
    <div class="load-wrap" v-show="ifShowLoading">
      <div class="load">
        <img src="./img/default_loading.gif" alt="">
      </div>
      <div class="text">
        <span>
          加载中
        </span>
      </div>
    </div>
   <div class="load-wrap" v-show="ifShowLoadSuccess">
      <div class="load-nothing">
        <img src="./img/no-info.gif" alt="">
      </div>
      <div class="text">
        <span>
          没有相关信息
        </span>
      </div>
    </div>
   <div class="load-wrap" v-show="ifShowLoadFailure">
      <div class="load-failure">
        <img src="./img/loadfailure.jpg" alt="">
      </div>
      <div class="text">
        <span>
          加载失败
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    ifShowLoad () {
      let isLoading = this.$store.state.isLoading
      return isLoading
    },
    ifShowLoading () {
      let isLoading = this.$store.state.isLoading
      let loadImg = this.$store.state.loadImg
      if (isLoading === true && loadImg === 'loading') {
        return true
      } else {
        return false
      }
    },
    ifShowLoadFailure () {
      let isLoading = this.$store.state.isLoading
      let loadImg = this.$store.state.loadImg
      if (isLoading === true && loadImg === 'loadFailure') {
        return true
      } else {
        return false
      }
    },
    ifShowLoadSuccess () {
      let isLoading = this.$store.state.isLoading
      let loadImg = this.$store.state.loadImg
      if (isLoading === true && loadImg === 'loadSuccess') {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  .load-wrap{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    .load, .load-nothing, .load-failure{
      width: 250px;
      height: 250px;
      margin: 100px auto;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .text{
      width: 250px;
      text-align: center;
      margin: -90px auto;
      font-size: 20px;
      color: grey;
    }
  }
}
html{
  background-color: #EFEFF4;
}
body{
  margin: 0;
}
</style>
