"use strict";

const express = require('express');
const router  = express.Router({mergeParams: true});

module.exports = (knex) => {

  router.delete("/:category_id", (req, res) => {
    //delete entry from resource_category table
    console.log("hitting delete route");
  })

  router.post("/", (req, res) => {
    //get category from request body
    //if category doesn't exist, add to categories table
    //then add entry to resource_categories table
    console.log("hitting post route");
  })


  return router;
}
