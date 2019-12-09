const express = require('express');
const session = require('express-session');
const knexSessionStore = require('connect-session-knex')(session);

const apiRouter = require('./api-router.js');
const configMiddleware = require('./config-middleware.js');

const server = express();

configMiddleware(server);

const sessionOptions = {
  name: 'poopie',
  secret: 'very secret string',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false, // https -- true in production
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false,
  store: new knexSessionStore({
    knex: require('../database/dbConfig'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 60,
  })
}

server.use(session(sessionOptions));
server.use('/api', apiRouter);

module.exports = server;