const subcategoryRouter = require("express").Router();
const { checkAuthorization } = require("../utils/middleware");
const {
  getOneOrMoreSubcategories,
  createSubcategory,
  updateSubcategory,
} = require("../controllers/subcategory");

/* Routes for subcategories */
subcategoryRouter.get("/", getOneOrMoreSubcategories);
subcategoryRouter.post("/", checkAuthorization, createSubcategory);
subcategoryRouter.patch("/", checkAuthorization, updateSubcategory);

module.exports = subcategoryRouter;
