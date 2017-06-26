"use strict";

const express = require('express');
const router  = express.Router({mergeParams: true});

module.exports = (knex) => {

// adding a resource 'like' to database
  router.post("/", (req, res) => {

    knex('likes')
    .returning('*')
    .insert({
      user_id: req.session.user.id,
      resource_id: req.params.resource_id
    })
    .then( (result) => {
      res.json(result);
    })
  });

// deleting like from database
  router.delete("/", (req, res) => {

    knex('likes')
      .where({'user_id': req.session.user.id, 'resource_id': req.params.resource_id})
      .del()
      .then( (result) => {
        res.status(200).send();
      })
      .catch((err) => {
        throw err;
      })
  })

  return router;
}
