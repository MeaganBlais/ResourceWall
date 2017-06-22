"use strict";

const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');

module.exports = (knex) => {

  router.post("/", (req, res) => {
  //add a new user to the database when the registration form is submitted
    //create new user object, assigning properties from the request body, password is hashed using bcrypt
    let newUser = {
      user_name: req.body.user_name,
      full_name: req.body.full_name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      avatar_URL: req.body.avatar_URL,
      date_join: new Date()
    }
    //insert new user object in to users table
    knex('users')
      .insert(newUser)
      .returning(['id', 'user_name', 'avatar_URL'])
      .then( (results) => {
        console.log("Added new user.");
        req.session.user = results;
        res.status(200).send();
      })
      .catch((err) => {
        throw err;
      })
  });

  return router;
}
