const searchRouter = require('express').Router();

const { searchItem } = require('../controllers/search');

searchRouter.get('/', searchItem);

module.exports = searchRouter;