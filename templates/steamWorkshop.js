const axios = require('axios')

const STEAM_WORKSHOP_COLLECTION_URL = 'https://api.steampowered.com/ISteamRemoteStorage/GetCollectionDetails/v1/'

const ignoredModPrefixes = ['@afi', '@gruppe_adler']
const ignoredMod = (name) => ignoredModPrefixes.find((prefix) => name.indexOf(prefix) === 0)

const resolveMods = (collectionId, steamWorkshopFiles, arma3syncMods) => {
  return steamWorkshopFiles.map((steamWorkshopFile) => {
    const publishedFileId = parseInt(steamWorkshopFile.publishedfileid, 10)
    const arma3syncMod = arma3syncMods.find((arma3syncMod) => {
      const { name, steamWorkshop } = arma3syncMod
      return !ignoredMod(name) && steamWorkshop && steamWorkshop.id === publishedFileId
    })

    if (arma3syncMod) {
      return arma3syncMod.name
    }

    console.log('Could not find Steam Workshop mod', publishedFileId, 'for collection', collectionId)

    return null
  }).filter((mod) => mod).sort()
}

module.exports.collection = (title, collectionId, arma3sync) => {
  const formData = new URLSearchParams()
  formData.append('collectioncount', 1)
  formData.append('publishedfileids[0]', collectionId)

  return axios.post(STEAM_WORKSHOP_COLLECTION_URL, formData)
    .then((res) => res.data)
    .then((data) => {
      const { children } = ((data.response || {}).collectiondetails || [])[0] || {}
      if (!children) {
        return []
      }

      return [
        {
          title,
          mods: resolveMods(collectionId, children, arma3sync)
        }
      ]
    })
    .catch((err) => {
      console.error(err)
      return []
    })
}
