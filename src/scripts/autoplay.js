module.exports = () => {
  window.addEventListener('message', function(e){
    if(e.data === 'video ended'){
        let newUrl = ''

        for(let child of document.getElementsByClassName('actions')[0].children){
            if(child.innerText.match(/next/i)){
            newUrl = child.href
            break;
            }
        }

        //No next episode
        if(newUrl === ''){
            // console.log('no next ep found')
        }
        else {
            // console.log('going to ', newUrl)
            window.location.href = newUrl
        }  
    }
  })
}