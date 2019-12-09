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
        if (req.session) {
          req.session.isLogged = true;
        }
        res.status(200).json({ message: `Wwwelcome ${user.name}! Have a cookie`})
      } else {
        res.status(401).json({ message: 'you shall not pass!'})
      }
    })
    .catch(err => res.status(500).json({error: err}))
});

router.delete('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(400).send('unable to exit')
      } else {
        res.send('Good bye...')
      }
    })
  } else {
    res.end();
  }
});

function validate(req, res, next) {
  console.log(req.session);
  if (req.session && req.session.isLogged) {
    // console.log(req.session.user)
    next();
  } else {
    res.status(401).json({ message: 'no credentials provided'});
  }
}

module.exports = router;