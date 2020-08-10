const express = require('express');
const db = require("../../data/dbConfig.js");

const router = express.Router();

router.get('/', (req, res) => {
  db('accounts')
    .then(accounts => res.status(200).json(accounts))
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: 'There was an issue getting accounts.', error: error.message });
    });
});

router.post('/', (req, res) => {
  const newAccount = req.body;
  db('accounts')
    .insert(newAccount)
    .returning("id")
    .then(ids => {
      res.status(201).json({ inserted: ids });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: 'There was an issue adding a new account.', error: error.message})
    })
});

router.put('/:id', (req, res) => {

});

router.delete('/:id', (req, res) => {

});

module.exports = router;