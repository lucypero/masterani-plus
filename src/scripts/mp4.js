// This is the script that runs inside the video iframe on materani

import { storageVars, masteraniURL, messageHash } from './constants'
import storage from './utils/storage'
import { encryptMsg } from './utils/utils'

// just testing
// window.parent.postMessage('injected :thumbsup:', masteraniURL)

/*  AUTOPLAY FEATURE - START  */
// console.log('url current page:', window.location.href);

// Checking if we're on mp4upload
if (/^https:\/\/www\.mp4upload\.com\/embed.*/.test()) {
  implementAutoplay()
}

function implementAutoplay () {
  let enableAutoplay
  // video is the current HTML5 video tag
  let video = document.getElementsByClassName('jw-video')[0]
  if (!video) { return }

  /*
  *   Recieve extensions data on enableAutoplay, a boolean based on popup.html checkbox
  */
  storage.get([storageVars.autoplay], function (result) {
    enableAutoplay = result[storageVars.autoplay]
    if (enableAutoplay)
      video.play()
  })

  /*
  *   addEventListener to the video, fires when video ends. If autoplay is true,
  *   will fire a message to background.js that triggers autoplay.js
  */
  video.addEventListener('ended', function () {
    if (enableAutoplay) { window.parent.postMessage('video ended', masteraniURL) }
  }, false)
}

/*  AUTOPLAY FEATURE - END  */

/* INACTIVITY DETECTION - START */

document.addEventListener('mousemove', () => {
  window.parent.postMessage(encryptMsg('mousemove', messageHash), masteraniURL)
})
document.addEventListener('keypress', () => {
  window.parent.postMessage(encryptMsg('keypress', messageHash), masteraniURL)
})

/* INACTIVITY DETECTION - END */

/* KEYDOWN REGISTRATION - START */

document.addEventListener('keydown', (e) => {
  window.parent.postMessage({
    type: encryptMsg('keydown', messageHash),
    value: {
      key: e.key,
      keyCode: e.keyCode,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey
    }
  }, masteraniURL)
})

/* KEYDOWN REGISTRATION - END */
