"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.post("/", (req, res) => {
          console.log(req.params.resource_id)
    knex('likes')
    .returning('*')
    .insert({
      user_id: req.session.user.id,
      resource_id: req.params.resource_id
    })
    .then( (result) => {
      res.json(result);
    })
  })
  return router;
}
