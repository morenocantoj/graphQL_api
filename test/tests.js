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
  it("Change a champion's attack damage", (done) => {
    supertest(app)
    .post(api_url)
    .send({
      query: `mutation UpdateAttackDamage($championName: String!, $attackDamage: Float) {
        updateAttackDamage(name: $championName, attackDamage: $attackDamage) {
          name
          attackDamage
        }
      }`,
      variables: {
        championName: 'Hanzo',
        attackDamage: 60.50
      }
    })
    .set('Content-Type', 'application/json')
    .expect(200)
    .end(function(err, resp) {
      chk(err, done)
      assert.equal(resp.body.data.updateAttackDamage.name, 'Hanzo')
      assert.equal(resp.body.data.updateAttackDamage.attackDamage, 60.50)
      done()
    })
  })
  it("Add a new champion to champions array", (done) => {
    supertest(app)
    .post(api_url)
    .send({
      query: `mutation AddChampion($championName: String!, $attackDamage: Float) {
        addChampion(name: $championName, attackDamage: $attackDamage) {
          name
          attackDamage
        }
      }`,
      variables: {
        championName: 'Tracer',
        attackDamage: 30.50
      }
    })
    .set('Content-Type', 'application/json')
    .expect(200)
    .end(function(err, resp) {
      chk(err, done)
      assert.equal(resp.body.data.addChampion.name, 'Tracer')
      assert.equal(resp.body.data.addChampion.attackDamage, 30.50)
      done()
    })
  })
  it("Add a new champion to champions array expect a fail inserting one existing", (done) => {
    supertest(app)
    .post(api_url)
    .send({
      query: `mutation AddChampion($championName: String!, $attackDamage: Float) {
        addChampion(name: $championName, attackDamage: $attackDamage) {
          name
          attackDamage
        }
      }`,
      variables: {
        championName: 'Tracer',
        attackDamage: 30.50
      }
    })
    .set('Content-Type', 'application/json')
    .expect(200)
    .end(function(err, resp) {
      chk(err, done)
      assert.equal(resp.body.data. null)
      assert.equal(resp.body.errors[0].statusCode, 400)
      assert.equal(resp.body.errors[0].message, "Sorry, that champion is already in the system")
      done()
    })
  })
  it("Add a new champion to champions array expect a fail because missing name argument", (done) => {
    supertest(app)
    .post(api_url)
    .send({
      query: `mutation AddChampion($championName: String!, $attackDamage: Float) {
        addChampion(name: $championName, attackDamage: $attackDamage) {
          name
          attackDamage
        }
      }`,
      variables: {
        attackDamage: 30.50
      }
    })
    .set('Content-Type', 'application/json')
    .expect(500, done)
  })
})
