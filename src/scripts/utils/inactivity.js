module.exports = (time, onInactiveCb, onActiveCb) => {

  let t;
  window.addEventListener('onload', resetTimer)
  // DOM Events
  document.addEventListener('mousemove', resetTimer)
  document.addEventListener('keypress', resetTimer)

  function resetTimer() {
    onActiveCb()
    clearTimeout(t);
    t = setTimeout(onInactiveCb, time)
  }
}