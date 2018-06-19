<template>
  <div class="nav-content clearfix">
    <ul class="navs">
      <li class="download-app">
        <router-link to="/app">下载APP</router-link>
      </li>
      <li class="playing-now" :class="{active:playing}" v-if="curPlaySrc !== ''">
        <router-link :to="curPlaySrc">
          <i class="iconfont" v-html="'&#xe601;'"></i> 正在播放
        </router-link>
      </li>
      <template v-for="(item,index) of navList">
        <li :key="item.index" :class="{current: activeIndex == index}" v-if="item.navPath !== ''">
          <router-link :to="item.navPath">
            <i class="iconfont" v-html="item.icon"></i> {{item.navName}}
            <template v-if="item.navName == '正在下载'"> ({{$store.getters.downloadingBtTasks.length}})</template>
            <template v-if="item.navName == '下载完成'"> ({{$store.getters.downloadedBtTasks.length}})</template>
          </router-link>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'navigator',
  data() {
    return {
      activeIndex: null,
      playing: false,
      navList: [
        {
          navName: '我的收藏',
          navPath: '/collection',
          icon: '&#xe7a7;'
        },
        {
          navName: '首页',
          navPath: '/index',
          icon: '&#xe734;'
        },
        {
          navName: '电影',
          navPath: '/category/电影',
          icon: '&#xe622;'
        },
        {
          navName: '电视剧',
          navPath: '/category/电视剧',
          icon: '&#xe62c;'
        },
        {
          navName: '动漫',
          navPath: '/category/动漫',
          icon: '&#xe614;'
        },
        {
          navName: '综艺',
          navPath: '/category/综艺',
          icon: '&#xe615;'
        },
        {
          navName: '分类',
          navPath: '/selectCategories',
          icon: '&#xe65c;'
        },
        {
          navName: '正在下载',
          navPath: '/downloading',
          icon: '&#xe62a;'
        },
        {
          navName: '下载完成',
          navPath: '/downloaded',
          icon: '&#xea7d;'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      curPlaySrc: state => state.playing.playSrc
    })
  },
  watch: {
    '$route'() {
      this.playing = false
      this.isCurrent()
    }
  },
  methods: {
    isCurrent() {
      let bigCat = this.$route.params.catid
      if (bigCat) {
        switch (this.$route.params.catid) {
          case '电影':
            this.activeIndex = 2
            break
          case '电视剧':
            this.activeIndex = 3
            break
          case '动漫':
            this.activeIndex = 4
            break
          case '综艺':
            this.activeIndex = 5
            break
        }
      } else if (this.$route.name == 'collection') {
        this.activeIndex = 0
      } else if (this.$route.name == 'index') {
        this.activeIndex = 1
      } else if (this.$route.name == 'selectCategories') {
        this.activeIndex = 6
      } else if (this.$route.name == 'downloading') {
        this.activeIndex = 7
      } else if (this.$route.name == 'downloaded') {
        this.activeIndex = 8
      } else if (this.$route.name == 'play') {
        this.playing = true
      }
    }
  },
  mounted() {
    this.isCurrent()
  }
}
</script>

<style lang="less">
@maincolor: #3498db;
.nav-content {
  width: 200px;
  height: 100%;
  background-color: #eeeeee;
  border-right: #ddd 1px solid;
  .navs {
    padding: 10px 0;
    li {
      margin-top: 10px;
      &.current {
        background-color: #ccc;
      }
      &.download-app {
        text-align: center;
        margin-top: 10px;
        margin-bottom: 20px;
        &:hover {
          background-color: transparent;
        }
        a {
          border-radius: 4px;
          display: inline-block;
          background-color: #3498db !important;
          padding: 10px 20px;
          color: #fff;
          font-size: 14px;
          letter-spacing: 2px;
        }
      }
      &.playing-now {
        background-color: rgba(52, 152, 219, 0.8);
        a {
          color: #fff;
          &:hover {
            background-color: #3498db;
          }
        }
        &.active {
          background-color: rgba(52, 152, 219, 1);
        }
      }
      &:hover {
        background-color: #cccccc;
      }
      a {
        padding: 10px 0 10px 50px;
        display: block;
        color: #666;
        // &.router-link-active {
        //   background-color: #cccccc;
        // }
        cursor: default;
        i {
          font-size: 18px;
        }
      }
    }
  }
}
</style>
