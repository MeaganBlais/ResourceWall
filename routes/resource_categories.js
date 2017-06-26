"use strict";

const express = require('express');
const router  = express.Router({mergeParams: true});

module.exports = (knex) => {

  router.delete("/:category_id", (req, res) => {
    //delete entry from resource_category table
    knex('resources_categories')
      .where('resource_id', req.params.resource_id)
      .andWhere('category_id', req.params.category_id)
      .del()
      .then(()=> {
        res.status(200).send();
      })
  })

  router.post("/", (req, res) => {
    //then add entry to resource_categories table
    console.log(req.body);
    knex('resources_categories')
      .returning('*')
      .insert({
        category_id: req.body.category_id,
        user_id: req.session.user.id,
        resource_id: req.params.resource_id
      })
      .then(() => {
        res.status(200).send();
      })


  })


  return router;
}
