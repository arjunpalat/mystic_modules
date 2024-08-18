const categoryRouter = require("express").Router();
const { checkAuthorization } = require("../utils/middleware");
const {
  getOneOrMoreCategories,
  createCategory,
  updateCategory,
} = require("../controllers/category");

/* Routes for categories */
categoryRouter.get("/", getOneOrMoreCategories);
categoryRouter.post("/", checkAuthorization, createCategory);
categoryRouter.patch("/", checkAuthorization, updateCategory);

module.exports = categoryRouter;
