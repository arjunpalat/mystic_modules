const Items = require("../models/items");
const Category = require("../models/category");
const Subcategory = require("../models/subcategory");
const category = require("../models/category");
const { validateAmount } = require("./controllersHelper");

/* Get one or more items */
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
    return response.status(404).json({ error: "Items not found" });
  }

  if (category) {
    const items = await Items.find({ category });
    if (items && items.length > 0) {
      return response.json(items);
    }
    return response.status(404).json({ error: "Items not found" });
  }

  const items = await Items.find({});
  response.json(items);
};

/* Create a new item */
const createItem = async (request, response) => {
  const body = request.body;

  if (!body.category && !body.subcategory) {
    return response
      .status(400)
      .json({ error: "Either a category or a subcategory is required" });
  }
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
    body.category = subcategory.category;
  }

  const error = validateAmount(body);
  if (error) {
    return response.status(400).json({ error });
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

/* Update an item */
const updateItem = async (request, response) => {
  const { id } = request.query;
  const body = request.body;
  delete body.totalAmount;

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

  const item = await Items.findById(id);
  if (!item) {
    return response.status(404).json({ error: "Item not found" });
  }

  if (body.baseAmount || body.discount) {
    const newAmtObject = {
      baseAmount: body.baseAmount || item.baseAmount,
      discount: body.discount || item.discount,
    };
    const error = validateAmount(newAmtObject);
    if (error) {
      return response.status(400).json({ error });
    }
    body.totalAmount = newAmtObject.baseAmount - newAmtObject.discount;
  }

  const updatedItem = await Items.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  response.json(updatedItem);
};

module.exports = { getOneOrMoreItems, createItem, updateItem };
