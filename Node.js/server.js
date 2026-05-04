// Express Import
const express = require('express');
const app = express();


// Other Import
const fs = require('fs');
const path = require('path');
const lodash = require('lodash');


const pathUsersFile = path.join(__dirname, 'users.json');

if (!fs.existsSync(pathUsersFile)) {
  fs.writeFileSync(pathUsersFile, JSON.stringify([]));
};


// My File Import
const users = require('./routes/users');
const {notFound} = require('./helpers');


// Routing
app.use('/users', users);


// Page Not Found
app.use('/', (req, res, next) => {
  console.log(path.join(__dirname, '404.html'));

  notFound(res);
});


// Running The Server On Port 2000
app.listen(2000);