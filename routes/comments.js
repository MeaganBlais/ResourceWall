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

  router.get("/", (req, res) => {

    let resource_id = req.params.resource_id;
    let comments;

    // Getting the resource detail from database
    knex('comments')
      .join('users', 'users.id', '=', 'comments.user_id')
      .where('comments.resource_id', resource_id)
      .orderBy('comments.created_at', 'desc')
      .select('comments.id as comment_id', 'comments.comment', 'comments.created_at', 'users.user_name', 'users.avatar_URL', 'users.id as user_id')
      .then((results) => {
        return res.json(results);
      })
      .catch(function(err) {
        console.error(err);
      });

  });


  return router;
}
