const axios = require('axios')

const AFISYNC_REPOSITORIES_URL = 'http://repo.afi.fi/afisync/repositories.json'
const ARMA3SYNC_MODS_URL = 'https://manager.arma3sync.anrop.se/api/mods'

const resolveMods = (repositoryMods, arma3syncMods) => {
  return repositoryMods.filter((mod) => !mod.optional).map((afisyncMod) => {
    const afiPrefixedMod = arma3syncMods.find((arma3syncMod) => afisyncMod.name.replace('@', '@afi_') === arma3syncMod.name)
    if (afiPrefixedMod) {
      return afiPrefixedMod.name
    }

    return afisyncMod.name
  }).sort()
}

const get = (url) => axios.get(url).then((res) => res.data)

module.exports = () => {
  return Promise.all([
    get(AFISYNC_REPOSITORIES_URL),
    get(ARMA3SYNC_MODS_URL)
  ]).then(([afisync, arma3sync]) => {
    return afisync.repositories.map((repository) => ({
      title: 'AFI - ' + repository.name,
      mods: resolveMods(repository.mods, arma3sync)
    }))
  }).catch((err) => {
    console.error(err)
    return []
  })
}
