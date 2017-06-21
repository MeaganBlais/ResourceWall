exports.seed = function(knex, Promise) {
  return knex('categories').del()
    .then(function () {
      return Promise.all([
        knex('categories').insert({name: 'Cooking'}),
        knex('categories').insert({name: 'Coding'}),
        knex('categories').insert({name: 'Sports'})
      ]);
    });
};
