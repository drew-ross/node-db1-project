const express = require("express");
const accountsRouter = require('./accounts/accountsRouter');

const server = express();

server.use(express.json());
server.use('/api/accounts', accountsRouter);

server.get('/', (req, res) => {
  res.status(200).json({ message: 'api up' })
});

server.get('/api', (req, res) => {
  res.status(200).json({ message: 'api up' })
});

module.exports = server;
