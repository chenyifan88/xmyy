<template>
  <div id="app">
    <header-bar v-if="isWindows"></header-bar>
    <div class="main-container" style="-webkit-app-region: no-drag;">
      <div class="nav-content-container">
        <navigator></navigator>
      </div>
      <div class="content-container">
        <div class="search-bar">
          <span class="back-btn" title="返回" @click="goBack">
            <i class="iconfont">&#xe600;</i>
          </span>
          <span class="refresh" title="刷新" @click="refresh">
            <i class="iconfont">&#xe938;</i>
          </span>
          <div class="search-container">
            <input type="text" placeholder="输入关键词, 敲回车搜索..." class="search-input" @keyup.enter="search" v-model="searchKeyWords">
            <i class="iconfont">&#xe669;</i>
          </div>
        </div>
        <div class="show-content">
          <div class="loading-container" v-show="pageLoading">
            <img class="loading-img" src="@/assets/images/loading.gif" />
          </div>
          <keep-alive include="play">
            <router-view :key="activeDate"></router-view>
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import headerBar from '@/components/headerBar'
import navigator from '@/components/navigator'
export default {
  name: 'App',
  data() {
    return {
      pageLoading: false,
      activeDate: 1,
      searchKeyWords: ''
    }
  },
  computed: {
    ...mapState({
      btTasks: state => state.bt.btTasks
    }),
    isWindows() {
      return process.platform == 'win32'
    }
  },
  components: {
    navigator,
    headerBar
  },
  methods: {
    goBack() {
      history.back()
    },
    refresh() {
      this.pageLoading = true
      this.activeDate = new Date().getTime()
    },
    search() {
      if (!this.searchKeyWords) {
        return this.$message('搜索关键词不能为空！', 'error')
      }
      this.$router.push({ name: 'search', query: { keyword: this.searchKeyWords } })
    },
    switchRouterAct() {
      this.$router.beforeEach((to, from, next) => {
        this.pageLoading = true
        next()
      })
    },
    initDownloader() {
      for (let i = 0; i < this.btTasks.length; i++) {
        if (this.btTasks[i].status == 1) {
          this.$bt.addTorrent(this.btTasks[i])
        } else if (this.btTasks[i].status == 2) {
          // 如果正在暂停任务的时候退出应用, 状态需重置为暂停状态
          this.$store.commit('updateBtTask', Object.assign({}, this.btTasks[i], {
            status: 0
          }))
        }
      }
    }
  },
  mounted() {
    this.switchRouterAct()
    this.initDownloader()
    // this.$on('page-loading', () => {
    //   this.pageLoading = true
    // })
    this.$on('page-loaded', () => {
      this.pageLoading = false
    })
    console.log(this.$route.fullPath)
  }
}
</script>

<style lang="less">
@import "./assets/css/reset.css";
@import "./assets/css/public.css";
@import "./assets/css/icon.css";
@import "./assets/fonts/iconfont.css";
@import "./assets/less/widget/movielist.less";
@import "../../node_modules/dplayer/dist/DPlayer.min.css";
@import "../../node_modules/element-ui/lib/theme-chalk/index.css";

/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 8px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background: #cdcece;
  // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
}
::-webkit-scrollbar-thumb:window-inactive {
  background: rgba(255, 0, 0, 0.4);
}

body {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: #000 1px solid;
}
#app {
  font-family: "Microsoft YaHei", Helvetica, Arial, sans-serif;
  display: flex;
  flex-direction: column;
  height: 100%;
  .main-container {
    display: flex;
    flex-direction: row;
    flex: 1;
    .nav-content-container {
      width: 200px;
    }
    .content-container {
      flex: 1;
      height: 100%;
      width: 100%;
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
      .show-content {
        height: 100%;
        padding-bottom: 30px;
        flex: 1;
        overflow: auto;
        .loading-container {
          width: 100%;
          height: 100%;
          position: absolute;
          background-color: rgba(0, 0, 0, 0.2);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999999;
          img {
            width: 50px;
            height: 50px;
          }
        }
      }
      .search-bar {
        height: 50px;
        line-height: 50px;
        background-color: #f0f0f0;
        display: flex;
        padding-left: 10px;
        > span {
          display: inline-block;
          padding: 0 16px;
          cursor: default;
          user-select: none;
          &:hover {
            opacity: 0.8;
          }
        }
        .search-container {
          margin-left: 20px;
          position: relative;
          .search-input {
            width: 240px;
            height: 30px;
            line-height: 30px;
            padding: 0 10px 0 34px;
            border-radius: 4px;
            border: 1px solid #ccc;
            font-size: 13px;
          }
          i {
            position: absolute;
            top: 0;
            left: 10px;
            user-select: none;
          }
        }
      }
    }
  }
}
body {
  background-color: #f8f8f8;
}
.swiper-button-next {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23ffffff'%2F%3E%3C%2Fsvg%3E");
}
.swiper-button-prev {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23ffffff'%2F%3E%3C%2Fsvg%3E");
}
.dplayer-menu {
  &.dplayer-menu-show {
    display: none!important;
  }
}
</style>
