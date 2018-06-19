function broadcast(name, eventName, ...params) {
  this.$children.forEach(child => {
    var _name = child.$options.name

    if (_name === name) {
      child.$emit.apply(child, [eventName].concat(params))
    } else {
      broadcast.apply(child, [name, eventName].concat(params))
    }
  })
}
export default {
  methods: {
    dispatch(name, eventName, ...params) {
      var parent = this.$parent || this.$root
      var _name = parent.$options.name

      while (parent && (!name || _name !== name)) {
        parent = parent.$parent

        if (parent) {
          name = parent.$options.name
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params))
      }
    },
    broadcast(name, eventName, ...params) {
      broadcast.apply(this, [name, eventName].concat(params))
    }
  }
}
