/*
*   Options Configurations
*/

module.exports = () => {
    // Options bar
    document.getElementById("optbtn").addEventListener("click", drop);

    function drop() {
    document.getElementById("options-list").classList.toggle("show");
    }

    window.onclick = function(e) {
    if (!e.target.matches('#optbtn') && !e.target.matches('#options-list') && !e.target.parentNode.matches('.options')) {
        var myDropdown = document.getElementById("options-list");
        if (myDropdown.classList.contains('show')) {
            myDropdown.classList.remove('show');
        }
    }
    }

    // Options functionallity
    chrome.storage.sync.get(['enableAutoplay'], function(result){ document.getElementById('autoplay').checked = result.enableAutoplay})
    chrome.storage.sync.get(['enableTheaterMode'], function(result){ document.getElementById('theatermode').checked = result.enableTheaterMode})

    // document.addEventListener('DOMContentLoaded', function() {
    var autoplayCheckbox = document.getElementById('autoplay')
    var theatermodeCheckbox = document.getElementById('theatermode')

    autoplayCheckbox.addEventListener('change', function() {
        chrome.storage.sync.set({enableAutoplay: document.getElementById('autoplay').checked}, function(result){})
        chrome.runtime.sendMessage({load: "autoplay"}, function(response){})
        console.log("autoplay sending message")
    }, false);

    theatermodeCheckbox.addEventListener('change', function() {
        chrome.storage.sync.set({enableTheaterMode: document.getElementById('theatermode').checked}, function(result){})
        chrome.runtime.sendMessage({load: "theatermode"}, function(response){})
        console.log("theather sending message")
    })
        
    // }, false);

    console.log("lolp")

}