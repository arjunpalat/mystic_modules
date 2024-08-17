const Category = require("../models/category");
const { validateTax } = require("./controllersHelper");

const getOneOrMoreCategories = async (request, response) => {
  const { name, id } = request.query;
  if (name) {
    const category = await Category.findOne({ name: decodeURIComponent(name) });
    if (category) {
      return response.json(category);
    }
    return response.status(404).json({ error: "Category not found" });
  }

  if (id) {
    const category = await Category.findById(id);
    if (category) {
      return response.json(category);
    }
    return response.status(404).json({ error: "Category not found" });
  }

  const categories = await Category.find({});
  response.json(categories);
};

const createCategory = async (request, response) => {
  const body = request.body;
  const error = validateTax(body);
  if (error) {
    return response.status(400).json({ error });
  }
  const category = new Category({
    name: body.name,
    description: body.description,
    image: body.image,
    taxApplicability: body.taxApplicability,
    tax: body.tax,
    taxType: body.taxType,
  });
  const savedCategory = await category.save();
  response.status(201).json(savedCategory);
};

const updateCategory = async (request, response) => {
  const { id } = request.query;
  const body = request.body;

  const updatedCategory = await Category.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  if (!updatedCategory) {
    return response.status(404).json({ error: "Category not found" });
  }

  response.json(updatedCategory);
};

module.exports = {
  getOneOrMoreCategories,
  createCategory,
  updateCategory,
};
