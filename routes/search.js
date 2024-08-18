const searchRouter = require('express').Router();
const { searchItem } = require('../controllers/search');

/* Route for searching items */
searchRouter.get('/', searchItem);

module.exports = searchRouter;