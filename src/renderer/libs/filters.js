// exports.handleBreadcrumbTrail = function (value) {
//   if (value.name == 'search') {
//     return value.query.keyword ? '搜索结果 > ' + value.query.keyword : ''
//   } else if (value.name == 'list') {
//     return value.params.catid
//   } else if (value.name == 'smlist') {
//     return value.params.catid + ' > ' + value.params.smcat
//   }
// }
export default {
  handleBigCat(value) {
    if (value.name == 'search') {
      return value.query.keyword ? '搜索结果 > ' + value.query.keyword : ''
    } else {
      return ('> ' + value.params.catid)
    }
  },
  handleSamllCat(value) {
    return ('> ' + value.params.smcat)
  }
}
