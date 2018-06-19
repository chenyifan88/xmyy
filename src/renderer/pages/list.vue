<template>
  <div class="category">
    <div class="movie-item-container" v-if="listData">
      <div class="breadcrumb-trail">
        <router-link to="/">首页</router-link>
        <router-link :to="'/category/' + $route.params.catid" v-if="$route.params.catid">{{$route | handleBigCat}}</router-link>
        <a v-if="$route.params.smcat">{{$route | handleSamllCat}}</a>
      </div>
      <div class="movie-item" v-for="item of listData" :key="item.movieId">
        <router-link :to="'/movie/'+ item.movieId + '/' + item.movieTag" class="movie-img">
          <img v-lazy="item.movieImg" :alt="item.movieName" />
          <div class="movie-mask">
            <i class="iconfont">&#xe601;</i>
          </div>
          <span class="sign-source sign-online" v-if="isOnlineMovie(item)">在线</span>
          <span class="sign-source sign-download" v-else-if="!isOnlineMovie(item)">下载</span>
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
  name: 'list',
  data() {
    return {
      pageSize: 18, // 每页显示数据条数
      currentPage: 1, // 当前页码
      countPage: 0, // 总页数
      listData: null,
      listType: '',
      listSmallType: '',
      reqParams: {}
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
    isOnlineMovie(item) {
      return item.movieTag == '2'
    },
    fetchData() {
      this.whichList()
      this.$http.post('list', this.reqParams).then(this.handleData)
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
      if (this.listSmallType) {
        this.$router.push({ name: 'smlist', query: { page: pageIndex } })
      } else {
        this.$router.push({ name: 'list', query: { page: pageIndex } })
      }
      this.fetchData()
    },
    whichList() {
      let curBigCat = this.$route.params.catid
      let curSmallCat = this.$route.params.smcat
      if (curSmallCat == '') {
        this.listType = curBigCat
        this.reqParams = {
          type: this.listType,
          current_page: this.initPage || 1,
          page_size: this.pageSize || 20
        }
      } else {
        this.listType = curBigCat
        this.listSmallType = curSmallCat
        this.reqParams = {
          type: this.listType,
          type_ext: this.listSmallType,
          current_page: this.initPage || 1,
          page_size: this.pageSize || 20
        }
      }
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>

<style lang="less">
</style>
