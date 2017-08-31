var Objects = {
  merge: function (a, b) {
    if (typeof b === 'undefined' || b === null) {
      return a
    }
    if (typeof b !== 'object' || typeof a !== 'object') {
      return b
    }
    if (Array.isArray(a) || Array.isArray(b)) {
      return b
    }
    var target = {}
    Object.keys(a).forEach(function (key) {
      target[key] = a[key]
    })
    Object.keys(b).forEach(function (key) {
      target[key] = Objects.merge(target[key], b[key])
    })
    return target
  },
  copy: function (value) {
    if (typeof value !== 'object' || value === null) {
      return value
    }
    if (Array.isArray(value)) {
      return value.map(Objects.copy)
    }
    var target = {}
    Object.keys(value).forEach(function (key) {
      target[key] = Objects.copy(value[key])
    })
    return target
  }
}

module.exports = {
  Objects: Objects
}
