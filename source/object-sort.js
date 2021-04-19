const sortByKey = object => Object(object) !== object || Array.isArray(object)
  ? object
  : Object.keys(object).sort().reduce((acc, key) => ({ ...acc, [key]: sortByKey(object[key]) }), {})

module.exports = {
  sortByKey
}
