module.exports = {
  addClass(el, className) {
    el.classList.add(className);
  },
  removeClass(el, className) {
    el.classList.remove(className);
  },  
  hasClass(el, className) {
      return el.classList.contains(className);
  }
}