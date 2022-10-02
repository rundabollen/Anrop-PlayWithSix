const axios = require('axios')

const AFISYNC_REPOSITORIES_URL = 'http://repo.afi.fi/afisync/repositories.json'

const resolveMods = (repositoryMods, arma3syncMods) => {
  return repositoryMods.filter((mod) => !mod.optional).map((afisyncMod) => {
    const afiPrefixedMod = arma3syncMods.find((arma3syncMod) => afisyncMod.name.replace('@', '@afi_') === arma3syncMod.name)
    if (afiPrefixedMod) {
      return afiPrefixedMod.name
    }

    return afisyncMod.name
  }).sort()
}

module.exports = (arma3sync) => {
  return axios.get(AFISYNC_REPOSITORIES_URL)
    .then((res) => res.data)
    .then((afisync) => {
      return afisync.repositories.map((repository) => ({
        title: 'AFI - ' + repository.name,
        mods: resolveMods(repository.mods, arma3sync)
      }))
    }).catch((err) => {
      console.error(err)
      return []
    })
}
