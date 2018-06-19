<template>
  <div class="header-bar" style="-webkit-app-region: drag;">
    <router-link to="/" class="logo">
      <img src="../assets/images/logo.png" />
    </router-link>
    <div class="bar-btns">
      <span class="minimize" @click="minimize" title="最小化">
        <i class="iconfont">&#xe60c;</i>
      </span>
      <span class="close" @click="close" title="关闭">
        <i class="iconfont">&#xe6c2;</i>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'headerBar',
  data() {
    return {}
  },
  methods: {
    minimize() {
      this.$ipc.send('minimize-main-window')
    },
    close() {
      this.$ipc.send('close-main-window')
    }
  },
  mounted() {
  }
}
</script>

<style lang="less">
.header-bar {
  background-color: #000000;
  display: flex;
  justify-content: space-between;
  height: 50px;
  .logo {
    display: block;
    padding: 5px 0 0 20px;
    user-select: none;
    -webkit-app-region: no-drag;
    img {
      display: block;
      height: 40px;
      box-sizing: border-box;
    }
  }
  .bar-btns {
    color: #fff;
    display: flex;
    align-items: center;
    padding-right: 20px;
    span {
      width: 40px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      user-select: none;
      -webkit-app-region: no-drag;
      i {
        font-size: 14px;
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
  .seach-movie {
    width: 240px;
    height: 36px;
    position: relative;
    background-color: #fff;
    margin-top: 9px;
    margin-right: 20px;
    border-radius: 2px;
    display: flex;
    .input-search {
      width: 200px;
      height: 36px;
      line-height: 36px;
      padding: 0 10px;
      border-radius: 2px;
      font-size: 14px;
    }
    .input-btn {
      width: 40px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      i {
        color: #999;
      }
    }
  }
}
</style>
