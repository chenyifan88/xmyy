<template>
  <div class="index">
    <div v-if="listData" class="movie-item-container">
      <div class="movie-item" v-for="item of listData" :key="item.movieId">
        <router-link :to="'/movie/'+ item.movieId + '/' + item.movieTag" class="movie-img">
          <img v-lazy="item.movieImg" :alt="item.movieName" />
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
    <div class="paging">
      <el-pagination background layout="prev, pager, next" :page-count="countPage" :current-page="currentPage" @current-change="changePages"></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      pageSize: 18, // 每页显示数据条数
      currentPage: 0, // 当前页码
      countPage: 0, // 总页数
      listData: null
    }
  },
  computed: {
    initPage() {
      return parseInt(this.$route.query.page)
    }
  },
  watch: {
    '$route'(to, from) {
      this.fetchData()
    }
  },
  methods: {
    fetchData() {
      let params = {
        type: '首页',
        current_page: this.initPage || 1,
        page_size: this.pageSize || 20
      }
      this.$http.post('list', params).then(this.handleData)
    },
    handleData(res) {
      if (res) {
        this.listData = res.categoryListData
        this.countPage = res.countPage
        this.currentPage = parseInt(res.currentPage)
        this.$root.broadcast('App', 'page-loaded')
      }
    },
    changePages(pageIndex) {
      this.$router.push({ name: 'index', query: { page: pageIndex } })
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
.index {
  padding: 20px;
}
.movie-item-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  // justify-content: space-between;
  .movie-item {
    width: 160px;
    height: 260px;
    padding: 10px;
    margin-bottom: 6px;
    margin-right: 5px;
    .movie-img {
      width: 100%;
      img {
        width: 140px;
        height: 190px;
      }
    }
    .movie-name {
      display: block;
      width: 100%;
      font-size: 14px;
      line-height: 30px;
      margin-top: 6px;
    }
    .movie-actors {
      font-size: 12px;
      color: #999999;
    }
  }
}
.paging {
  text-align: center;
  margin-top: 20px;
}
</style>
