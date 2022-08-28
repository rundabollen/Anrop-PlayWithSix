const nock = require('nock')
const request = require('supertest')

const app = require('../templates')

const afisyncTestData = require('./data/afisync.json')
const arma3syncTestData = require('./data/arma3sync.json')
const templatesData = require('../templates/templates.json')

describe('templates', () => {
  beforeEach(() => {
    nock.disableNetConnect()
    nock.enableNetConnect('127.0.0.1')

    nock('http://repo.afi.fi')
      .get('/afisync/repositories.json')
      .reply(200, afisyncTestData)

    nock('https://manager.arma3sync.anrop.se')
      .get('/api/mods')
      .reply(200, arma3syncTestData)
  })

  afterEach(() => {
    nock.cleanAll()
    nock.enableNetConnect()
  })

  describe('GET /', () => {
    it('should respond with json', (done) => {
      const responseData = [
        {
          mods: [
            '@afi',
            '@afi_ace3',
            '@afi_cba_a3',
            '@rhs_afrf3',
            '@rhs_gref',
            '@rhs_saf',
            '@rhs_usf3'
          ],
          title: 'AFI - armafinland.fi Primary'
        }
      ].concat(templatesData).sort((a, b) => a.title.localeCompare(b.title))

      request(app)
        .get('/')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).toEqual(responseData)
          done()
        })
    })
  })
})
