import { storageVars } from "./constants";
import storage from "./utils/storage";
import ext from "./utils/ext";

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
  link.href = ext['extension'].getURL("styles/theatermode.css")
  
  storage.get([storageVars.theaterMode], function(result){
    enableTheaterMode = result[storageVars.theaterMode]
    if(enableTheaterMode){
      toggleThMode(true)
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