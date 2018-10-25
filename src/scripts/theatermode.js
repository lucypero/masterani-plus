import { storageVars } from "./constants";
import storage from "./utils/storage";
import ext from "./utils/ext";
import mast from "./masteraniUtils";

//This runs on the masterani page
function afterContentLoad() {
  let enableTheaterMode
  let infoElement;
  let playerElem = document.querySelector('.ui.embed')

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

  addTopToggleButton();

  function toggleThMode(activate) {
    if(activate){
      head.appendChild(link)
      appendInfoDiv()
    }
    else{
      head.removeChild(link)
      if(infoElement && playerElem.contains(infoElement)){
        playerElem.removeChild(infoElement)
      }
      document.webkitCancelFullScreen()
    }
  }

  function addTopToggleButton() {
    let rightMenu = document.getElementById('navigation').querySelector(".right.menu")
    let aElem = document.createElement("a");
    let textNode = document.createTextNode("Toggle Theater Mode")
    aElem.appendChild(textNode);
    aElem.onclick = () => toggleThMode(true)
    aElem.href = "#";
    aElem.classList = "item"
    rightMenu.insertBefore(aElem, rightMenu.firstChild);
  }

  function appendInfoDiv() {
    if(!infoElement){
      //Creating info element

      /**
       * You need to know
       * - anime name
       * - anime ep
       * - if it has a prev ep
       * - if it has a next ep
       *  
      */
      infoElement = document.createElement("div")
      infoElement.id = "anime-info"

      let aClasses = "ui basic button small svg uppercase"

      let getEpBtnMarkup = (isNext) => {
        let link = isNext ? mast.getNextEpUrl(document) : mast.getPrevEpUrl(document)
        // return `<p>asd</p>`
        return `<a href="${link ? link : "#"}" class="${aClasses+ (link ? "" : " disabled")}">${isNext ? "NEXT" : "PREV"}</a>`
      }

      let elContent = document.createRange().createContextualFragment(
        `
          <span class="info">${mast.getAnimeName(document)}
           - Ep. ${mast.getEpNumber(document)}</span>
          ${getEpBtnMarkup(false)}
          ${getEpBtnMarkup(true)}
          <a id="tgl-tm-btn" href="#" class="${aClasses}">MINIMIZE</a
        `
      )

      infoElement.appendChild(elContent)
      let toggleButton = infoElement.querySelector("#tgl-tm-btn")
      toggleButton.addEventListener('click', () => toggleThMode(false))      
    }

    //Appending info element to the player
    playerElem.appendChild(infoElement)   
  }
}

module.exports = () => {
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", afterContentLoad)
  else
    afterContentLoad()
}