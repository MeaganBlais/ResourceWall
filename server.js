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
const cookieSession = require('cookie-session');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
const resourcesRoutes = require("./routes/resources");
const resourceDetailsRoutes = require("./routes/resource_details");
const resourcesComments = require("./routes/comments");
const likeRoutes = require("./routes/likes");
const ratingsRoutes = require("./routes/ratings");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

//user cookie-session
app.use(cookieSession({
  name: 'session',
  secret: 'sean'
}));


app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));
app.use("/api/resources", resourcesRoutes(knex));
app.use("/api/resources/:resource_id", resourceDetailsRoutes(knex));
app.use("/api/resources/:resource_id/comments", resourcesComments(knex));
app.use("/api/resources/:resource_id/ratings", ratingsRoutes(knex));
app.use("/api/resources/:resource_id/likes", likeRoutes(knex));



// Home page
app.get("/", (req, res) => {
  res.render("index");
});

// Register page
app.get("/register", (req, res) => {
  res.render("register");
});

// Add Resource page
app.get("/new", (req, res) => {
  res.render("new");
});

// My Resources page --- need to switch once page is built
app.get("/myresources", (req, res) => {
  res.render("myresources");
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
    .select('resources.id', 'resources.URL', 'resources.title', 'resources.description', 'users.user_name', 'users.id as user_id', 'users.avatar_URL')
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
    .orderBy('comments.created_at', 'desc')
    .select('comments.id as comment_id', 'comments.comment', 'comments.created_at', 'users.user_name', 'users.avatar_URL', 'users.id as user_id')
    .then((results) => {

      return res.json(results);

    })
    .catch(function(error) {
      console.error(error);
    });

});
