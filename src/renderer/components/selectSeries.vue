<template>
  <!-- 在线播放 -->
  <div class="select-play">
    <!-- 播放源 -->
    <div class="source">
      <ul>
        <li>在线播放源：</li>
        <li :class="{active:sourceActive == index}" v-for="(item,index) of movieOnlineData" :key="item.index" @click="toggleSourceIndex(index)">
          {{item.sourceCname}}
        </li>
      </ul>
    </div>
    <!-- 播放集数 -->
    <div class="series" v-if="currentSeriesData">
      <ul>
        <li v-for="(seriesItem,index) of currentSeriesData" :key="seriesItem.index" :class="{active: $route.params.seriesid == index}">
          <router-link :to="{ name: 'play', params: { movieid:currentMovieId, tag:currentMovieTag, sourceid:sourceActive, seriesid:index }}">{{seriesItem.name}}</router-link>
        </li>
      </ul>
    </div>
  </div>
  <!-- 在线播放end -->
</template>

<script>
export default {
  name: 'selectSeries',
  props: {
    movieData: Object
  },
  data() {
    return {
      sourceActive: 0,
      currentMovieTag: this.whichMovieTag(),
      currentMovieId: this.movieData.movieId,
      movieOnlineData: this.movieData['movieData']
    }
  },
  computed: {
    currentSeriesData() {
      if (!this.movieOnlineData) return []
      return this.movieOnlineData[this.sourceActive].seriesData
    }
  },
  methods: {
    toggleSourceIndex(index) {
      this.sourceActive = index
    },
    getSourceActive() {
      if (this.$route.params.sourceid) {
        this.sourceActive = this.$route.params.sourceid
      }
    },
    whichMovieTag() {
      return this.movieData.onlinePlay ? 2 : 1
    }
  },
  mounted() {
    this.getSourceActive()
  }
}
</script>

<style lang="less">
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
</style>
