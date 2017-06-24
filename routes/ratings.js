"use strict";

const express = require('express');
const router  = express.Router({mergeParams: true});

module.exports = (knex) => {

  router.post("/", (req, res) => {

    let rating = {
      user_id: req.session.user.id,
      resource_id: req.params.resource_id,
      rating: req.body.rating,
    }

    knex('ratings')
      .insert(rating)
      .returning(['id', 'user_id', 'resource_id', 'rating'])
      .then((results) => {
        res.status(200).send(results);
      })
      .catch( (err) => {
        throw err;
      })
  });

  router.delete("/", (req, res) => {
    knex('ratings')
      .del()
      .where({
        resource_id: req.params.resource_id,
        user_id: req.session.user.id
      })
      .then((result) => {
        res.status(200).send();
      })
      .catch((err) => {
        throw err;
      })
  });

  router.put("/", (req,res) => {
    knex('ratings')
      .where({
        resource_id: req.params.resource_id,
        user_id: req.session.user.id
      })
      .update({rating: req.body.rating})
      .then((result) => {
        res.status(200).send();
      })
      .catch((err) => {
        throw err;
      })
  });

  return router;
}
