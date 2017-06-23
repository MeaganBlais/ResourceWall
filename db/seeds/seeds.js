const userSeeds               = require('../seed-data/user-seeds');
const categorySeeds           = require('../seed-data/category-seeds');
const resourceSeeds           = require('../seed-data/resource-seeds');
const resourceCategorySeeds   = require('../seed-data/resource-category-seeds');
const ratingsSeeds            = require('../seed-data/rating-seeds');
const commentSeeds            = require('../seed-data/comment-seeds');
const likeSeeds               = require('../seed-data/like-seeds');


exports.seed = function(knex, Promise) {
    return knex('comments').del()
      .then( () => {
        return knex('likes').del()
      })
      .then( () => {
        return knex('ratings').del()
      })
      .then( () => {
        return knex('resources_categories')
      })
      .then( () => {
        return knex('resources').del()
      })
      .then( () => {
        return knex('categories').del()
      })
      .then( () => {
        return knex('users').del()
      })
      .then( () => {
        return knex('users').insert(userSeeds)
      })
      .then( () => {
        return knex('categories').insert(categorySeeds)
      })
      .then( () => {
        return knex('resources').insert(resourceSeeds)
      })
      .then(() => {
        return knex('resources_categories').insert(resourceCategorySeeds)
      })
      .then(() => {
        return knex('ratings').insert(ratingsSeeds)
      })
      .then(() => {
        return knex('comments').insert(commentSeeds)
      })
      .then(() => {
        return knex('likes').insert(likeSeeds)
      })
};
