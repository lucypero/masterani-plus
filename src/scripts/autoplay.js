try{
  for(var child of document.getElementsByClassName('actions')[0].children){
    if(child.innerText.match(/next/i)){
      debugger;
      var newUrl = child.href
    }
  }
} catch (error){
  var newUrl = 'https://www.masterani.me/anime'
}
window.location.href = newUrl
