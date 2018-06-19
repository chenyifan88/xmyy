<template>
  <div id="dplayer"></div>
</template>

<script>
import DPlayer from 'dplayer'
import Hls from 'hls.js'

function customHls(video, player) {
  const hls = new Hls()
  hls.loadSource(video.src)
  hls.attachMedia(video)
}

export default {
  name: 'player',
  props: {
    currentMovieUrl: String
  },
  data() {
    return {
      player: null
    }
  },
  watch: {
    currentMovieUrl() {
      this.player.switchVideo({
        url: this.currentMovieUrl,
        type: 'customHls',
        customType: {
          'customHls': customHls
        }
      })
    }
  },
  methods: {
    initPlayer() {
      this.player = new DPlayer({
        container: document.getElementById('dplayer'),
        autoplay: true,
        video: {
          url: this.currentMovieUrl,
          type: 'customHls',
          customType: {
            'customHls': customHls
          }
        }
      })
      this.player.on('canplay', () => {
        this.player.play()
      })
    }
  },
  mounted() {
    this.initPlayer()
  },
  beforeDestroy() {
    this.player.destroy()
  }
}
</script>
