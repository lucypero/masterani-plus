export function reverseMap (obj) {
  let reverse = {}
  for (let j in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, j)) continue
    reverse[obj[j]] = j
  }
  return reverse
}

/**
 * Returns a string describing the
 *  key combination. for example:
 *  "Shift+A"
*/
export function getKeyComb (keyEv) {
  let output = []
  if (keyEv.ctrlKey) output.push('Ctrl')
  if (keyEv.altKey) output.push('Alt')
  if (keyEv.shiftKey) output.push('Shift')

  let res = /^(Key|Digit)(.*)/.exec(keyEv.code)
  let sanitizedCode = keyEv.code

  if (res && res[2]) { sanitizedCode = res[2] }

  output.push(sanitizedCode)
  return output.join('+')
}

export function decryptMsg (hashedMsg, hash) {
  let re = new RegExp(`-${hash}$`)
  if (!re.test(hashedMsg)) { throw "this isn't a valid hashed message" }
  return hashedMsg.slice(0, -(hash.length + 1))
}

export function encryptMsg (msg, hash) {
  return msg + '-' + hash
}
