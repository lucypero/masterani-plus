module.exports = {
  getAnimeName: (doc) => {
    return doc.querySelector('.row.anime-info .info h1').innerText
  },
  getEpNumber: (doc) => {
    return (doc
      .querySelector('.row.anime-info .info h2').innerText
      .match(/\d+/g)[0]
    )
  },
  getPrevEpUrl: (doc) => {
    return findEp(doc, false)
  },
  getNextEpUrl: (doc) => {
    return findEp(doc, true)
  }
}

// if isNext is true, it returns the next ep url
// if false, it returns the prev ep
function findEp (doc, isNext) {
  for (let child of doc.getElementsByClassName('actions')[0].children) {
    if (child.innerText.match(isNext ? /next/i : /prev/i)) {
      return child.href
    }
  }
  return null
}
