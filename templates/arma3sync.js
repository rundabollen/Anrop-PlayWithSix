const axios = require('axios')

const ARMA3SYNC_MODS_URL = 'https://manager.arma3sync.anrop.se/api/mods'

module.exports = () => {
  return axios.get(ARMA3SYNC_MODS_URL)
    .then((res) => res.data)
    .catch((err) => {
      console.error(err)
      return []
    })
}
