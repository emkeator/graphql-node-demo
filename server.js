var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var ww = require('./data');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  input wonderWomanInput {
    name: String
    title: String
    powers: String
    description: String
    awesomeness: Int
  }
  type wonderWoman {
    name: String
    title: String
    powers: String
    description: String
    awesomeness: Int
  }
  type Mutation {
    createWonderWoman(input: wonderWomanInput): wonderWoman
    updateWonderWomanDesc(name: String!, description: String!): wonderWoman
    deleteWonderWoman(name: String!): wonderWoman
  }
  type Query {
    hello: String    
    wonderwoman(name: String): wonderWoman
    wonderwomen: [wonderWoman]
  }
`);

class wonderWoman {
    constructor({name, title, powers, description, awesomeness}) {
      this.name = name;
      this.title = title;
      this.powers = powers;
      this.description = description;
      this.awesomeness = awesomeness;
    }
  }

function getWW(name){
  console.log(name)
  return ww.filter(e => e.name === name.name)[0]
}

function getWWPlural(){
  return ww
}

function newWW({input}){
  ww.push(new wonderWoman(input))
  return new wonderWoman(input)
}

function updateWW(args){
  let {name, description} = args
  let index = ww.findIndex(e => e.name === name)
  ww[index].description = description
  return ww[index]
}

function deleteWW(args){
  let {name} = args
  let index = ww.findIndex(e => e.name === name)
  return ww.splice(index, 1)
}

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return "Want to hear about some awesome ladies? You can search for 'Diana', 'Kara', 'Leia', 'Hermione', and 'Galadriel'.";
  },
  wonderwoman: getWW,
  wonderwomen: getWWPlural,
  createWonderWoman: newWW,
  updateWonderWomanDesc: updateWW,
  deleteWonderWoman: deleteWW
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');