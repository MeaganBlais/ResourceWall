"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

// Register page
app.get("/register", (req, res) => {
  res.render("register");
});

// Register page
app.get("/new", (req, res) => {
  res.render("new");
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});

// Resource Details page
app.get("/resources/:resource_id", (req, res) => {

  // Get the resource id from request
  let resource_id = req.params.resource_id;

  // Declaring a variable to get the query result
  let resource_details;

  // Getting the resource detail from database
  knex('resources')
    .join('users', 'users.id', '=', 'resources.user_id')
    .where('resources.id', resource_id)
    .select('resources.id', 'resources.URL', 'resources.title', 'resources.description', 'users.user_name', 'users.id', 'users.avatar_URL')
    .then((results) => {

      //render the page to show the resource details
      res.render("resource_detail.ejs", results[0]);

    })
    .catch(function(error) {
      console.error(error);
    });

});

// Resource Comments
app.get("/resources/:resource_id/comments", (req, res) => {

  // Get the resource id from request
  let resource_id = req.params.resource_id;

  // Declaring a variable to get the query result
  let comments;

  // Getting the resource detail from database
  knex('comments')
    .join('users', 'users.id', '=', 'comments.user_id')
    .where('comments.resource_id', resource_id)
    .select('comments.id as comment_id', 'comments.comment', 'comments.created_at', 'users.user_name', 'users.avatar_URL', 'users.id as user_id')
    .then((results) => {

      // resource_details = {
      //   id: results[0].id,
      //   url: results[0].URL,
      //   title: results[0].title,
      //   description: results[0].description,
      //   user_name: results[0].user_name,
      //   avatar: results[0].avatar_URL
      // }

console.log("results: ", results);

      return res.json(results);

      //render the page to show the resource details
      // res.render("resource_detail.ejs", results);

    })
    .catch(function(error) {
      console.error(error);
    });

});
