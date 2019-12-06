const db = require('../dbConfig');

module.exports = {
  add,
  find,
  findBy,
  findById,
};

function add(user) {
  return db('users')
    .insert(user, 'id')
    .then(ids => {
      const [ id ] = ids;
      return findById(id);
    });
}

function find() {
  // return db('users')
  return db('users')
    .select('id', 'name', 'password')
    .orderBy('id');
}

function findBy(filter) {
  return db('users')
    .select('id', 'name', 'password')
    .where(filter)
    .first();
}

function findById(id) {
  return db('users')
    .select('id', 'name')
    .where({ id })
    .first();
}