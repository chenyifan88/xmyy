import WebTorrent from 'webtorrent'
import Promise from 'bluebird'
import store from '@/store'
import Axios from 'axios'

const fs = require('fs')

fs.access = Promise.promisify(fs.access)
fs.unlink = Promise.promisify(fs.unlink)

function BT(opts) {
  this.downloadPath = localStorage.getItem('bt_download_path') || 'C:/xmyy_downloads'
  this.client = new WebTorrent(Object.assign({
    maxConns: 1000
  }, opts))
  this.client.on('error', err => {
    console.warn(err)
  })
}

BT.prototype.createTask = function (resourceItem, movieDownLoadData, seriesIndex, clarityIndex) {
  function analyze_sitesUrl(sitesUrl) {
    let torrentId = sitesUrl, trackers = []
    if (sitesUrl.indexOf('&')) {
      let splits = sitesUrl.split('&')
      torrentId = splits[0]
      for (let i = 1; i < splits.length; i++) {
        trackers.push(decodeURIComponent(splits[i].split('=')[1]))
      }
    }
    return {
      torrentId, trackers
    }
  }
  let task = Object.assign({
    name: resourceItem.name,
    progress: '0%',
    speed: '解析种子...',
    status: 1, // 1是正在下载 0是暂停 2是正在停止下载 3是下载完成
    size: '正在计算文件大小...',
    path: '',
    sitesUrl: resourceItem.sitesUrl,
    type: '未知',
    canPlay: false
  }, analyze_sitesUrl(resourceItem.sitesUrl))

  if (movieDownLoadData && typeof seriesIndex != 'undefined' && typeof clarityIndex != 'undefined') {
    task.type = movieDownLoadData[seriesIndex].clarity[clarityIndex].clarityName
  }
  return task
}

BT.prototype.addTorrent = function (task) {
  return new Promise((resolve, reject) => {
    if (this.client.get(task.torrentId)) return reject(new Error('下载任务已经在列表中'))
    Axios.get('https://raw.githubusercontent.com/ngosang/trackerslist/master/trackers_all_ip.txt').then(res => {
      let announce = res.data.split('\n\n')
      announce = task.trackers.concat(announce)
      for (let i = 0; i < announce.length; i++) {
        if (!new RegExp(/(\w+):\/\/([^/:]+)(:\d*)?/).test(announce[i])) {
          announce.splice(i, 1)
        } else {
          if (announce[i].indexOf('announce') == -1) {
            if (announce[i].charAt(announce[i].length - 1) == '/') {
              announce[i] += 'announce'
            } else {
              announce[i] += '/announce'
            }
          }
        }
      }
      let torrent = this.client.add(task.torrentId, {
        path: this.downloadPath,
        announce: announce
        // maxWebConns: 60
      })
      console.log(task)
      console.log(torrent)
      store.commit('addBtTask', task)
      torrent.on('infoHash', () => {
        console.log('infoHash')
      })
      torrent.on('metadata', () => {
        console.log('metadata')
        let totalLength = 0
        torrent.files.forEach(f => {
          totalLength += f.length
        })
        store.commit('updateBtTask', Object.assign({}, task, {
          size: this.convertBytes(totalLength),
          path: torrent.path + '\\' + torrent.name,
          canPlay: true
        }))
      })
      torrent.on('done', () => {
        console.log('done')
        store.commit('updateBtTask', Object.assign({}, task, {
          status: 3
        }))
      })
      return resolve(torrent)
    })
  })
}

BT.prototype.removeTorrent = function (task) {
  let torrent = this.client.get(task.torrentId)
  // 这个版本暂时只删除种子及任务，不删除文件
  if (torrent) {
    this.client.remove(task.torrentId, err => {
      if (err) throw err
      store.commit('removeBtTask', task)
    })
  } else {
    store.commit('removeBtTask', task)
  }
  // if (torrent) {
  //   this.client.remove(task.torrentId, err => {
  //     if (err) throw err
  //     fs.access(task.path, fs.constants.R_OK | fs.constants.W_OK).then(() => {
  //       fs.unlink(task.path)
  //       store.commit('removeBtTask', task)
  //     }).catch(err => {
  //       console.warn(err)
  //     })
  //   })
  // } else {
  //   fs.access(task.path, fs.constants.R_OK | fs.constants.W_OK).then(() => {
  //     fs.unlink(task.path)
  //     store.commit('removeBtTask', task)
  //   }).catch(err => {
  //     console.warn(err)
  //   })
  // }
}

BT.prototype.pause = function (task) {
  store.commit('updateBtTask', Object.assign({}, task, {
    status: 2
  }))
  let torrent = this.client.get(task.torrentId)
  torrent.pause()
  if (!torrent._removedPeers) torrent._removedPeers = {}
  for (let i in torrent._peers) {
    torrent._removedPeers[i] = true
    torrent.removePeer(i)
  }
  setTimeout(() => {
    store.commit('updateBtTask', Object.assign({}, task, {
      status: 0
    }))
  }, 8000)
}

BT.prototype.resume = function (task) {
  store.commit('updateBtTask', Object.assign({}, task, {
    status: 1
  }))
  let torrent = this.client.get(task.torrentId)
  if (torrent) {
    torrent.resume() // 先恢复下载，再添加peer
    for (let i in torrent._removedPeers) {
      torrent.addPeer(i)
    }
  } else {
    this.addTorrent(task)
  }
}

BT.prototype.getPlayFiles = function (torrentId) {
  let torrent = this.client.get(torrentId)
  if (torrent) return torrent.files
}

BT.prototype.convertBytes = function (bytes) {
  let val = bytes / Math.pow(1024, 3)
  if (val >= 1) {
    return parseFloat(val).toFixed(2) + 'GB'
  } else {
    val = bytes / Math.pow(1024, 2)
    if (val >= 1) {
      return parseFloat(val).toFixed(2) + 'MB'
    } else {
      val = bytes / 1024
      if (val >= 0.1) {
        return parseFloat(val).toFixed(2) + 'KB'
      } else {
        return bytes + 'B'
      }
    }
  }
}

BT.prototype.getTorrentDownloadInfo = function (task) {
  let torrent = this.client.get(task.torrentId)
  if (!torrent) return
  return {
    progress: parseFloat(torrent.progress * 100).toFixed(2) + '%',
    speed: this.convertBytes(torrent.downloadSpeed) + '/s'
  }
}

export default BT
