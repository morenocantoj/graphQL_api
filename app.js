const express = require('express')
const { graphql, buildSchema } = require('graphql')
const graphqlHTTP = require('express-graphql')
const cors = require('cors')

// Classes
const Champion = require('./classes/Champion')

const schema = buildSchema(`
  type Query {
    language: String
    getChampions: [Champion]
  }

  type Champion {
    name: String
    attackDamage: Float
  }
`)

var champions = [
  new Champion('Genji', 30.50),
  new Champion('Hanzo', 70)
]

const rootValue = {
  language: () => 'GraphQL',

  getChampions: () => champions
}

// Server up
const app = express()
app.use(cors())
app.use('/graphql', graphqlHTTP({
  rootValue, schema, graphiql: true
}))
module.exports = app;
app.listen(4000, () => console.log('Listening on 4000'))
