const express = require('express');
const apiRouter = express.Router();

apiRouter.use(express.json());

const UserDAO = require('./data/UserDAO');

/************\
* API ROUTES *
\************/

apiRouter.get('/users', async (req, res) => {
  let userDAO = new UserDAO();
  res.json(await userDAO.findAll());
});

apiRouter.post('/users', async (req, res) => {
  let userDAO = new UserDAO();
  res.json(await userDAO.create(req.body.name, req.body.email));
});

module.exports = apiRouter;