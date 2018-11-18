import { storageVars, streamingUrls, idleTime, messageHash } from './constants'
import storage from './utils/storage'
import ext from './utils/ext'
import { getAnimeName, getPrevEpUrl, getNextEpUrl, getEpNumber } from './utils/masteraniUtils'
import { addClass, removeClass } from './utils/domTools'
import { decryptMsg } from './utils/utils'

export default class TheatherMode {

  constructor() {
    this.enableTheaterMode
    this.infoElement
    this.thModeToggled = false;
    this.playerElem = document.querySelector('.ui.embed')
    this.hostsTopBar = document.querySelector('#watch>.ui.grid>.anime-video .options')
  
    this.head = document.head
    this.link = document.createElement('link')
    this.link.type = 'text/css'
    this.link.rel = 'stylesheet'
    this.link.href = ext['extension'].getURL('styles/theatermode.css')
  
    storage.get([storageVars.theaterMode], function (result) {
      this.enableTheaterMode = result[storageVars.theaterMode]
      if (this.enableTheaterMode) {
        this.toggleThMode(true)
      }
    })
  
    this.addTopToggleButton()

    // Fade out when inactive functionality block
    {
      const showTheaterModeUI = () => {
        if (this.hostsTopBar) addClass(this.hostsTopBar, 'hover')
        if (this.infoElement) addClass(this.infoElement, 'hover')
      }
  
      const hideTheaterModeUI = () => {
        if (this.hostsTopBar) removeClass(this.hostsTopBar, 'hover')
        if (this.infoElement) removeClass(this.infoElement, 'hover')
      }
  
      let tout = setTimeout(hideTheaterModeUI, idleTime)
  
      const resetTimer = () => {
        showTheaterModeUI()
        clearTimeout(tout)
        tout = setTimeout(hideTheaterModeUI, idleTime)
      }
  
      document.addEventListener('mousemove', resetTimer)
      document.addEventListener('keypress', resetTimer)
  
      window.addEventListener('message', function (e) {
        // console.log('e origin:',e.origin)
  
        if (!streamingUrls.includes(e.origin) ||
          typeof (e.data) !== 'string') { return }
  
        let msg = decryptMsg(e.data, messageHash)
  
        if (msg === 'mousemove' ||
           msg === 'keypress') { resetTimer() }
      })
    }
  }

  toggleThMode() {
    this.setThMode(!this.thModeToggled)
  }
  
  setThMode (activate) {
    if (activate) {
      this.head.appendChild(this.link)
      this.appendInfoDiv()
    } else {
      this.head.removeChild(this.link)
      if (this.infoElement && this.playerElem.contains(this.infoElement)) {
        this.playerElem.removeChild(this.infoElement)
      }
      document.webkitCancelFullScreen()
    }
    this.thModeToggled = activate;
  }
  
  addTopToggleButton () {
    let rightMenu = document.getElementById('navigation').querySelector('.right.menu')
    let aElem = document.createElement('a')
    let textNode = document.createTextNode('Theater Mode')
    aElem.appendChild(textNode)
    aElem.onclick = () => this.setThMode(true)
    aElem.href = '#'
    aElem.classList = 'item'
    rightMenu.insertBefore(aElem, rightMenu.firstChild)
  }
  
  appendInfoDiv() {
    if (!this.infoElement) {
      this.infoElement = document.createElement('div')
      this.infoElement.id = 'anime-info'
      // infoElement.classList = "hover"

      let aClasses = 'ui basic button small svg uppercase'

      let getEpBtnMarkup = (isNext) => {
        let link = isNext ? getNextEpUrl(document) : getPrevEpUrl(document)
        // return `<p>asd</p>`
        return `<a href="${link || '#'}" class="${aClasses + (link ? '' : ' disabled')}">${isNext ? 'NEXT' : 'PREV'}</a>`
      }

      let elContent = document.createRange().createContextualFragment(
        `
          <span class="info">${cutWElips(getAnimeName(document), 35)}
            - Ep. ${getEpNumber(document)}</span>
          ${getEpBtnMarkup(false)}
          ${getEpBtnMarkup(true)}
          <a id="tgl-tm-btn" href="#" class="${aClasses}">MINIMIZE</a
        `
      )

      this.infoElement.appendChild(elContent)
      let toggleButton = this.infoElement.querySelector('#tgl-tm-btn')
      toggleButton.addEventListener('click', () => this.setThMode(false))
    }

    // Appending info element to the player
    this.playerElem.appendChild(this.infoElement)
  }
}

// Cut String and add Elipsis if necessary
function cutWElips (string, maxLength) {
  if (string.length > maxLength) {
    return string.slice(0, Math.max(maxLength - 3, 0)) + '...'
  }
  return string
}

// export default function() {
//   if (document.readyState === 'loading') 
//     document.addEventListener('DOMContentLoaded', afterContentLoad)
//   else
//     afterContentLoad()
// }