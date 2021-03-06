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
      avatar_URL: req.body.avatar_URL  ? req.body.avatar_URL : "/images/placeholder-user.png",
      date_join: new Date()
    }
    //insert new user object in to users table
    knex('users')
      .insert(newUser)
      .returning(['id', 'user_name', 'avatar_URL'])
      .then( (results) => {
        console.log(newUser);
        req.session.user = results[0];
        res.status(200).send(results[0]);
      })
      .catch((err) => {
        if(/already exists/.test(err.detail)) {
          console.error(err);
          res.status(500).send("User already exists.");
        } else {
          console.error(err);
          res.status(500).send("Something wrong happened, please try again.");
        }
      })
  });

  router.post("/login", (req, res) => {
    //attempts to log the user in using data provided by the request
    const user_name = req.body.user_name;
    const password  = req.body.password;
    //tries to find user in database with provided username
    knex('users')
      .select()
      .where('user_name', user_name)
      .then( (results) => {
        //if nothing is returned exit function
        if (results.length === 0) {
          console.log("No user exists");
          res.status(500).send("No user exists.");
          return;
        }
        //check hashed password against provided, if OK, respond by setting cookie
        if (bcrypt.compareSync(password, results[0].password)) {
          let userInfo = Object.assign({}, results[0]);
          delete userInfo.password;
          req.session.user = userInfo;
          res.status(200).send(userInfo);
        } else {
          console.log("wrong password");
          res.status(500).send("Wrong password");
        }
      })
      .catch( (err) => {
        throw err;
      })
  });

  router.post("/logout", (req, res) => {
    //logs the user out of the current session by setting req.session.user to null, redirects user to home page
    req.session = null;
    res.status(201).send();
  });

  router.put("/:user_id", (req, res) => {
  //allows users to update their profile information
    knex('users')
    .where('id', req.session.user.id)
    .update({
      user_name: req.body.user_name,
      full_name: req.body.full_name,
      email: req.body.email,
      avatar_URL: req.body.avatar_URL  ? req.body.avatar_URL : "/images/placeholder-user.png"
    })
    .then( (result) => {
      res.json(result);
    })
    .catch((err) => {
      if(/already exists/.test(err.detail)) {
        console.error(err);
        res.status(500).send("User already exists.");
      } else {
        console.error(err);
        res.status(500).send("Something wrong happened, please try again.");
      }
    })
  });

  return router;
}
