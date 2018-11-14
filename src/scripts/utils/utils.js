export function reverseMap(obj) {
  let reverse = {}
  for (let j in obj){
    if (!Object.prototype.hasOwnProperty.call(obj, j)) continue
    reverse[obj[j]] = j
  }
  return reverse;
}