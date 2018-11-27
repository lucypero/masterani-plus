const apis = [
  'runtime',
  'storage',
  'extension'
]

function Extension () {
  const _this = this

  apis.forEach(function (api) {
    // @if extension='chrome'
    _this[api] = chrome[api]
    // @endif
    // @if extension='firefox'
    _this[api] = browser[api]
    // @endif
  })
}

export default new Extension()