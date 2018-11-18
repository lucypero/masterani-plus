import storage from "./utils/storage";
import { storageVars, defaultHotkeys } from "./constants";
import { getKeyComb, reverseMap } from "./utils/utils";

//Checkbox ID -> field name in storage
let storagePairs = {
  'ch-autoplay': storageVars.autoplay,
  'ch-theater': storageVars.theaterMode
}

function restoreOptions() {
  //Loading "Global Settings" group
  let storagePairsInv = reverseMap(storagePairs)
  storage.get(Object.keys(storagePairsInv), (res) => {
    let resKeys = Object.getOwnPropertyNames(res);
    resKeys.forEach(key => {
      let chId = storagePairsInv[key]
      document.getElementById(chId).checked = res[key]
    })
  })

  // Loading "Hotkey Mappings" group
  refreshHotkeyDisplay()
}

function refreshHotkeyDisplay() {
  // Loading default hotkeys
  for(let command in defaultHotkeys) {
    let inputId = `hk-${command}`
    document.getElementById(inputId).value = defaultHotkeys[command]
  }

  // Loading user-defined hotkeys 
  storage.get(storageVars.hotkeys, (res) => {
    let hotKeys = res.hasOwnProperty(storageVars.hotkeys) ? res[storageVars.hotkeys] : {};    
    for(let key in hotKeys){
      let inputId = `hk-${key}`
      document.getElementById(inputId).value = hotKeys[key]
    }
  })
}

document.addEventListener('change', function(e){
  if(e.target.type || e.target.type === "checkbox"){
    let chboxField = storagePairs[e.target.id];
    storage.set({[chboxField]:e.target.checked})    
  }
})
document.addEventListener('DOMContentLoaded', restoreOptions);

let hkInputs = document.getElementById('hotkeys')
hkInputs.addEventListener('keydown', function(e) {

  if(event.target.tagName.toUpperCase() !== 'INPUT')
    return

  let defaultKeys = [27, 9]
  if(defaultKeys.includes(e.keyCode))
    return;

  e.preventDefault() 

  let unallowedKeys = [16, 17, 18, 20, 9]
  if(unallowedKeys.includes(e.keyCode))
    return

  e.target.value = getKeyComb(e)

  let command = /^hk-(.*)/.exec(e.target.id)[1]
  console.log('saving key',e.target.value,'to command', command)

  storage.get(storageVars.hotkeys, (obj) => {
    let hotKeys = obj.hasOwnProperty(storageVars.hotkeys) ? obj[storageVars.hotkeys] : {};
    hotKeys[command] = e.target.value;
    storage.set({[storageVars.hotkeys]:hotKeys})
  })
})

let defaultBtn = document.getElementById('btn-hk-def')
defaultBtn.addEventListener('click', function(e) {
  e.preventDefault();
  resetHotkeys();
  refreshHotkeyDisplay();
})

//It removes all custom hotkeys from storage
function resetHotkeys() {
  storage.set({[storageVars.hotkeys]:{}})
}