<template>
  <div id="dplayer"></div>
</template>

<script>
import { mapState } from 'vuex'
import DPlayer from 'dplayer'
import Promise from 'bluebird'

const fs = require('fs')

fs.stat = Promise.promisify(fs.stat)

let getMovieFileTimer
let vodTypes = ['avi', 'wmv', 'mpeg', 'mp4', 'mov', 'mkv', 'flv', 'f4v', 'm4v', 'rmvb', 'rm', '3gp', 'dat', 'ts', 'mts', 'vob']

export default {
  name: 'downPlay',
  data() {
    return {
      currentTask: null,
      dplayer: null
    }
  },
  computed: {
    ...mapState({
      btTasks: state => state.bt.btTasks
    })
  },
  mounted() {
    this.dplayer = new DPlayer({
      container: document.getElementById('dplayer')
    })
    this.dplayer.on('durationchange', () => {
      this.$message('如果出现视频无声音的情况，请打开下载目录，选择使用播放软件播放！', 'info')
    })
    this.dplayer.on('canplay', () => {
      this.dplayer.play()
    })
    this.dplayer.on('error', () => {
      this.$message('该视频不支持边下边播，请下载完成后再播放！', 'error')
    })
    this.currentTask = this.btTasks.filter(task => {
      return task.torrentId == this.$route.params.torrentId
    })[0]
    this.getMovieFile()
  },
  beforeDestroy() {
    if (typeof getMovieFileTimer != 'undefined') clearTimeout(getMovieFileTimer)
  },
  methods: {
    getMovieFile() {
      if (this.currentTask.status == 3) {
        fs.stat(this.currentTask.path).then(stats => {
          let url
          if (stats.isDirectory()) {
            url = this.currentTask.path + '\\' + this.currentTask.name
          } else {
            url = this.currentTask.path
          }
          this.dplayer.switchVideo({
            url: url
          })
          this.$root.broadcast('App', 'page-loaded')
        }).catch(() => {
          this.$message('找不到任务对应的视频文件，下载的文件已被移动或者删除！', 'error')
        })
      } else {
        let files = this.$bt.getPlayFiles(this.$route.params.torrentId)
        if (files && files.length != 0) {
          let file
          files.forEach(f => {
            if (!file) {
              vodTypes.forEach(v => {
                if (f.name.endsWith('.' + v)) {
                  file = f
                }
              })
            }
          })
          if (!file) {
            setTimeout(() => {
              this.getMovieFile()
            }, 5000)
          } else {
            console.log(file)
            file.renderTo('.dplayer-video', {
              maxBlobLength: Math.pow(1024, 3) * 20
            }, (err, elem) => {
              console.log(err)
            })
            this.$root.broadcast('App', 'page-loaded')
          }
        } else {
          setTimeout(() => {
            this.getMovieFile()
          }, 5000)
        }
      }
    }
  }
}
</script>

<style lang="less">
#dplayer {
  height: 100%;
}
</style>
