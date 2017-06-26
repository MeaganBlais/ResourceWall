"use strict";

const express = require('express');
const router  = express.Router({mergeParams: true});

module.exports = (knex) => {

  router.post("/", (req, res) => {
    //add category to categories table
    knex('categories')
      .insert({name: req.body.name})
      .returning('*')
      .then((result) => {
        res.json(result[0])
        res.status(200)
        res.send()
      })
      .catch( (err) => {
        throw err;
      })
  });

  return router;
}
