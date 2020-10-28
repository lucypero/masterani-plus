import { getNextEpUrl } from './utils/masteraniUtils'
import { decryptMsg } from './utils/utils';
import { messageHash } from './constants';

export default function autoPlay() {
  window.addEventListener('message', function (e) {
    if(e.origin !== 'https://mp4upload.com' || typeof(e.data) !== "string")
      return;
    let decrypted = decryptMsg(e.data, messageHash)
    if (decrypted && decrypted === 'video ended') {
      let newUrl = getNextEpUrl(document)
      if (newUrl) { window.location.href = newUrl }
    }
  })
}