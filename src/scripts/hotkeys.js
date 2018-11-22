import { streamingUrls, storageVars, defaultHotkeys, messageHash} from './constants'
import storage from './utils/storage'
import { reverseMap, getKeyComb, decryptMsg } from './utils/utils'
import { getNextEpUrl, getPrevEpUrl } from './utils/masteraniUtils';

let keyMappings = Object.assign({}, defaultHotkeys)
const hotkeyKey = storageVars.hotkeys
let reverseKeyDict = reverseMap(keyMappings)
let theaterMode;
let commands = {
  'next-ep': () => {
    let url = getNextEpUrl(document)
    if(url)
      window.location.href = url;
  },
  'prev-ep': () => {
    let url = getPrevEpUrl(document)
    if(url)
      window.location.href = url;
  },
  'toggle-th-mode': () => {
    theaterMode.toggleThMode()
  }
}

/**
 *  Data model:
 *
 *  animeList : {
 *    hotkeys :{
 *        'nextep': 'p',
 *        'prevep': 'o'
 *     }
 *  }
 *
 *  the entries on storage will replace
 *  the ones on memory, which are the
 *  default keys
 *
 */


export function hotKeys (tm) {
  theaterMode = tm;
  storage.get(hotkeyKey, function (val) {
    if (!val.hasOwnProperty(hotkeyKey)) { return }
    // Here you transform keyMappings so it
    // contains the custom hotkeys
    // of the user
    for (let action in val[hotkeyKey]) {
      keyMappings[action] = val[hotkeyKey][action]
    }
    // making a key array for lookup efficiency
    reverseKeyDict = reverseMap(keyMappings)
  })

  window.addEventListener('keydown', (e) => {
    keyDown(e)
  })

  window.addEventListener('message', function (e) {
    // validating data..
    // Has to be an object with
    // 'type' and 'value' props
    if (!streamingUrls.includes(e.origin) ||
        typeof (e.data) !== 'object' ||
        !e.data.type ||
        decryptMsg(e.data.type, messageHash) !== 'keydown' ||
        !e.data.value
    ) { return }
    keyDown(e.data.value)
    // let msg = decryptMsg(e.data)
    // if(/^keydown-/.test(msg)){
    //   let keyCode = msg.slice(8)
    //   keyDown(keyCode)
    // }
  })
  // window.location.href = newUrl;
}

function keyDown (keyEv) {
  // note: you might not get an actual event here, but
  // you'll get these props for sure:
  // key, keyCode, code, ctrlKey, shiftKey, altKey, 
  let keyComb = getKeyComb(keyEv)
  console.log(keyComb)
  if (reverseKeyDict[keyComb])
    commands[reverseKeyDict[keyComb]]()
}
