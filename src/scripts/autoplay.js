import { getNextEpUrl } from './utils/masteraniUtils'

module.exports = () => {
  window.addEventListener('message', function (e) {
    if (e.data === 'video ended' && e.origin === 'https://mp4upload.com') {
      let newUrl = getNextEpUrl(document)
      if (newUrl) { window.location.href = newUrl }
    }
  })
}
