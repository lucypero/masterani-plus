import storage from "./utils/storage";
import { storageVars } from "./constants";
import { addEventListener } from "./utils/domTools";
import { getKeyComb } from "./utils/utils";

//Checkbox ID -> field name in storage
let storagePairs = {
  'ch-autoplay': storageVars.autoplay,
  'ch-theater': storageVars.theaterMode
}
let checkIds = Object.getOwnPropertyNames(storagePairs)

function restoreOptions() {
  let values = checkIds.map(k => storagePairs[k]);
  storage.get(values, (res) => {
    let resKeys = Object.getOwnPropertyNames(res);
    resKeys.forEach(key => {
      let chId = checkIds.find(id => storagePairs[id] === key)
      document.getElementById(chId).checked = res[key]
    })
  })
}

document.addEventListener('change', function(e){
  if(e.target.type || e.target.type === "checkbox"){
    let chboxField = storagePairs[e.target.id];
    storage.set({[chboxField]:e.target.checked})    
  }
})
document.addEventListener('DOMContentLoaded', restoreOptions);

let hkInputs = document.querySelectorAll('#hotkeys input')
addEventListener(hkInputs, 'keydown', function(e) {

  let defaultKeys = [27, 9]
  if(defaultKeys.includes(e.keyCode))
    return;

  e.preventDefault() 

  let unallowedKeys = [16, 17, 18, 20, 9]
  if(unallowedKeys.includes(e.keyCode))
    return

  this.value = getKeyComb(e)

  let command = /^hk-(.*)/.exec(this.id)[1]
  console.log('saving key',this.value,'to command', command)

  storage.get(storageVars.hotkeys, (obj) => {
    let hotKeys = obj.hasOwnProperty(storageVars.hotkeys) ? obj[storageVars.hotkeys] : {};
    hotKeys[command] = this.value;
    storage.set({[storageVars.hotkeys]:hotKeys})
  })
})