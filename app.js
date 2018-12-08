const express = require('express')
const { graphql, buildSchema } = require('graphql')
const graphqlHTTP = require('express-graphql')
const cors = require('cors')
const { errorName, errorType } = require('./errors')

// Errors
const getErrorCode = (errorName) => {
  return errorType[errorName]
}

// Classes
const Champion = require('./classes/Champion')

const schema = buildSchema(`
  type Query {
    language: String
    getChampions: [Champion]
    getChampionByName(name: String!): Champion
  }

  type Mutation {
    updateAttackDamage(name: String!, attackDamage: Float): Champion
    addChampion(name: String!, attackDamage: Float): Champion
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
  getChampions: () => champions,
  getChampionByName: ({ name }) => {
    return champions.find(x => x.name === name)
  },
  updateAttackDamage: ({name, attackDamage = 80}) => {
    const champion = champions.find(x => x.name === name)
    champion.attackDamage = attackDamage

    return champion
  },
  addChampion: ({name, attackDamage = 60}) => {
    let newChampion = new Champion(name, attackDamage)

    champions.forEach((champion) => {
      if (champion.name == newChampion.name) {
        // Same champion, abort operation
        throw new Error(errorName.CHAMPION_REPEATED)
      }
    })

    // Try to add a champion in the existing array
    champions.push(newChampion)

    return newChampion
  }
}

// Server up
const app = express()
app.use(cors())
app.use('/graphql', graphqlHTTP({
  rootValue,
  schema,
  graphiql: true,
  context: null,
  formatError: (err) => {

    const error = getErrorCode(err.message)
    if (error != undefined) {
      return ({ message: error.message, statusCode: error.statusCode })
    } else {
      // Return normal GraphQL error
      return err
    }
  }
}))
module.exports = app;
app.listen(4000, () => console.log('Listening on 4000'))
