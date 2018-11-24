var app = require('../app');
var supertest = require('supertest');
var assert = require('assert');

// External dependencies
var Champion = require('../classes/Champion')

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
})
