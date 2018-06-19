<template>
  <div class="download-app" v-if="iosQRcode">
    <div class="android-app app-item">
      <img :src="iosQRcode" alt="android">
      <p>Android版</p>
    </div>
    <div class="ios-app app-item">
      <img :src="androidQRcode" alt="android">
      <p>iOS版</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'downApp',
  data() {
    return {
      iosQRcode: '',
      androidQRcode: '',
      firstStart: true
    }
  },
  methods: {
    fetchData() {
      this.$http.get('download').then(this.handleData)
    },
    handleData(res) {
      if (res) {
        this.iosQRcode = res.url_ios
        this.androidQRcode = res.url_android
        this.firstStart = false
        this.$root.broadcast('App', 'page-loaded')
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  activated() {
    if (!this.firstStart) {
      this.$root.broadcast('App', 'page-loaded')
    }
  }
}
</script>

<style lang="less">
.download-app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .app-item {
    &:first-child {
      margin-right: 40px;
    }
    img {
      display: block;
      width: 250px;
      height: 250px;
    }
    p {
      text-align: center;
      line-height: 40px;
    }
  }
}
</style>
