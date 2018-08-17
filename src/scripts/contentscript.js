import storage from "./utils/storage";

var idAndEp = window.location.href.substr(37).split("/");

var id = idAndEp[0];
var epNum = idAndEp[1];

if(idAndEp[1] !== "" && !isNaN(epNum)){
    //Store current episode
    // storage.set({animeList:{[id]:epNum}})

    storage.get("animeList", function(val){

        if(!val.hasOwnProperty("animeList")){
            val.animeList = {};
        }

        var anime = val.animeList[id];

        if(!val.animeList.hasOwnProperty(id)){
            val.animeList[id] = {};
            anime = val.animeList[id];
        }

        if(!val.animeList.hasOwnProperty("coverImg")){
            var image = document.querySelector(".anime-info .info .cover img");
            anime.coverImg = image.getAttribute("src");
        }

        if(!val.animeList.hasOwnProperty("name")){
            var animeNameEl = document.querySelector(".anime-info .info .details .info h1");
            var animeName = animeNameEl.innerText || animeNameEl.textContent;
            anime.name = animeName;
        }

        anime.epNum = epNum;
        anime.watchedOn = new Date().toISOString();
        

        storage.set(val)
    });
}
else if(epNum === "") {
    //Redirect to latest watched episode
    storage.get({animeList:{id}}, function(val){
        if(isEmpty(val))
            return;

        var url = window.location.href.substr(0,37) + id + "/" + val.animeList[id].epNum;
        window.location.href = url;
    });
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}