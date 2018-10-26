module.exports = {
  addClass(el, className) {
      if(el instanceof HTMLElement){
          el.classList.add(className);
      }
      else{
          for (let i = 0; i < el.length; i++) {
              el.item(i).classList.add(className);          
          }
      }
  },
  removeClass(el, className) {
      if(el instanceof HTMLElement){
          el.classList.remove(className);
      }
      else{
          for (let i = 0; i < el.length; i++) {
              el.item(i).classList.remove(className);          
          }
      }
  },  
  hasClass(el, className) {
      return el.classList.contains(className);
  }
}