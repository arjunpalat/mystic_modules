const Items = require("../models/items");
const Category = require("../models/category");
const Subcategory = require("../models/subcategory");

const getOneOrMoreItems = async (request, response) => {
  const { subcategory, name, id, category } = request.query;

  if (name) {
    const item = await Items.findOne({ name: decodeURIComponent(name) });
    if (item) {
      return response.json(item);
    }
    return response.status(404).json({ error: "Item not found" });
  }

  if (id) {
    const item = await Items.findById(id);
    if (item) {
      return response.json(item);
    }
    return response.status(404).json({ error: "Item not found" });
  }

  if (subcategory) {
    const items = await Items.find({ subcategory });
    if (items) {
      return response.json(items);
    }
    return response.status(404).json({ error: "Item not found" });
  }

  if (category) {
    const items = await Items.find({ category });
    if (items) {
      return response.json(items);
    }
    return response.status(404).json({ error: "Item not found" });
  }

  const items = await Items.find({});
  response.json(items);
};

const createItem = async (request, response) => {
  const body = request.body;

  if (!body.category) {
    return response.status(400).json({ error: "Category is required" });
  }

  const category = await Category.findById(body.category);
  if (!category) {
    return response.status(400).json({ error: "Category not found" });
  }

  if (body.subcategory) {
    const subcategory = await Subcategory.findById(body.subcategory);
    if (!subcategory) {
      return response.status(400).json({ error: "Subcategory not found" });
    }
  }

  const item = new Items({
    name: body.name,
    description: body.description,
    image: body.image,
    baseAmount: body.baseAmount,
    subcategory: body.subcategory || null,
    category: body.category,
    taxApplicability: body.taxApplicability || category.taxApplicability,
    tax: body.tax || category.tax,
    discount: body.discount,
    totalAmount: body.baseAmount - body.discount,
  });

  const savedItem = await item.save();
  response.status(201).json(savedItem);
};

const updateItem = async (request, response) => {
  const { id } = request.query;
  const body = request.body;

  if (body.category) {
    const category = await Category.findById(body.category);
    if (!category) {
      return response.status(400).json({ error: "Category not found" });
    }
  }

  if (body.subcategory) {
    const subcategory = await Subcategory.findById(body.subcategory);
    if (!subcategory) {
      return response.status(400).json({ error: "Subcategory not found" });
    }
  }

  const updatedItem = await Items.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  if (!updatedItem) {
    return response.status(404).json({ error: "Item not found" });
  }

  response.json(updatedItem);
};

module.exports = { getOneOrMoreItems, createItem, updateItem };
