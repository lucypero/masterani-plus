import { decryptMsg, streamingUrls, storageVars, defaultHotkeys } from "./constants";
import storage from "./utils/storage";
import { reverseMap } from "./utils/utils";

let keyMappings = Object.assign({}, defaultHotkeys);
const hotkeyKey = storageVars.hotkeys
let reverseKeyDict = reverseMap(keyMappings);

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

export function hotKeys() {
  
  storage.get(hotkeyKey, function(val) {
    if(!val.hasOwnProperty(hotkeyKey))
      return
    //Here you transform keyMappings so it
    // contains the custom hotkeys
    // of the user
    for(let action in val[hotkeyKey]) {
      keyMappings[action] = val[hotkeyKey][action]
    }
    //making a key array for lookup efficiency
    reverseKeyDict = reverseMap(keyMappings)
  })

  window.addEventListener('keydown', (e) => {
    keyDown(e)
  })

  window.addEventListener('message', function(e){
    //validating data..
    // Has to be an object with 
    // 'type' and 'value' props
    if( !streamingUrls.includes(e.origin) ||
        typeof(e.data) !== "object" ||
        !e.data.type ||
        decryptMsg(e.data.type) !== 'keydown' ||
        !e.data.value
      )
      return;
    keyDown(e.data.value)
    // let msg = decryptMsg(e.data)
    // if(/^keydown-/.test(msg)){
    //   let keyCode = msg.slice(8)
    //   keyDown(keyCode)
    // }
  })
  // window.location.href = newUrl;
}

function keyDown(keyEv) {
  //note: you might not get an actual event here, but
  // you'll get these props for sure:
  // key, keyCode, ctrlKey, shiftKey, altKey
  console.log('all hotkeys:')
  console.log(keyMappings);

  let keyStr = keyEv.key
  if(reverseKeyDict[keyStr])
    console.log('command to execute:',reverseKeyDict[keyStr])
}