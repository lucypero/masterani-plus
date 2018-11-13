import { decryptMsg, streamingUrls, storageVars, defaultHotkeys } from "./constants";
import storage from "./utils/storage";

let keyMappings = Object.assign({}, defaultHotkeys);

export function hotKeys() {
  
  storage.get(storageVars.hotkeys, function(val) {
    if(!val.hasOwnProperty(storageVars.hotkeys)){
      val.animeList = {};
    }
    //Here you transform keyMappings so it
    // contains the custom hotkeys
    // of the user
    else {
      let keys = Object.getOwnPropertyNames(val[storageVars.hotkeys])
      for (let i = 0; i < keys.length; i++) {
        keyMappings[keys[i]] = val[keys[i]]
      }
    }
  })

  window.addEventListener('keydown', (e) => {
    keyDown(e.key)
  })

  window.addEventListener('message', function(e){
    if(!streamingUrls.includes(e.origin))
      return;

    let msg = decryptMsg(e.data)
    if(/^keydown-/.test(msg)){
      let keyCode = msg.slice(8)
      keyDown(keyCode)
    }
  })


  // window.location.href = newUrl;
}

function keyDown(key) {
  console.log('hotkeyss yee', key)
}