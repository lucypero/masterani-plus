import { storageVars, streamingUrls, idleTime, decryptMsg } from "./constants";
import storage from "./utils/storage";
import ext from "./utils/ext";
import mast from "./utils/masteraniUtils";
import domT from "./utils/domTools";

//This runs on the masterani page
function afterContentLoad() {
  let enableTheaterMode
  let infoElement;
  let playerElem = document.querySelector('.ui.embed')
  let hostsTopBar = document.querySelector('#watch>.ui.grid>.anime-video .options')

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

  // Fade out when inactive functionality block
  {
    const showTheaterModeUI = () => {
      if(hostsTopBar) domT.addClass(hostsTopBar,"hover")
      if(infoElement) domT.addClass(infoElement,"hover")
    }

    const hideTheaterModeUI = () => {
      if(hostsTopBar) domT.removeClass(hostsTopBar,"hover")
      if(infoElement)  domT.removeClass(infoElement,"hover")
    }

    let tout = setTimeout(hideTheaterModeUI, idleTime)

    const resetTimer = () => {
      showTheaterModeUI()
      clearTimeout(tout)
      tout = setTimeout(hideTheaterModeUI, idleTime)
    }

    document.addEventListener('mousemove', resetTimer)
    document.addEventListener('keypress', resetTimer)

    window.addEventListener('message', function(e){
      // console.log('e origin:',e.origin)

      if(!streamingUrls.includes(e.origin) ||
        typeof(e.data) !== "string")
        return;

      let msg = decryptMsg(e.data)

      if(msg === 'mousemove' ||
         msg === 'keypress')
          resetTimer();
    })
  }

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
    let textNode = document.createTextNode("Theater Mode")
    aElem.appendChild(textNode);
    aElem.onclick = () => toggleThMode(true)
    aElem.href = "#";
    aElem.classList = "item"
    rightMenu.insertBefore(aElem, rightMenu.firstChild);
  }

  function appendInfoDiv() {
    if(!infoElement){
      infoElement = document.createElement("div")
      infoElement.id = "anime-info"
      // infoElement.classList = "hover"

      let aClasses = "ui basic button small svg uppercase"

      let getEpBtnMarkup = (isNext) => {
        let link = isNext ? mast.getNextEpUrl(document) : mast.getPrevEpUrl(document)
        // return `<p>asd</p>`
        return `<a href="${link ? link : "#"}" class="${aClasses+ (link ? "" : " disabled")}">${isNext ? "NEXT" : "PREV"}</a>`
      }

      let elContent = document.createRange().createContextualFragment(
        `
          <span class="info">${cutWElips(mast.getAnimeName(document),35)}
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

//Cut String and add Elipsis if necessary
function cutWElips(string, maxLength){
  if(string.length > maxLength){
    return string.slice(0,Math.max(maxLength-3,0))+"..."
  }
  return string;
}

module.exports = () => {
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", afterContentLoad)
  else
    afterContentLoad()
}