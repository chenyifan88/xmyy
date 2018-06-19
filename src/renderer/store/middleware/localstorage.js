const localStoragePlugin = store => {
  // called when the store is initialized
  store.subscribe((mutation, state) => {
    if (mutation.type == 'addBtTask' || mutation.type == 'removeBtTask' || mutation.type == 'updateBtTask') {
      localStorage.setItem('btTasks', JSON.stringify(state.bt.btTasks))
    }
    if (mutation.type == 'addCollectionMovies' || mutation.type == 'removeCollectionMovies' || mutation.type == 'clearCollectionMovies') {
      localStorage.setItem('collectionMovies', JSON.stringify(state.collection.collectionMovies))
    }
  })
}

export default localStoragePlugin
