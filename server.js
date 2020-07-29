const express = require('express');	
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'cdadmin',
    password : 'admin',
    database : 'facebrain'
  }
});


// Access: PSQL prompt
// localhost, 'facebrain' db, 'cdadmin', 'admin'

const app = express()
const saltRounds = 10;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { res.send(database.users) });
app.post('/signin', (req, res) => { signin.handleSignIn(req, res, db, bcrypt) });
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db) });
app.put('/image', (req, res) => { image.handleImage(req, res, db) });
app.post('/imageurl', (req, res) => { image.handleAPI(req, res) });

app.listen(3001, () => {
	console.log(">>> app is running on 'localhost' port: 3001 (127.0.0.1:3001).")
})