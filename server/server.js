const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
const express = require('express');
const db = require('./config/connection');
const path = require('path');
const { typeDefs, resolvers } = require('./schemas');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
})

server.applyMiddleware({app});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);

  });
});

process.on('notcaught', function(err) {
  console.log('Caught: ' + err);
});