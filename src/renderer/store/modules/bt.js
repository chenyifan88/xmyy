import lodash from 'lodash'

const state = {
  btTasks: JSON.parse(localStorage.getItem('btTasks')) || []
}

const getters = {
  downloadingBtTasks(state) {
    return lodash.filter(state.btTasks, t => {
      return t.status != 3
    })
  },
  downloadedBtTasks(state) {
    return lodash.filter(state.btTasks, t => {
      return t.status == 3
    })
  }
}

const mutations = {
  addBtTask(state, task) {
    for (let i = 0; i < state.btTasks.length; i++) {
      if (state.btTasks[i].torrentId == task.torrentId) {
        return console.log('task already in list')
      }
    }
    state.btTasks.push(task)
  },
  removeBtTask(state, task) {
    for (let i = 0; i < state.btTasks.length; i++) {
      if (state.btTasks[i].torrentId == task.torrentId) {
        state.btTasks.splice(i, 1)
        break
      }
    }
  },
  updateBtTask(state, task) {
    for (let i = 0; i < state.btTasks.length; i++) {
      if (state.btTasks[i].torrentId == task.torrentId) {
        state.btTasks[i] = Object.assign(state.btTasks[i], task)
        break
      }
    }
  }
}

const actions = {
}

export default {
  state,
  getters,
  mutations,
  actions
}
