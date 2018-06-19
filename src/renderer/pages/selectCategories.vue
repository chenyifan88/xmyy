<template>
  <div class="select-categories">

    <div class="cat-item" v-for="item of listData" :key="item.index">
      <p class="cat-title">{{item.bigCatName}}</p>
      <div class="cat-details">
        <ul>
          <li v-for="smItem of item.smallCatData" :key="smItem.index">
            <!-- <a href="">{{smItem.smallCatName}}</a> -->
            <router-link :to="'/category/'+ item.bigCatName + '/' + smItem.smallCatName">{{smItem.smallCatName}}</router-link>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'selectCategories',
  data() {
    return {
      listData: null
    }
  },
  methods: {
    fetchData() {
      this.$http.get('category').then(this.handleData)
    },
    handleData(res) {
      if (res) {
        this.listData = res
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
.select-categories {
  padding: 46px 100px 0;
  .cat-item {
    margin-bottom: 24px;
    .cat-title {
      line-height: 40px;
      border-bottom: 1px solid #eeeeee;
      padding-left: 20px;
      font-size: 20px;
    }
    .cat-details {
      margin-top: 10px;
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          a {
            display: block;
            padding: 8px 20px;
          }
        }
      }
    }
  }
}
</style>

