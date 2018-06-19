<template>
  <div class="download-resource">
    <!-- 季数开始 -->
    <div class="season-details" v-if="movieDownLoadData.length > 1">
      <ul>
        <li v-for="(item,index) of movieDownLoadData" :key="item.index" :class="{active: currentSeriesIndex == index}" @click="toggleIndex('series',index)">{{item.seriesName}}</li>
      </ul>
    </div>
    <!-- 季数end -->

    <!-- 清晰度开始 -->
    <div class="clarity-type-detail">
      <ul>
        <li v-for="(item,index) of clarityData" :key="item.index" :class="{active: currentClarityIndex == index}" @click="toggleIndex('clarity',index)">{{item.clarityName}}</li>
      </ul>
    </div>
    <!-- 清晰度结束 -->

    <!-- 链接的类型：磁力，迅雷，电驴 -->
    <div class="link-type">
      <div class="type-detail">
        <ul>
          <li v-for="(item,index) of linkTypeData" :key="item.index" :class="{active: currentLinkTypeIndex == index}" @click="toggleIndex('linkType',index)">{{item.typeName}}</li>
        </ul>
      </div>
      <div class="do-select">
        <ul>
          <li @click="copyAllLinks">批量复制</li>
          <template v-if="downLoadType == '磁力链接'">
            <li>
              <input type="checkbox" value="全选" v-model="selectAll" id="select-all" />
              <label for="select-all">全选</label>
            </li>
          </template>
          <template v-if="checkedList.length !== 0">
            <li @click="canCleAll">清除</li>
            <li @click="downloadAll">下载</li>
          </template>
        </ul>
      </div>
    </div>

    <!-- 下载地址 -->
    <div class="download-sites">
      <div class="sites-item magnet-links">
        <div class="one-links" v-for="item of downLoadLinks" :key="item.index" v-if="item.sitesUrl">
          <p class="sites-name">{{item.sitesName}}</p>
          <input v-if="downLoadType == '磁力链接'" type="checkbox" class="select-cur-site" :value="item" v-model="checkedList">
          <input class="sites-input-text" type="text" :value="item.sitesUrl">
          <div class="do-download">
            <!-- <a v-if="isMagnetLink(item.sitesUrl)" class="down-play" @click="downPlay(item)">边下边播</a> -->
            <a v-if="isMagnetLink(item.sitesUrl)" class="down-now" @click="download(item)">立即下载</a>
            <a v-else class="down-now" @click="copySingleLinks(item.sitesUrl)">复制链接</a>
          </div>
        </div>
      </div>
    </div>

  </div>
  <!-- 下载地址结束 -->
</template>

<script>
import { clipboard } from 'electron'
export default {
  name: 'downLoadMovie',
  props: {
    movieData: null
  },
  data() {
    return {
      movieDownLoadData: this.movieData.movieData,
      currentSeriesIndex: 0,
      currentClarityIndex: 0,
      currentLinkTypeIndex: 0,
      checkedList: []
    }
  },
  computed: {
    clarityData() {
      return this.movieDownLoadData[this.currentSeriesIndex].clarity
    },
    linkTypeData() {
      return this.movieDownLoadData[this.currentSeriesIndex].clarity[this.currentClarityIndex].linkType
    },
    downLoadType() {
      return this.movieDownLoadData[this.currentSeriesIndex].clarity[this.currentClarityIndex].linkType[this.currentLinkTypeIndex].typeName
    },
    downLoadLinks() {
      return this.movieDownLoadData[this.currentSeriesIndex].clarity[this.currentClarityIndex].linkType[this.currentLinkTypeIndex].links
    },
    selectAll: {
      get() {
        return this.checkedList.length === this.downLoadLinks.length
      },
      set(value) {
        if (value) {
          this.checkedList = this.downLoadLinks.map(item => {
            return this.copyObject(item)
          })
        } else {
          this.checkedList = []
        }
      }
    }
  },
  methods: {
    toggleIndex(type, index) {
      this.canCleAll()
      if (type == 'series') {
        this.currentClarityIndex = 0
        this.currentLinkTypeIndex = 0
        this.currentSeriesIndex = index
      } else if (type == 'clarity') {
        this.currentLinkTypeIndex = 0
        this.currentClarityIndex = index
      } else if (type == 'linkType') {
        this.currentLinkTypeIndex = index
      }
    },
    isMagnetLink(link) {
      let reg = /magnet/i
      return reg.test(link)
    },
    canCleAll() {
      this.checkedList = []
    },
    downPlay(item) {
      this.download(item, true)
    },
    download(item, needPlay) {
      let task = this.$bt.createTask(item, this.movieDownLoadData, this.currentSeriesIndex, this.currentClarityIndex)
      this.$bt.addTorrent(task).then(() => {
        this.$message('添加下载任务成功', 'success')
      }).catch(err => {
        this.$message(err.message, 'error')
      })
      if (needPlay) {
        this.$router.push({
          name: 'downPlay',
          params: {
            torrentId: task.torrentId
          }
        })
      }
    },
    copySingleLinks(sitesUrl) {
      clipboard.writeText(sitesUrl)
      this.$message('已复制到剪贴板', 'success')
    },
    copyAllLinks() {
      let curDownItems = this.downLoadLinks
      let links = []
      curDownItems.forEach(ele => {
        links.push(ele.sitesUrl)
      })
      clipboard.writeText(links.join('\n'))
      this.$message('批量复制链接成功', 'success')
    },
    downloadAll() {
      let curDownItems = this.checkedList
      if (curDownItems == 0) {
        return
      }
      for (let i = 0; i < curDownItems.length; i++) {
        this.download(curDownItems[i])
      }
    },
    copyObject(Object) {
      return JSON.parse(JSON.stringify(Object))
    }
  },
  mounted() {
  }
}
</script>

<style lang="less">
// 下载，边下边播
.download-resource {
  padding: 10px 40px;
  .season-details {
    border-bottom: 1px solid #eaecef;
    padding-bottom: 10px;
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      li {
        padding: 8px 14px;
        font-size: 14px;
        margin-bottom: 6px;
        cursor: default;
        &.active {
          background-color: #3498db;
          color: #fff;
          border-radius: 4px;
          &:hover {
            color: #fff;
          }
        }
        &:hover {
          color: #3498db;
        }
      }
    }
  }
  .clarity-type-detail {
    margin-top: 12px;
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      cursor: default;
      li {
        padding: 8px 14px;
        font-size: 14px;
        margin-bottom: 6px;
        border: 1px solid #eaecef;
        margin-left: -1px;
        &.active {
          background-color: #3498db;
          color: #fff;
          border-radius: 4px;
          &:hover {
            color: #fff;
          }
        }
        &:hover {
          color: #3498db;
        }
      }
    }
  }
  .link-type {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    padding: 0 40px;
    .type-detail {
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          padding: 8px 14px;
          font-size: 14px;
          border: 1px solid #ccc;
          margin-right: 10px;
          border-radius: 4px;
          &.active {
            background-color: #3498db;
            color: #fff;
          }
        }
      }
    }
    .do-select {
      ul {
        display: flex;
        li {
          padding: 8px 14px;
          background-color: #3498db;
          color: #fff;
          border-radius: 4px;
          font-size: 14px;
          margin-left: 12px;
          input,
          label {
            vertical-align: middle;
          }
          &:active {
            background-color: #2980b9;
          }
        }
      }
    }
  }
  // 下载地址
  .download-sites {
    padding: 0 40px;
    margin-top: 30px;
    .sites-item {
      .one-links {
        display: flex;
        height: 36px;
        line-height: 36px;
        margin-bottom: 14px;
        &:last-child {
          margin-bottom: 0;
        }
        .sites-name {
          width: 100px;
          height: 36px;
          overflow: hidden;
          text-align: center;
          margin-right: 8px;
          font-size: 15px;
        }
        .select-cur-site {
          height: 36px;
          margin-right: 10px;
        }
        .sites-input-text {
          flex: 1;
          padding: 0 20px;
          border: 1px solid #ccc;
          font-size: 14px;
        }
        .do-download {
          margin-left: 20px;
          font-size: 0;
          a {
            display: inline-block;
            padding: 0 10px;
            font-size: 14px;
            background-color: #3498db;
            color: #fff;
            border-radius: 2px;
            &.down-play {
              margin-right: 10px;
              background-color: #d9534f;
            }
          }
        }
      }
    }
  }
}
</style>
