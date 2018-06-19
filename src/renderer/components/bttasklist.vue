<template>
  <div class="bttask-list">
    <div class="hd">
      <!-- <div class="check"><input type="checkbox"></div> -->
      <div class="name">名称</div>
      <div class="size">大小</div>
      <div class="type">类型</div>
      <template v-if="listType == 'downloading'">
        <div class="progress">下载进度</div>
        <div class="speed">当前速度</div>
      </template>
      <div class="func">操作</div>
    </div>
    <div class="bd">
      <div class="bttask" v-for="task in tasks" :key="task.torrentId">
        <!-- <div class="check"><input type="checkbox"></div> -->
        <div class="name">
          <p class="text-ellip" :title="task.name">{{task.name}}</p>
        </div>
        <div class="size">{{task.size}}</div>
        <div class="type">{{task.type}}</div>
        <template v-if="listType == 'downloading'">
          <div class="progress">
            <div class="progress-bar">
              <span class="bar" :style="{width: task.progress}"></span>
              <span class="percent">{{task.progress}}</span>
            </div>
          </div>
          <div class="speed" v-if="task.status == 0">暂停中</div>
          <div class="speed" v-if="task.status == 1">
            <template v-if="task.speed != '0bytes/s'">
              {{task.speed}}
            </template>
            <template v-else>
              解析种子...
            </template>
          </div>
          <div class="speed" v-if="task.status == 2">暂停任务...</div>
        </template>
        <div class="func">
          <template v-if="listType == 'downloading'">
            <i v-if="task.status == 0" class="iconfont resume" v-html="'&#xe601;'" title="继续下载" @click="$bt.resume(task)"></i>
            <i v-if="task.status == 1" class="iconfont pause" v-html="'&#xe7d2;'" title="暂停" @click="$bt.pause(task)"></i>
            <i v-if="task.status == 2" class="iconfont pause" style="opacity: .5" v-html="'&#xe7d2;'" title="暂停"></i>
            <i class="iconfont delete" v-html="'&#xe624;'" title="删除" @click="$bt.removeTorrent(task)"></i>
            <i class="iconfont play" v-html="'&#xe668;'" title="边下边播" @click="play(task)"></i>
          </template>
          <template v-else>
            <i class="iconfont resume" v-html="'&#xe601;'" title="播放" @click="play(task)"></i>
            <i class="iconfont" v-html="'&#xe7aa;'" title="打开所在目录" @click="showItemInFolder(task)"></i>
            <i class="iconfont delete" v-html="'&#xe624;'" title="删除" @click="$bt.removeTorrent(task)"></i>
          </template>
        </div>
      </div>
    </div>
    <div class="ft">
      <!-- <template v-if="listType == 'downloading'">
        <a @click="batchPause">批量暂停</a>
        <a @click="batchResume">批量下载</a>
      </template>
      <a @click="batchDel">批量删除</a> -->
      <a @click="selectDownloadDir">设置下载目录</a>
    </div>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'

const { dialog } = require('electron').remote
const { shell } = require('electron')

let refreshDownloadingTasksTimer

export default {
  props: ['listType'],
  data() {
    return {
      tasks: []
    }
  },
  computed: {
    ...mapGetters(['downloadingBtTasks', 'downloadedBtTasks'])
  },
  watch: {
    downloadingBtTasks() {
      this.updateTasks()
    },
    downloadedBtTasks() {
      this.updateTasks()
    }
  },
  mounted() {
    this.updateTasks()
    this.$root.broadcast('App', 'page-loaded')
    this.startRefreshDownloadingTasks()
  },
  beforeDestroy() {
    clearInterval(refreshDownloadingTasksTimer)
  },
  methods: {
    updateTasks() {
      this.tasks = this.listType == 'downloading' ? this.downloadingBtTasks : this.downloadedBtTasks
    },
    startRefreshDownloadingTasks() {
      if (this.listType == 'downloading') {
        if (typeof refreshDownloadingTasksTimer != 'undefined') clearInterval(refreshDownloadingTasksTimer)
        refreshDownloadingTasksTimer = setInterval(() => {
          for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].progress != '100%') {
              let info = this.$bt.getTorrentDownloadInfo(this.tasks[i])
              if (typeof info != 'undefined') {
                this.$store.commit('updateBtTask', Object.assign({}, this.tasks[i], info))
              }
            }
          }
        }, 1000)
      }
    },
    play(task) {
      if (task.status == 0) {
        this.$bt.resume(task)
      }
      this.$router.push({
        name: 'downPlay',
        params: {
          torrentId: task.torrentId
        }
      })
    },
    selectDownloadDir() {
      dialog.showOpenDialog({
        defaultPath: this.$bt.downloadPath,
        properties: ['openDirectory', 'createDirectory']
      }, filePaths => {
        if (filePaths) {
          this.$bt.downloadPath = filePaths[0]
          localStorage.setItem('bt_download_path', this.$bt.downloadPath)
        }
      })
    },
    showItemInFolder(task) {
      shell.showItemInFolder(task.path)
    },
    batchPause() {

    },
    batchResume() {

    },
    batchDel() {

    }
  }
}
</script>

<style lang="less">
.bttask-list .hd,
.bttask {
  display: flex;
  font-size: 14px;
  & > div {
    display: flex;
    flex: 1;
    padding: 8px 12px;
    align-items: center;
    justify-content: flex-start;
  }
  .name {
    flex: 5;
    max-width: 320px;
  }
  .func {
    flex: 3;
  }
  .size {
    flex: 2;
  }
}
.bttask-list {
  overflow: hidden;
  & > .hd {
    background-color: #eee;
    color: #333;
    font-weight: bold;
    border-top: #ddd 1px solid;
    position: absolute;
    width: 100%;
    z-index: 9;
    & > div {
      border-right: #ddd 1px solid;
      &:last-child {
        border-right: 0;
      }
    }
  }
  & > .bd {
    margin-top: 31px;
    margin-bottom: 46px;
  }
  & > .ft {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 10px;
    text-align: right;
    font-size: 14px;
    background-color: #eee;
    z-index: 9;
    & > a {
      display: inline-block;
      padding: 5px 16px;
      font-size: 12px;
      background-color: #3498db;
      color: white;
      border: royalblue 1px solid;
      margin: 0 10px;
    }
  }
  .bttask {
    font-size: 13px;
    &:hover {
      background-color: #efefef;
    }
    .progress-bar {
      position: relative;
      border: #999 1px solid;
      border-radius: 5px;
      overflow: hidden;
      width: 100%;
      text-align: center;
      font-size: 10px;
      padding: 2px 0;
      & > .bar {
        position: absolute;
        left: 0;
        top: 0;
        display: block;
        height: 100%;
        background-color: greenyellow;
      }
      & > .percent {
        position: relative;
        z-index: 3;
      }
    }
    .iconfont {
      font-size: 16px;
      margin-right: 10px;
      &.delete {
        position: relative;
        font-size: 17px;
        top: 1px;
      }
    }
  }
}
</style>
