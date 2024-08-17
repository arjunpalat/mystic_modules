const Category = require("../models/category");
const Subcategory = require("../models/subcategory");
const Items = require("../models/items");
const mongoose = require("mongoose");

const categories = [
  {
    name: "Italian Main Courses",
    description: "Classic and hearty Italian dishes served as the main course.",
    image: "italian_main_courses.jpg",
    taxApplicability: true,
    tax: 6,
    taxType: "percentage",
  },
  {
    name: "Italian Appetizers",
    description: "Small, flavorful bites to start off an Italian meal.",
    image: "italian_appetizers.jpg",
    taxApplicability: true,
    tax: 8,
    taxType: "percentage",
  },
  {
    name: "Italian Desserts",
    description: "Delicious sweet dishes to complete an Italian meal.",
    image: "italian_desserts.jpg",
    taxApplicability: true,
    tax: 10,
    taxType: "percentage",
  },
  {
    name: "Italian Beverages",
    description: "Traditional Italian drinks, both hot and cold.",
    image: "italian_beverages.jpg",
    taxApplicability: true,
    tax: 5,
    taxType: "percentage",
  },
  {
    name: "Italian Breads",
    description: "Various types of bread served with Italian dishes.",
    image: "italian_breads.jpg",
    taxApplicability: false,
    tax: 0,
    taxType: "none",
  },
];

const subcategories = [
  {
    name: "Pasta Dishes",
    description: "A variety of pasta dishes, a staple of Italian cuisine.",
    image: "pasta_dishes.jpg",
    taxApplicability: true,
    tax: 6,
    local_cat_id: 1,
  },
  {
    name: "Pizza Varieties",
    description:
      "Delicious pizza with a variety of toppings, baked to perfection.",
    image: "pizza_varieties.jpg",
    taxApplicability: true,
    tax: 6,
    local_cat_id: 1,
  },
  {
    name: "Antipasti",
    description: "Traditional Italian appetizers to start your meal.",
    image: "antipasti.jpg",
    taxApplicability: true,
    tax: 8,
    local_cat_id: 2,
  },
  {
    name: "Gelato & Ice Creams",
    description: "Refreshing and creamy Italian frozen desserts.",
    image: "gelato_ice_creams.jpg",
    taxApplicability: true,
    tax: 10,
    local_cat_id: 3,
  },
  {
    name: "Coffee & Espresso",
    description: "Hot Italian beverages, including coffee and espresso.",
    image: "coffee_espresso.jpg",
    taxApplicability: true,
    tax: 5,
    local_cat_id: 4,
  },
  {
    name: "Artisan Breads",
    description: "Handmade Italian breads, perfect with any meal.",
    image: "artisan_breads.jpg",
    taxApplicability: false,
    tax: 0,
    local_cat_id: 5,
  },
];

const items = [
  {
    name: "Spaghetti Carbonara",
    image: "https://example.com/images/spaghetti_carbonara.jpg",
    description:
      "Classic Italian pasta dish with eggs, cheese, pancetta, and pepper.",
    taxApplicability: true,
    tax: 10,
    baseAmount: 200,
    discount: 15,
    local_cat_id: 1,
    local_subcat_id: 1,
  },
  {
    name: "Margherita Pizza",
    image: "https://example.com/images/margherita_pizza.jpg",
    description:
      "Traditional pizza with fresh tomatoes, mozzarella cheese, and basil.",
    taxApplicability: true,
    tax: 10,
    baseAmount: 250,
    discount: 20,
    local_cat_id: 1,
    local_subcat_id: 2,
  },
  {
    name: "Bruschetta",
    image: "https://example.com/images/bruschetta.jpg",
    description: "Grilled bread topped with fresh tomatoes, garlic, and basil.",
    taxApplicability: true,
    tax: 8,
    baseAmount: 120,
    discount: 10,
    local_cat_id: 2,
    local_subcat_id: 3,
  },
  {
    name: "Tiramisu",
    image: "https://example.com/images/tiramisu.jpg",
    description:
      "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cheese.",
    taxApplicability: true,
    tax: 12,
    baseAmount: 180,
    discount: 10,
    local_cat_id: 3,
    local_subcat_id: 4,
  },
  {
    name: "Espresso",
    image: "https://example.com/images/espresso.jpg",
    description: "Strong and rich Italian coffee.",
    taxApplicability: true,
    tax: 5,
    baseAmount: 50,
    discount: 5,
    local_cat_id: 4,
    local_subcat_id: 5,
  },
  {
    name: "Focaccia",
    image: "https://example.com/images/focaccia.jpg",
    description:
      "Soft and flavorful Italian flatbread, often topped with herbs and olive oil.",
    taxApplicability: false,
    tax: 0,
    baseAmount: 100,
    discount: 10,
    local_cat_id: 5,
    local_subcat_id: 6,
  },
];

async function saveToDB(Model, data) {
  try {
    const object = new Model(data);
    return await object.save();
  } catch (error) {
    console.error(`Error saving ${Model.modelName}:`, error);
  }
}

const loadDB = async () => {
  const categoryMap = new Map();
  const subcategoryMap = new Map();
  let num = 1;
  for (const category of categories) {
    const savedCategory = await saveToDB(Category, category);
    categoryMap.set(num, savedCategory._id);
    num++;
  }
  num = 1;
  for (const subcategory of subcategories) {
    const categoryId = categoryMap.get(subcategory.local_cat_id);
    if (categoryId) {
      const saveObject = {
        ...subcategory,
        category: categoryId,
      };
      delete saveObject.local_cat_id;
      const savedSubcategory = await saveToDB(Subcategory, saveObject);
      subcategoryMap.set(num, savedSubcategory._id);
      num++;
    }
  }

  for (const item of items) {
    const categoryId = categoryMap.get(item.local_cat_id);
    const subcategoryId = subcategoryMap.get(item.local_subcat_id);
    if (categoryId) {
      await saveToDB(Items, {
        ...item,
        category: categoryId,
        subcategory: subcategoryId || null,
        totalAmount: item.baseAmount - item.discount,
      });
    }
  }
};

const emptyDB = async () => {
  try {
    await Promise.all([
      Category.deleteMany({}),
      Subcategory.deleteMany({}),
      Items.deleteMany({}),
    ]);
  } catch (error) {
    console.error("Error emptying database:", error);
  }
};

module.exports = {
  loadDB,
  emptyDB,
};
