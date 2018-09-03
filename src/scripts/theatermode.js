var enableTheaterMode

/*
*   Start variables to be added if necessery
*/

var head = document.head
var link = document.createElement('link')
link.type = "text/css"
link.rel = "stylesheet"
link.href = chrome.extension.getURL("styles/theatermode.css")

chrome.storage.sync.get(['enableTheaterMode'], function(result){
  enableTheaterMode = result.enableTheaterMode
  if(enableTheaterMode){
    head.appendChild(link)
  }
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("theater mode on message")
  if(request.enableTheaterModeToggle){
    chrome.storage.sync.get(['enableTheaterMode'], function(result){
      enableTheaterMode = result.enableTheaterMode
      if(enableTheaterMode){
        head.appendChild(link)
      } else {
        head.removeChild(link)
        document.webkitCancelFullScreen()
      }
    })
  }
})

console.log("lol")