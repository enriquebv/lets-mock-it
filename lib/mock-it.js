const createdChannels = {}

function setChannel(type, slug, data){
  createdChannels[type][slug] = data
}

function chanelExists(type, slug){
  return createdChannels[type][slug] !== undefined
}

module.exports = {
  setChannel,
  chanelExists
}