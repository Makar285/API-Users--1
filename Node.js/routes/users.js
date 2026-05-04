// Express Import
const express = require("express");
const router = express.Router();


// Other Import
const fs = require("fs");
const path = require("path");


// My file Import
const { notFound } = require("../helpers");
const { type } = require("os");


// Variables
const pathUsersFile = path.join(__dirname, "..", "users.json");


// Routings:
// Update Data User
router.get(/\/update\/id=(\d+)&name=([^&]+)&age=(\d+)&isDelete=(true|false)/, (req, res, next) => {
  const regex = /\/update\/id=(\d+)&name=([^&]+)&age=(\d+)&isDelete=((true|false))/;
  const match = req.originalUrl.split("/users")[1].match(regex);

  const id = match[1];
  const name = match[2].replaceAll("+", " ");
  const age = match[3];
  const isDelete = (match[4] === 'true')? (true): (false);

  console.log(id, name, age, isDelete);

  fs.readFile(pathUsersFile, (err, data) => {
    if (!err) {
      const newData = JSON.parse(data.toString());
      for (const user of newData) {
        if (user.id === +id) {
          user.name = name;
          user.age = +age;
          user.isDelete = isDelete;
        }
      }

      fs.writeFile(pathUsersFile, JSON.stringify(newData), (err) => {
        if (!err) {
          res.setHeader("Content-Type", "application/json");
          res.send(newData);
        }
      });
    }
  });
});

// Add User
router.get(/\/addUser\/name=([^&]+)&age=(\d+)&isDelete=(true|false)/, (req, res, next) => {
  const regex = /\/addUser\/name=([^&]+)&age=(\d+)&isDelete=(true|false)/;
  const match = req.originalUrl.split('/users')[1].match(regex);

  const name = match[1].replaceAll('+', ' ');
  const age = match[2];
  const isDelete = (match[3] === 'true')? (true): (false);

  fs.readFile(pathUsersFile, (err, data) => {
    if(!err) {
      const users = JSON.parse(data);
      
      let idNewUser = 0;
      for (const user of users) {
        if(user.id > idNewUser) {
          idNewUser = user.id;
        };
      };

      const idUserInArray = users.length;

      console.log(idUserInArray);

      const newUser = {
        id: idNewUser+1,
        name,
        age,
        isDelete
      };

      users[idUserInArray] = newUser;

      fs.writeFile(pathUsersFile, JSON.stringify(users), (err) => {
        if(!err) {
          res.setHeader('Content-Type', 'application/json');
          res.send(users);
        };
      });
    };
  });
});

// Delete User By Id
router.get(/\/delete\/id=(\d+)/, (req, res, next) => {
  const id = req.url.match(/\/delete\/id=(\d+)/)[1];

  fs.readFile(pathUsersFile, (err, data) => {
    if(!err) {
      const newData = JSON.parse(data.toString());

      let currentUser;
      for (const user of newData) {
        if(user.id === +id) {
          currentUser = user
        };
      };

      const indexUserInArray = newData.indexOf(currentUser);
      
      currentUser.isDelete = true;

      newData[indexUserInArray] = currentUser;

      fs.writeFile(pathUsersFile, JSON.stringify(newData), (err) => {
        if(!err) {
          res.setHeader("Content-Type", "application/json");
          res.send(newData);
        };
      });
    };
  });
});

// Return The User By Id
router.get(/\/id=(\d+)/, (req, res, next) => {
  const stringQueryOneParametr = req.url.split("=");

  const id = stringQueryOneParametr[1];

  fs.readFile(pathUsersFile, (err, data) => {
    if (!err) {
      const dataJson = JSON.parse(data);

      let user;
      for (const obj of dataJson) {
        if (+obj.id === +id) {
          user = obj;
        };
      };

      if (user) {
        res.setHeader("Content-Type", "application/json");
        res.send(user);
      } else {
        notFound(res);
      };
    };
  });
});

// Return All Users
router.get("/", (req, res, next) => {
  const data = fs.readFile(pathUsersFile, (err, data) => {
    if(!err) {
      res.setHeader("Content-Type", "application/json");
      res.send(data);
    };
  });
});


// Export
module.exports = router;
