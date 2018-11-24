const app = require('../app');
const supertest = require('supertest');
const assert = require('assert');
const api_url = '/graphql'

// External dependencies
const Champion = require('../classes/Champion')

function chk(err, done) {
  if (err) {
    console.log(err)
    done()
  }
}

describe("GraphQL's API Test suite", function() {
  it("Create Champion object", (done) => {
    var champion = new Champion('Genji', 30.50)
    assert.equal(champion.name, 'Genji')
    assert.equal(champion.attackDamage, 30.50)
    done()
  })
  it("Return all champions (only names)", (done) => {
    supertest(app)
    .post(api_url)
    .send({
      query: `{
          getChampions {
            name
          }
        }`
    })
    .set('Content-Type', 'application/json')
    .expect(200)
    .end(function(err, resp) {
      chk(err, done)
      assert.equal(resp.body.data.getChampions[0].name, 'Genji')
      assert.equal(resp.body.data.getChampions[1].name, 'Hanzo')
      assert.equal(resp.body.data.getChampions[1].attackDamage, undefined)
      done()
    })
  })
  it("Return all champions (all data)", (done) => {
    supertest(app)
    .post(api_url)
    .send({
      query: `{
          getChampions {
            name
            attackDamage
          }
        }`
    })
    .set('Content-Type', 'application/json')
    .expect(200)
    .end(function(err, resp) {
      chk(err, done)
      assert.equal(resp.body.data.getChampions[0].name, 'Genji')
      assert.equal(resp.body.data.getChampions[1].name, 'Hanzo')
      assert.equal(resp.body.data.getChampions[0].attackDamage, 30.50)
      assert.equal(resp.body.data.getChampions[1].attackDamage, 70)
      done()
    })
  })
  it("Return all champions expected 400 Bad Request", (done) => {
    supertest(app)
    .post(api_url)
    .send({
      query: `{
          getChampions {

          }
        }`
    })
    .set('Content-Type', 'application/json')
    .expect(400, done)
  })
  it("Return a champion filtered by name", (done) => {
    supertest(app)
    .post(api_url)
    .send({
      query: `query GetChampionByName($championName: String!) {
          getChampionByName(name: $championName) {
            name
            attackDamage
          }
        }`,
      variables: {
        championName: 'Genji'
      }
    })
    .set('Content-Type', 'application/json')
    .expect(200)
    .end(function(err, resp) {
      chk(err, done)
      assert.equal(resp.body.data.getChampionByName.name, 'Genji')
      assert.equal(resp.body.data.getChampionByName.attackDamage, 30.5)
      done()
    })
  })
})
