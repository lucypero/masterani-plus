const messageHash = "bfjbllfm"

module.exports = {
  storageVars: { //The fields in which data will be saved in storage
    autoplay: "autoplay",
    theaterMode: "theaterMode",
    hotkeys: "hotkeys"
  },
  streamingUrls: [
    "https://mp4upload.com",
    "https://streamango.com",
    "https://openload.co",
    "https://tiwi.kiwi",
    "https://www.rapidvideo.com",
    "https://embed.mystream.to"
  ],
  idleTime: 2000,
  masteraniURL: "https://www.masterani.me/*",
  decryptMsg: hashedMsg => {
    let re = new RegExp(`-${messageHash}$`)
    if(!re.test(hashedMsg))
      throw "this isn't a valid hashed message"
    return hashedMsg.slice(0,-(messageHash.length + 1))
  },
  encryptMsg: msg => msg+'-'+messageHash,
  defaultHotkeys: {
    'next-ep': 'P',
    'prev-ep': 'O'
  }
}