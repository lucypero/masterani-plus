import { storageVars } from "./constants";
import storage from "./utils/storage";

var enableAutoplay
// video is the current HTML5 video tag
var video = document.getElementsByClassName('jw-video')[0]

/*
*   Recieve extensions data on enableAutoplay, a boolean based on popup.html checkbox
*/
storage.get([storageVars.autoplay], function(result){
  enableAutoplay = result[storageVars.autoplay]
  if(window != top && enableAutoplay){
    video.play()
  }
})

/*
*   Detect any changes in popup.html, this message is from background.js
*/
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.enableAutoplayToggle){
    storage.get([storageVars.autoplay], function(result){
      enableAutoplay = result[storageVars.autoplay]
    })
  }
})

window.parent.postMessage("hihi message from mp4.js", "https://www.masterani.me/*")




/*
*   addEventListener to the video, fires when video ends. If autoplay is true,
*   will fire a message to background.js that triggers autoplay.js
*/
if(!video)
  console.error('video not found')
else
  video.addEventListener('ended', function(e){
    if(enableAutoplay)
      window.parent.postMessage("video ended", "https://www.masterani.me/*")
  }, false)
