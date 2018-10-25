import { getNextEpUrl } from "./masteraniUtils";

module.exports = () => {
  window.addEventListener('message', function(e){
    if(e.data === 'video ended' && e.origin === 'https://mp4upload.com'){
        let newUrl = getNextEpUrl(document)       
        //No next episode
        if(!newUrl){
        }
        else {
            window.location.href = newUrl
        }  
    }
  })
}