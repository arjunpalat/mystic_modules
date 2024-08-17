const Subcategory = require("../models/subcategory");
const Category = require("../models/category");

const getOneOrMoreSubcategories = async (request, response) => {
  const { categoryId, name, id } = request.query;

  if (categoryId) {
    const subcategories = await Subcategory.find({ category: categoryId });
    if (subcategories) {
      return response.json(subcategories);
    }
    return response.status(404).json({ error: "Subcategory not found" });
  }

  if (name) {
    const subcategory = await Subcategory.findOne({ name: name });
    if (subcategory) {
      return response.json(subcategory);
    }
    return response.status(404).json({ error: "Subcategory not found" });
  }

  if (id) {
    const subcategory = await Subcategory.findById(id);
    if (subcategory) {
      return response.json(subcategory);
    }
    return response.status(404).json({ error: "Subcategory not found" });
  }

  const subcategories = await Subcategory.find({});
  response.json(subcategories);
};

const createSubcategory = async (request, response) => {
  const body = request.body;

  if (!body.category) {
    return response.status(400).json({ error: "Category is required" });
  }

  const category = await Category.findById(body.category);
  if (!category) {
    return response.status(400).json({ error: "Invalid category" });
  }

  const subcategory = new Subcategory({
    name: body.name,
    description: body.description,
    image: body.image,
    taxApplicability: body.taxApplicability || category.taxApplicability,
    tax: body.tax || category.tax,
    category: body.category,
  });

  const savedSubcategory = await subcategory.save();
  response.status(201).json(savedSubcategory);
};

const updateSubcategory = async (request, response) => {
  const { id } = request.query;
  const body = request.body;

  const updatedSubcategory = await Subcategory.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  if (!updatedSubcategory) {
    return response.status(404).json({ error: "Subcategory not found" });
  }

  response.json(updatedSubcategory);
};

module.exports = {
  getOneOrMoreSubcategories,
  createSubcategory,
  updateSubcategory,
};
