<template>
  <div class="movie-detail">
    <div class="movie-info-container" v-if="movieData">
      <a class="movie-poster">
        <img v-lazy="movieData.movieImg" />
      </a>
      <div class="movie-infos">
        <div class="name-wrapper">
          <h2 class="movie-name text-ellip">{{movieData.movieName}}</h2>
          <collect-movies :movieData="movieData"></collect-movies>
        </div>
        <p class="movie-uptime text-ellip">更新：
          <span>{{movieData.updateTime}}</span>
        </p>
        <p class="movie-type text-ellip">
          <span v-if="movieData.movieType">类型：{{movieData.movieType}}</span>
          <span v-if="movieData.movieArea">地区：{{movieData.movieArea}}</span>
          <span v-if="movieData.movieYear">年份：{{movieData.movieYear}}</span>
          <span v-if="movieData.movieLanguage">语言：{{movieData.movieLanguage}}</span>
        </p>
        <p class="actors text-ellip">主演：
          <span>{{movieData.movieActors}}</span>
        </p>
        <p class="director text-ellip">导演：
          <span v-if="movieData.movieDirector">{{movieData.movieDirector}}</span>
          <span v-else>未知</span>
        </p>
        <p class="movie-desc text-ellip3">
          剧情：
          <span v-if="movieData.movieDesc">{{movieData.movieDesc}}</span>
          <span v-else>暂无</span>
        </p>
      </div>
    </div>

    <!-- 在线播放，选择集数 -->
    <select-series v-if="movieData && onlinePlay" :movieData="movieData"></select-series>

    <!-- 下载资源 -->
    <down-load-movie v-if="movieData && !onlinePlay" :movieData="movieData"></down-load-movie>

  </div>
</template>

<script>
import selectSeries from '@/components/selectSeries'
import downLoadMovie from '@/components/downLoadMovie'
import collectMovies from '@/components/collectMovies'
export default {
  name: 'detail',
  data() {
    return {
      movieData: null,
      // true 在线播放；false 资源下载
      onlinePlay: true,
      onlineTag: this.$route.params.tag,
      currentMovieId: this.$route.params.movieid,
      currentSeriesIndex: 0,
      currentClarityIndex: 0,
      currentLinkTypeIndex: 0
    }
  },
  components: {
    selectSeries,
    downLoadMovie,
    collectMovies
  },
  methods: {
    fetchData() {
      let curReqUrl = '/detail/id-' + this.currentMovieId + '/tag-' + this.onlineTag
      this.$http.get(curReqUrl).then(this.handleData)
    },
    handleData(res) {
      if (res['movieData'].length !== 0) {
        this.movieData = res
        this.onlinePlay = res.onlinePlay
        this.$root.broadcast('App', 'page-loaded')
      } else {
        this.$message('本片信息缺失，请查看其他电影。', 'error')
        this.$root.broadcast('App', 'page-loaded')
      }
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>

<style lang="less">
.movie-detail {
  .movie-info-container {
    padding: 40px;
    padding-bottom: 20px;
    display: flex;
    flex-direction: row;
    .movie-poster {
      width: 190px;
      img {
        display: block;
        width: 190px;
        height: 285px;
      }
    }
    .movie-infos {
      width: 780px;
      padding: 0 30px;
      p {
        font-size: 15px;
        line-height: 30px;
        color: #999;
        padding-left: 0;
        span {
          color: #666;
        }
      }
      .name-wrapper {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .movie-name {
          font-size: 22px;
          line-height: 40px;
          font-weight: normal;
          margin: 0;
        }
      }
      .movie-uptime {
        margin-top: 16px;
      }
      .movie-type {
        span {
          margin-right: 20px;
        }
      }
      .director {
        span {
          width: 800px;
        }
      }
      .movie-desc {
        line-height: 25px;
      }
    }
    .movie-resource {
      padding: 20px;
      padding-left: 0;
      font-size: 0;
      a {
        font-size: 16px;
        display: inline-block;
        padding: 12px 20px;
        background-color: #3498db;
        letter-spacing: 1px;
        color: #fff;
        &.online-play {
          margin-right: 16px;
        }
        &.download-sites {
          background-color: #ff9900;
        }
        &.download-play {
          margin-right: 16px;
        }
      }
    }
  }
}
</style>
