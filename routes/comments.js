"use strict";

const express = require('express');
const router  = express.Router({mergeParams: true});

module.exports = (knex) => {

  router.post("/", (req, res) => {

    const newComment = {
      user_id: req.session.user.id,
      resource_id: req.params.resource_id,
      comment: req.body.comment,
      created_at: new Date()
    }


    const addComment = (data) => {
      knex('comments')
      .insert(data)
      .then( (results) => {
        res.status(200).send();
      })
      .catch( (err) => {
        throw err;
      })
    }

    addComment(newComment);

  });

  return router;
}
