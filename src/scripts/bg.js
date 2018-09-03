chrome.runtime.onMessage.addListener( function(request, sender, sendResponse){
    /*
    *   This is called when the video playback ends. Starts loading the next page
    */
    if (request.action == "vidEnd"){
      chrome.tabs.query({url: 'https://www.masterani.me/*'}, function(tab) {
        chrome.tabs.executeScript(tab[0].id, {
            file: 'scripts/autoplay.js'
        })
      })
    }
  
    /*
    *   These are called when the checkbox is set, starts various scripts
    */
    if(request.load == "autoplay"){
      console.log('getting message autoplay by bg')
      chrome.tabs.query({url: 'https://www.masterani.me/*'}, function(tab) {
        chrome.tabs.sendMessage(tab[0].id, {enableAutoplayToggle: true}, function(response){
        })
      })
    }
  
    if(request.load == "theatermode"){
      console.log('getting message theatermode by bg')
      chrome.tabs.query({url: 'https://www.masterani.me/*'}, function(tab) {
        chrome.tabs.sendMessage(tab[0].id, {enableTheaterModeToggle: true}, function(response){
        })
      })
    }
  })