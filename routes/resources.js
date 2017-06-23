"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.post("/", (req, res) => {
    const newResource = {
      // id: , //needs to be randomly generated
      user_id: req.session.user.id,
      'URL': req.body.URL,
      title: req.body.title,
      description: req.body.description
    }

    const addResource = (data) => {
      knex('resources')
        .insert(data)
        .then( (results) => {
          // need to send response to tell ajax call on app.js that post was successful
          res.status(200).send();
        })
        .catch( (err) => {
          throw err;
        })
    }
    addResource(newResource);
  });


  router.get("/", (req, res) => {
    knex('resources')
      .select()
      .then( (results) => {

        res.status(200).send(results);
      })
      .catch( (err) => {
        throw err;
      })

  });

  return router;
}
