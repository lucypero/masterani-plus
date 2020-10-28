export function addClass (el, className) {
  el.classList.add(className)
}
export function removeClass (el, className) {
  el.classList.remove(className)
}
export function hasClass (el, className) {
  return el.classList.contains(className)
}
// for NodeList
export function addEventListener (nodeList, event, fn) {
  for (let i = 0; i < nodeList.length; i++) {
    nodeList[i].addEventListener(event, fn, false)
  }
}