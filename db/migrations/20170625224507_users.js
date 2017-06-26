
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function (table) {
      table.unique('user_name')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function (table) {
      table.dropUnique('user_name')
    })
  ])
};
