"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.post("/", (req, res) => {

    const newResource = {
      // id: , //needs to be randomly generated
      user_id: req.session.user.id,
      'URL': req.body.URL,
      title: req.body.title,
      description: req.body.description
    }

    let categories = req.body.categories;
    let newCategories = req.body.categories.new;
    let categoryIDs = req.body.categories.old;
    let resource_id
    let promises = [];

    newCategories.forEach((category) => {
      promises.push(knex('categories').insert({name: category})
        .returning('id')
        .then((result) => {
          categoryIDs.push(result[0]);
          return result[0];
        }));
    })

    promises.push(knex('resources')
          .insert(newResource)
          .returning('id')
          .then((result) => {
            resource_id = result[0];
          }));

    Promise.all(promises)
      .then((result) => {
        console.log('ID hopefully, ', resource_id);
        console.log('categoryIDs, ', categoryIDs);
        categoryIDs.forEach((category) => {
          knex('resources_categories')
            .insert({'resource_id': resource_id, 'user_id': req.session.user.id, 'category_id': Number(category)})
            .then((result) => {
              console.log('put in new category_resource');
            })
        })
      })
      .then((result) => {
        console.log('sending response');
        res.status(200).send(resource_id);
      })



  });


  router.get("/", (req, res) => {

    knex('resources')
      //query to return an array of all resources
      .join('users', 'users.id', '=', 'resources.user_id')
      .select('resources.id AS resource_id', 'resources.URL', 'resources.title', 'resources.description',
        'user_id', 'users.user_name', 'users.avatar_URL')
      //loop through array of resources and add the a ratings property to each, containing an array of all ratings
      .then( (results) => {
        let promises = [];
        for (let resource of results) {
          //push each query (which returns a promise) to the empty promise array
          promises.push(knex('ratings')
            .select()
            .where('resource_id', resource.resource_id)
            .then((ratings) => {
              resource['ratings'] = ratings;
              //value to be added to promise array
              return resource;
            }));
        }
        //when all promises are complete, return promises array
        return Promise.all(promises);
      })
      .then((results) => {
        let promises = [];
        for (let resource of results) {
          promises.push(knex('likes')
            .select()
            .where('resource_id', resource.resource_id)
            .then((likes) => {
              //console.log(results);
              resource['likes'] = likes;
              return resource;
            }));
        }
        return Promise.all(promises);
      })
      .then((results) => {
        let promises = [];
        for (let resource of results) {
          promises.push(knex('comments')
            .select()
            .where('resource_id', resource.resource_id)
            .then((comments) => {
              //console.log(results);
              resource['comments'] = comments.length;
              return resource;
            }));
        }
        return Promise.all(promises);
      })
      .then((results) => {
        res.status(200).send(results);
      })
      .catch( (err) => {
        throw err;
      })

  });

  router.get("/:resource_id", (req, res) => {
    const resource_id = req.params.resource_id;
    knex('resources')
      //query to return an array of all resources
      .join('users', 'users.id', '=', 'resources.user_id')
      .select('resources.id AS resource_id', 'resources.URL', 'resources.title', 'resources.description',
        'user_id', 'users.user_name', 'users.avatar_URL')
      .where('resources.id', resource_id)
      //loop through array of resources and add the a ratings property to each, containing an array of all ratings
      .then( (results) => {
        let promises = [];
        for (let resource of results) {
          //push each query (which returns a promise) to the empty promise array
          promises.push(knex('ratings')
            .select()
            .where('resource_id', resource.resource_id)
            .then((ratings) => {
              resource['ratings'] = ratings;
              //value to be added to promise array
              return resource;
            }));
        }
        //when all promises are complete, return promises array
        return Promise.all(promises);
      })
      .then((results) => {
        let promises = [];
        for (let resource of results) {
          promises.push(knex('likes')
            .select()
            .where('resource_id', resource.resource_id)
            .then((likes) => {
              //console.log(results);
              resource['likes'] = likes;
              return resource;
            }));
        }
        return Promise.all(promises);
      })
      .then((results) => {
        let promises = [];
        for (let resource of results) {
          promises.push(
            knex('resources_categories')
              .join('categories', 'categories.id', '=', 'resources_categories.category_id')
              .select('categories.id', 'categories.name')
              .where('resources_categories.resource_id', resource_id)
              .then((categories) => {
                resource['categories'] = categories;
                return resource;
              })
          );
        }
        return Promise.all(promises);
      })
      .then((results) => {
        res.status(200).send(results);
      })
      .catch( (err) => {
        throw err;
      })

  });

  return router;
}
