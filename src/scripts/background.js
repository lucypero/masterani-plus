import ext from "./utils/ext";

//We're moving the anime list from
// storage local to storage sync
// in the case that the user is updating
//We'll move it only if the user has a list
// on storage local but not on storage sync
//To only run this once after the extension is updated,
// we'll write the version number on storage.
//If the user doesn't have the version written,
// then it means they just updated the extension
let currentVersion = ext.runtime.getManifest().version;
ext.storage.sync.get('ver', function(val) {
  if(!val.hasOwnProperty('ver')){
    ext.storage.sync.get('animeList', function (val) {
      if(!val.hasOwnProperty('animeList')){
        ext.storage.local.get('animeList', function (val) {
          if(val.hasOwnProperty('animeList')){
            ext.storage.sync.set(val)
          }
        })
      }
    })
    ext.storage.sync.set({'ver':currentVersion})
  }
})
// @if env='development'
outputStorage(false)
outputStorage(true)
function outputStorage(local) {
  let storage = local ? ext.storage.local : ext.storage.sync;
  storage.get(null,(val) => {
    console.log('storage local:', local)
    console.log(val);    
  })
}
// @endif