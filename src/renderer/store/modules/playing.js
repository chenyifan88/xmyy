const state = {
  playSrc: '',
  playState: false
}

const mutations = {
  savePlaySrc(state, src) {
    state.playSrc = src
  },
  changePlayState(state, value) {
    state.playState = value
  }
}

export default {
  state,
  mutations
}
