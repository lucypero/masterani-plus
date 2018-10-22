import storage from "./utils/storage";
import { storageVars } from "./constants";

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
    let obj = {};
    obj[chboxField] = e.target.checked;
    console.log(obj)
    storage.set(obj)
  }
})
document.addEventListener('DOMContentLoaded', restoreOptions);