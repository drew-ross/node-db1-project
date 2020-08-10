const express = require('express');
const db = require("../../data/dbConfig.js");

const router = express.Router();

//middleware

const requireProperties = (keys) => {
  return (req, res, next) => {
    const missing = [];
    keys.forEach(key => {
      if (!req.body.hasOwnProperty(key)) {
        missing.push(key);
      }
    });
    if (missing.length > 0) {
      res.status(400).json({ message: `Please include required properties: ${missing.toString()}` });
    } else {
      next();
    }
  };
};

const checkAccountExists = (req, res, next) => {
  db('accounts')
    .where({ id: req.params.id })
    .then(account => {
      if (account.length > 0) {
        res.account = account;
        next();
      } else {
        res.status(404).json({ message: 'An account with that id was not found.' });
      }
    });
};

//endpoints

router.get('/', (req, res) => {
  db('accounts')
    .limit(req.query.limit)
    .then(accounts => res.status(200).json(accounts))
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: 'There was an issue getting accounts.', error: error.message });
    });
});

router.get('/:id', checkAccountExists, (req, res) => {
  res.status(200).json(res.account);
});

router.post('/', requireProperties(['name', 'budget']), (req, res) => {
  const newAccount = req.body;
  db('accounts')
    .insert(newAccount)
    .returning("id")
    .then(ids => {
      res.status(201).json({ inserted: ids });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: 'There was an issue adding a new account.', error: error.message });
    });
});

router.put('/:id', checkAccountExists, requireProperties(['name', 'budget']), (req, res) => {
  const changes = req.body;
  const accountId = req.params.id;

  db('accounts')
    .where({ id: accountId })
    .update(changes)
    .then(success => {
      if (success) {
        res.status(200).json({ message: 'Updated account successfully.' });
      } else {
        res.status(404).json({ message: `An account was not found with id = ${accountId}` });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: 'There was an issue editing the account.', error: error.message });
    });
});

router.delete('/:id', checkAccountExists, (req, res) => {
  const accountId = req.params.id;
  db('accounts')
    .where({ id: accountId })
    .del()
    .then(success => res.status(204).end())
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: 'There was an issue deleting the account.', error: error.message });
    });
});

module.exports = router;