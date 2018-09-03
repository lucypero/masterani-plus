// import ext from "./utils/ext";
import storage from "./utils/storage";

document.addEventListener('DOMContentLoaded', () => {

  // Cache of the template
  var template = document.getElementById("template-anime-item");
  // Get the contents of the template
  var templateHtml = template.innerHTML;
  // Final HTML variable as empty string
  var listHtml = "";

  var aniList = document.getElementById("an-list");

  // ---------------- DEBUG ---------------
  // document.getElementById("clear").addEventListener("click", function(){
  //     storage.local.clear();
  // });

  // storage.local.get(null,function(items){
  
  //     document.getElementById("object-log").innerHTML = JSON.stringify(items);
  // });
  // ---------------- /DEBUG ---------------

//   function logError(e) {
//       console.error(e);
//   }

  storage.get("animeList", function(items) {

      var animeList = items.animeList;
      var keys;

      if(animeList)
          keys = Object.keys(animeList);

      if(!animeList || keys.length === 0){
          
          var emptyTempl = document.getElementById("empty-list");
          aniList.innerHTML = emptyTempl.innerHTML;

          return;
      }
      
      keys.sort(function(a,b){
          if (animeList[a].watchedOn > animeList[b].watchedOn)
              return -1;
          if (animeList[a].watchedOn < animeList[b].watchedOn)
              return 1;
          return 0;
      });
      
      for (let i = 0; i < keys.length; i++) {
          let key = keys[i];

          listHtml += templateHtml.replace(/{{name}}/g, animeList[key].name || key)
                  .replace(/{{url}}/g, getLatestEpUrl(key, animeList[key].epNum))
                  .replace(/{{ep}}/g, animeList[key].epNum)
                  .replace(/{{coverImg}}/g, animeList[key].coverImg || "")
                  .replace(/{{animeID}}/g, key);
      }

      aniList.innerHTML = listHtml;

      setUpDeleteButtons()
  });

  function setUpDeleteButtons() {

      var deleteButtons = document.getElementsByClassName("delete");
      
      var deleteEntry = function() {
          var animeName = this.getAttribute("data-anime-name");
          var btn = this;
          storage.get("animeList", function(items){
              delete items.animeList[animeName];

              storage.set(items, function() {
                  btn.parentNode.parentNode.removeChild(btn.parentNode);
                  if(aniList.children.length === 0){
                      var emptyTempl = document.getElementById("empty-list");
                      aniList.innerHTML = emptyTempl.innerHTML;
                  }
              });

          });
      };
  
      Array.from(deleteButtons).forEach(function(element) {
          element.addEventListener('click', deleteEntry);
      });
  }

  function getLatestEpUrl(anime, ep){
      return "https://www.masterani.me/anime/watch/"+anime+"/"+ep;
  }


  //options button
  require('./optionsButton')()
});