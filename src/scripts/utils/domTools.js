module.exports = {
  addClass(el, className) {
    el.classList.add(className);
  },
  removeClass(el, className) {
    el.classList.remove(className);
  },  
  hasClass(el, className) {
      return el.classList.contains(className);
  },
  //for NodeList
  addEventListener(nodeList, event, fn) {
    for (let i = 0; i < nodeList.length; i++) {
      nodeList[i].addEventListener(event, fn, false);
    }
  }
}