const itemsRouter = require("express").Router();
const { checkAuthorization } = require("../utils/middleware");
const {
  getOneOrMoreItems,
  createItem,
  updateItem,
} = require("../controllers/items");

itemsRouter.get("/", getOneOrMoreItems);
itemsRouter.post("/", checkAuthorization, createItem);
itemsRouter.patch("/", checkAuthorization, updateItem);

module.exports = itemsRouter;
