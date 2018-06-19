<template>
  <div class="movie-play">
    <div class="player-container">
      <player v-if="currentMovieUrl!=''" :currentMovieUrl.sync="currentMovieUrl"></player>
    </div>
    <div class="movie-info">
      <div class="name-wrap">
        <p class="movie-name text-ellip" v-if="movieData">
          {{movieData.movieName}}
        </p>
        <collect-movies :movieData="movieData"></collect-movies>
      </div>
      <select-series v-if="movieData" :movieData="movieData" :key="activeDate"></select-series>
    </div>
  </div>
</template>

<script>
import player from '@/components/player'
import selectSeries from '@/components/selectSeries'
import collectMovies from '@/components/collectMovies'
import { mapState } from 'vuex'
export default {
  name: 'play',
  components: { player, selectSeries, collectMovies },
  data() {
    return {
      movieData: null,
      sourceActive: 0,
      onlineTag: '',
      currentMovieId: '',
      currentMovieUrl: '',
      movieOnlineData: '',
      activeDate: 1
    }
  },
  computed: {
    currentSeriesData() {
      if (!this.movieOnlineData) return []
      return this.movieOnlineData[this.sourceActive].seriesData
    },
    ...mapState({
      playState: state => state.playing.playState
    })
  },
  watch: {
    '$route'() {
      if (this.$route.name == 'play' && this.playState) {
        this.fetchData()
      }
    }
  },
  methods: {
    toggleSourceIndex(index) {
      this.sourceActive = index
    },
    fetchData() {
      this.$store.commit('savePlaySrc', this.$route.path)
      let curReqUrl = '/detail/id-' + this.currentMovieId + '/tag-' + this.onlineTag
      this.$http.get(curReqUrl).then(this.handleData)
    },
    handleData(res) {
      this.$store.commit('changePlayState', true)
      this.activeDate = new Date().getTime()
      if (res) {
        this.movieData = res
        this.currentMovieId = res.movieId
        this.movieOnlineData = res.movieData
        let sourceid = this.$route.params.sourceid
        let seriesid = this.$route.params.seriesid
        this.currentMovieUrl = this.movieOnlineData[sourceid].seriesData.filter((m, index) => {
          return index == seriesid
        })[0].playUrl
        this.$root.broadcast('App', 'page-loaded')
      }
    }
  },
  mounted() {
    this.currentMovieId = this.$route.params.movieid
    this.onlineTag = this.$route.params.tag
    this.fetchData()
  },
  activated() {
    this.currentMovieId = this.$route.params.movieid
    this.onlineTag = this.$route.params.tag
    this.$store.commit('changePlayState', true)
    if (this.$route.path == this.$store.state.playing.playSrc) {
      this.$root.broadcast('App', 'page-loaded')
    }
    if (this.$store.state.playing.playSrc !== '' && this.$route.path !== this.$store.state.playing.playSrc) {
      this.fetchData()
    }
  },
  deactivated() {
    if (this.$route.name !== 'play') {
      this.$store.commit('changePlayState', false)
    }
  }
}
</script>

<style lang="less">
.movie-play {
  .player-container {
    width: 100%;
    background-color: #000;
  }
  .movie-info {
    .name-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 20px;
      border-bottom: 1px solid #eaecef;
      .movie-name {
        font-size: 18px;
        line-height: 60px;
        padding-left: 20px;
      }
    }
    .select-play {
      padding: 0 40px;
      .source {
        padding: 14px 0;
        border-bottom: 1px solid #eaecef;
        ul {
          display: flex;
          flex-wrap: wrap;
          li {
            padding: 8px 10px;
            border-radius: 4px;
            margin-right: 20px;
            color: #333;
            border: 1px solid #999;
            font-size: 15px;
            cursor: default;
            user-select: none;
            &:nth-of-type(1) {
              border: none;
              font-size: 15px;
              margin-right: 5px;
            }
            &.active {
              background-color: #3498db;
              color: #fff;
              border: 1px solid #3498db;
            }
          }
        }
      }
      .series {
        margin-top: 20px;
        ul {
          display: flex;
          flex-wrap: wrap;
          li {
            width: 136px;
            padding: 0 10px;
            line-height: 34px;
            height: 36px;
            text-align: center;
            overflow: hidden;
            margin-bottom: 10px;
            a {
              display: block;
              border: 1px solid #eeeeee;
              font-size: 15px;
              border-radius: 4px;
              height: 34px;
              cursor: default;
              user-select: none;
              &:hover {
                background-color: #3498db;
                color: #fff;
              }
            }
            &.active {
              a {
                background-color: #3498db;
                border: 1px solid #3498db;
                color: #fff;
              }
            }
          }
        }
      }
    }
  }
}
</style>
