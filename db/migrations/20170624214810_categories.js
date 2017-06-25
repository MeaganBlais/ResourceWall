
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('categories', function (table) {
      table.unique('name')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('categories', function (table) {
      table.dropUnique('name')
    })
  ])
};
