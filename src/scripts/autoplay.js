module.exports = () => {
  window.addEventListener('message', function(e){
    if(e.data === 'video ended' && e.origin === 'https://mp4upload.com'){
        let newUrl = ''
        for(let child of document.getElementsByClassName('actions')[0].children){
            if(child.innerText.match(/next/i)){
            newUrl = child.href
            break;
            }
        }
        //No next episode
        if(newUrl === ''){
        }
        else {
            window.location.href = newUrl
        }  
    }
  })
}