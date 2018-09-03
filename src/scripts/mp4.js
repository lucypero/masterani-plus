var enableAutoplay
// video is the current HTML5 video tag
var video = document.getElementsByClassName('jw-video')[0]

/*
*   Recieve extensions data on enableAutoplay, a boolean based on popup.html checkbox
*/
chrome.storage.sync.get(['enableAutoplay'], function(result){
  enableAutoplay = result.enableAutoplay
  if(window != top && enableAutoplay){
    video.play()
  }
})

/*
*   Detect any changes in popup.html, this message is from background.js
*/
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.enableAutoplayToggle){
    chrome.storage.sync.get(['enableAutoplay'], function(result){
      enableAutoplay = result.enableAutoplay
    })
  }
})

/*
*   addEventListener to the video, fires when video ends. If autoplay is true,
*   will fire a message to background.js that triggers autoplay.js
*/
video.addEventListener('ended', function(e){
  if(enableAutoplay)
    chrome.runtime.sendMessage({action: "vidEnd"}, function(response) {})
}, false)
