const state = {
  collectionMovies: JSON.parse(localStorage.getItem('collectionMovies')) || []
}

const mutations = {
  addCollectionMovies(state, movies) {
    state.collectionMovies.unshift(movies)
  },
  removeCollectionMovies(state, movieIndex) {
    state.collectionMovies.splice(movieIndex, 1)
  },
  clearCollectionMovies(state) {
    state.collectionMovies = []
  }
}

export default {
  state,
  mutations
}
