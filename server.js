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
const resourcesComments = require("./routes/comments");
const likeRoutes = require("./routes/likes");
const ratingsRoutes = require("./routes/ratings");
const categoryRoutes = require("./routes/categories");
const resourceCategoryRoutes = require("./routes/resource_categories");
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
app.use("/api/categories", categoryRoutes(knex));
app.use("/api/resources/:resource_id/comments", resourcesComments(knex));
app.use("/api/resources/:resource_id/ratings", ratingsRoutes(knex));
app.use("/api/resources/:resource_id/likes", likeRoutes(knex));
app.use("/api/resources/:resource_id/categories", resourceCategoryRoutes(knex));

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
  knex('categories').select()
    .then((results) => {
      res.render("new", {categories: results});
    })
});

// My Resources page
app.get("/myresources", (req, res) => {
  res.render("myresources");
});

// Resource Details page
app.get("/resources/:resource_id", (req, res) => {

  let resource_id = req.params.resource_id;
  let templateVars = {};

  // Getting the resource detail from database
  knex('resources')
    .join('users', 'users.id', '=', 'resources.user_id')
    .where('resources.id', resource_id)
    .select('resources.id', 'resources.URL', 'resources.title', 'resources.description', 'users.user_name', 'users.id as user_id', 'users.avatar_URL')
    .then((results) => {
      templateVars.resource_details = results[0];
      knex('categories')
        .select()
        .then((categories) => {
          templateVars.categories = categories;
          res.render("resource_detail.ejs", templateVars);
        })
    })
    .catch(function(error) {
      console.error(error);
    });

});


// Profile page
app.get("/profile", (req, res) => {

  let user_id = req.session.user.id;
  let user_profile;

  // Getting the user detail from database
  knex('users')
    .select('users.id', 'users.user_name', 'users.full_name', 'users.email', 'users.avatar_URL')
    .where({id: user_id})
    .then((results) => {
      res.render("profile.ejs", {users: results[0]});
    })
    .catch(function(error) {
      console.error(error);
    });
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});

