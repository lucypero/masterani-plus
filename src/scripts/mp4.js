import { storageVars } from "./constants";
import storage from "./utils/storage";
import inactDetect from "./utils/inactivity";

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



inactDetect(2000,
  () => {
    window.parent.postMessage('user idle', "https://www.masterani.me/*")
  },
  () => {
    window.parent.postMessage('user active', "https://www.masterani.me/*")
  }
);