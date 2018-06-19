<template>
  <div class="category">
    <div class="movie-item-container">
      <div class="breadcrumb-trail">
        <router-link to="/">首页</router-link>
        <a>{{$route|handleBigCat}}</a>
      </div>
      <div class="movie-item" v-if="listData" v-for="item of listData" :key="item.movieId">
        <router-link :to="'/movie/'+ item.movieId + '/' + item.movieTag" class="movie-img">
          <img v-lazy="item.movieImg" :alt="item.movieName">
          <div class="movie-mask">
            <i class="iconfont">&#xe601;</i>
          </div>
          <span class="sign-source sign-online" v-if="item.movieTag == '2'">在线</span>
          <span class="sign-source sign-download" v-else-if="item.movieTag == '1'">下载</span>
        </router-link>
        <router-link :to="'/movie/'+ item.movieId + '/' + item.movieTag" class="movie-name text-ellip" :title="item.movieName">
          {{item.movieName}}
        </router-link>
        <p class="movie-actors text-ellip">{{item.movieActors}}</p>
      </div>
    </div>
    <div class="no-data" v-if="!countNum">
      <p>找到 0 条结果，请更换关键词重新搜索</p>
    </div>
    <div class="paging">
      <el-pagination background layout="prev, pager, next" :page-count="countPage" :current-page="currentPage" @current-change="changePages"></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'list',
  data() {
    return {
      pageSize: 18, // 每页显示数据条数
      currentPage: 1, // 当前页码
      countPage: 0, // 总页数
      listData: null,
      countNum: 0
    }
  },
  watch: {
    '$route'(to, from) {
      this.currentPage = 1
      this.fetchData()
    }
  },
  methods: {
    fetchData() {
      let params = {
        keyword: this.$route.query.keyword,
        current_page: this.currentPage || 1,
        page_size: this.pageSize || 20
      }
      this.$http.post('search', params).then(this.handleData)
    },
    handleData(res) {
      if (res) {
        this.listData = res.searchResultData
        this.countPage = res.countPage
        this.currentPage = parseInt(res.currentPage)
        this.countNum = res.countNum
        this.$root.broadcast('App', 'page-loaded')
      }
    },
    changePages(pageIndex) {
      this.currentPage = pageIndex
      this.fetchData()
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>

<style lang="less">
.no-data {
  margin-top: 20px;
  font-size: 15px;
  color: #333;
  text-align: center;
  line-height: 40px;
}
</style>

