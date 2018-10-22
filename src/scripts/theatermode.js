import { storageVars } from "./constants";
import storage from "./utils/storage";

//This runs on the masterani page
module.exports = () => {
  let enableTheaterMode

  /*
  *   Start variables to be added if necessery
  */

  let head = document.head
  let link = document.createElement('link')
  link.type = "text/css"
  link.rel = "stylesheet"
  link.href = chrome.extension.getURL("styles/theatermode.css")

  console.log('woah')

  storage.get([storageVars.theaterMode], function(result){
    enableTheaterMode = result[storageVars.theaterMode]
    console.log('enbla ', enableTheaterMode)
    if(enableTheaterMode){
      toggleThMode(true)
    }
  })

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("theater mode on message")
    if(request.enableTheaterModeToggle){
      storage.get([storageVars.theaterMode], function(result){
        enableTheaterMode = result[storageVars.theaterMode]
        if(enableTheaterMode){
          toggleThMode(true)
        } else {
          toggleThMode(false)
        }
      })
    }
  })

  function toggleThMode(activate) {
    if(activate){
      head.appendChild(link)
    }
    else{
      head.removeChild(link)
      document.webkitCancelFullScreen()
    }
  }
}