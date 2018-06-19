<template>
  <div class="collect-movies-wrap">
    <span class="collect-movies" v-if="!collectedMovie" @click="addCollection">
      <i class="iconfont">&#xe7a7;</i> 收藏
    </span>
    <span class="collect-movies has-collected" v-if="collectedMovie" @click="cancelCollection">
      <i class="iconfont">&#xe627;</i> 已收藏
    </span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'collectMovies',
  props: {
    movieData: Object
  },
  data() {
    return {
      collectedMovie: false
    }
  },
  computed: {
    ...mapState({
      localMovies: state => state.collection.collectionMovies
    })
  },
  methods: {
    isCollected() {
      let curPath = ''
      if (this.$route.name == 'play') {
        curPath = this.$route.path.split('/').slice(0, 4).join('/')
      } else {
        curPath = this.$route.path
      }
      let matchedMovie = []
      for (let i = 0; i < this.localMovies.length; i++) {
        if (this.localMovies[i].movieUrl == curPath) {
          matchedMovie.push(this.localMovies[i])
          break
        }
      }
      if (matchedMovie.length > 0) {
        this.collectedMovie = true
      } else {
        this.collectedMovie = false
      }
    },
    addCollection() {
      this.$message('收藏成功', 'success')
      this.collectedMovie = true
      let collectedMovieInfos = {
        movieUrl: '',
        movieName: this.movieData.movieName,
        movieImg: this.movieData.movieImg,
        movieActors: this.movieData.movieActors,
        movieTag: this.$route.params.tag
      }
      if (this.$route.name == 'play') {
        collectedMovieInfos.movieUrl = this.$route.path.split('/').slice(0, 4).join('/')
      } else {
        collectedMovieInfos.movieUrl = this.$route.path
      }
      this.$store.commit('addCollectionMovies', collectedMovieInfos)
    },
    cancelCollection() {
      this.$message('已取消收藏', 'error')
      this.collectedMovie = false
      let curPath = this.$route.path
      let matchedIndex = 0
      for (let i = 0; i < this.localMovies.length; i++) {
        if (this.localMovies[i].movieUrl == curPath) {
          matchedIndex = i
          break
        }
      }
      this.$store.commit('removeCollectionMovies', matchedIndex)
    }
  },
  mounted() {
    this.isCollected()
  },
  activated() {
    this.isCollected()
  }
}
</script>

<style lang="less">
.collect-movies {
  border-radius: 4px;
  letter-spacing: 1px;
  font-size: 14px;
  color: #fff;
  padding: 7px 14px;
  background-color: #de3455;
  &.has-collected {
    background-color: #3498db;
  }
}
</style>
