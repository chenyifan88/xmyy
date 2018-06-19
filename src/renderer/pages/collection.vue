<template>
  <div class="category">
    <div class="do-collect" v-if="movieCollections.length > 0">
      <span class="clear-collect" @click="clearCollect">清空收藏</span>
    </div>
    <div class="movie-item-container" v-if="listData.length > 0">
      <div class="movie-item" v-for="item of listData" :key="item.index">
        <router-link :to="item.movieUrl" class="movie-img">
          <img v-lazy="item.movieImg" :alt="item.movieName" />
          <div class="movie-mask">
            <i class="iconfont">&#xe601;</i>
          </div>
          <span class="sign-source sign-online" v-if="item.movieTag == 2">在线</span>
          <span class="sign-source sign-download" v-else-if="item.movieTag == 1">下载</span>
        </router-link>
        <router-link :to="item.movieUrl" class="movie-name text-ellip" :title="item.movieName">
          {{item.movieName}}
        </router-link>
        <p class="movie-actors text-ellip">{{item.movieActors}}</p>
      </div>
    </div>
    <div v-else>
      <p>您还未收藏影片</p>
    </div>
    <div class="paging" v-if="movieCollections.length > pageSize">
      <el-pagination background layout="prev, pager, next" :page-count="countPage" :current-page="currentPage" @current-change="changePages"></el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      listData: [],
      pageSize: 18, // 每页显示数据条数
      currentPage: 1, // 当前页码
      countPage: 0 // 总页数
    }
  },
  computed: {
    ...mapState({
      movieCollections: state => state.collection.collectionMovies
    })
  },
  methods: {
    clearCollect() {
      this.$messageBox.confirm('确定要清空吗？删除后无法恢复。', '提示', { closeOnClickModal: true }).then(() => {
        this.listData = []
        this.$message('已清空收藏', 'error')
        this.$store.commit('clearCollectionMovies')
      }).catch(() => {
        console.log('取消操作')
      })
    },
    initPages() {
      this.countPage = parseInt(this.movieCollections.length / this.pageSize) + 1
      this.changePages(1)
    },
    changePages(pageIndex) {
      this.listData = this.movieCollections.slice((pageIndex - 1) * this.pageSize, pageIndex * this.pageSize)
    }
  },
  mounted() {
    this.initPages()
    this.$root.broadcast('App', 'page-loaded')
  }
}
</script>

<style lang="less">
</style>
