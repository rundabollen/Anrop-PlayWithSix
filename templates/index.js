const express = require('express')

const afisync = require('./afisync')
const arma3sync = require('./arma3sync')
const steamWorkshop = require('./steamWorkshop')
const templates = require('./templates.json')

const app = express()

app.get('/', (req, res) => {
  arma3sync()
    .then((arma3sync) => Promise.all([
      afisync(arma3sync),
      steamWorkshop.collection('Arma Sweden', 457453269, arma3sync),
      steamWorkshop.collection('FNF - Required Mods', 2905664671, arma3sync)
    ]))
    .then((dynamicTemplates) => {
      const sortedTemplates = dynamicTemplates
        .flat()
        .concat(templates)
        .sort((a, b) => a.title.localeCompare(b.title))
      res.send(sortedTemplates)
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send(err)
    })
})

module.exports = app
