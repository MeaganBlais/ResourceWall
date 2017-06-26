
exports.up = function(knex, Promise) {

  return Promise.all([

    // Clear the Database
    knex.schema.dropTable('users'),


    // Create the tables

    knex.schema.createTable('users', function(table){
      table.increments('id').primary();
      table.string('user_name', 20);
      table.string('full_name', 40);
      table.string('email');
      table.string('password');
      table.string('avatar_URL');
      table.date('date_join');
    }),

    knex.schema.createTable('resources', function(table){
      table.increments('id').primary();
      table.integer('user_id').unsigned();
      table.foreign('user_id').references("users.id");
      table.string('URL');
      table.string('title', 30);
      table.string('description');
    }),

    knex.schema.createTable('likes', function(table){
      table.increments('id').primary();
      table.integer('user_id').unsigned();
      table.foreign('user_id').references("users.id");
      table.integer('resource_id').unsigned();
      table.foreign('resource_id').references("resources.id");
    }),

    knex.schema.createTable('comments', function(table){
      table.increments('id').primary();
      table.integer('user_id').unsigned();
      table.foreign('user_id').references("users.id");
      table.integer('resource_id').unsigned();
      table.foreign('resource_id').references("resources.id");
      table.string('comment');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    }),

    knex.schema.createTable('ratings', function(table){
      table.increments('id').primary();
      table.integer('user_id').unsigned();
      table.foreign('user_id').references("users.id");
      table.integer('resource_id').unsigned();
      table.foreign('resource_id').references("resources.id");
      table.integer('rating');
    }),

    knex.schema.createTable('categories', function(table){
      table.increments('id').primary();
      table.string('name', 15);
    }),

    knex.schema.createTable('resources_categories', function(table){
      table.increments('id').primary();
      table.integer('resource_id').unsigned();
      table.foreign('resource_id').references("resources.id");
      table.integer('category_id').unsigned();
      table.foreign('category_id').references("categories.id");
      table.integer('user_id').unsigned();
      table.foreign('user_id').references("users.id");
    })

  ]);

};

exports.down = function(knex, Promise) {

  return Promise.all([

    // Clear the tables created
    knex.schema.dropTable('resources_categories'),
    knex.schema.dropTable('categories'),
    knex.schema.dropTable('ratings'),
    knex.schema.dropTable('comments'),
    knex.schema.dropTable('likes'),
    knex.schema.dropTable('resources'),
    knex.schema.dropTable('users'),


    // Creating the user table
    knex.schema.createTable('users', function (table) {
      table.increments();
      table.string('name');
    })

  ]);

};


