const router = require('express').Router();
const bcrypt = require('bcryptjs');

const db = require('../database/users/user-model.js');

router.get('/', (req, res) => {
  res.json({ api : 'server is running' });
});

router.get('/users', validate, (req, res) => {
  db.find()
    .then(users => {
      res.json(users)
    })
    .catch(err => res.status(500).json({ error: err }))
})

router.post('/register', (req, res) => {
  const user = req.body;
  const hashed = bcrypt.hashSync(user.password, 12);
  user.password = hashed;

  db.add(user)
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(err => res.status(500).json(err))
})

router.post('/login', (req, res) => {
  const { name, password } = req.body;
  console.log(name);

  db.findBy({name})
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Wwwelcome ${user.name}`})
      } else {
        res.status(401).json({ message: 'you shall not pass!'})
      }
    })
    .catch(err => res.status(500).json({error: err}))
})

function validate(req, res, next) {
  const { name, password } = req.headers;

  if (name && password) {
    // console.log(name)
    // console.log(req.headers)
    console.log({name})

    db.findBy({name})
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).json({message: 'invalid credentials'})
        }
      })
      .catch(err => res.status(500).json({ error: err }));
  } else {
    res.status(401).json({ message: 'no credentials provided'});
  }
}

module.exports = router;