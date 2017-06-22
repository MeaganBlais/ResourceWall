"use strict";

const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');

module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
    });
  });

  router.post("/", (req, res) => {

    let newUser = {
      user_name: 'Sean',
      full_name: 'Sean Fitzpatrick',
      email: 'sean.s.fitz@gmail.com',
      password: bcrypt.hashSync('sean', 10),
      avatar_URL: 'https://www.fillmurray.com/200/300',
      date_join: new Date()
    }

    console.log(req.body);

    knex('users')
      .insert(newUser)
      .then( (results) => {
        console.log("Added new user.");
        res.status(200).send();
      })
      .catch((err) => {
        throw err;
      })
  });

  return router;
}
