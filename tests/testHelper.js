const Category = require("../models/category");
const Subcategory = require("../models/subcategory");
const Items = require("../models/items");

/* Sample data for Menu to be loaded into the database */
const categories = [
  {
    name: "Indian Main Courses",
    description:
      "Hearty and flavorful dishes that are the centerpiece of an Indian meal.",
    image: "indian_main_courses.jpg",
    taxApplicability: true,
    tax: 5,
    taxType: "percentage",
  },
  {
    name: "Indian Snacks",
    description:
      "Tasty small bites and appetizers enjoyed between meals or as starters.",
    image: "indian_snacks.jpg",
    taxApplicability: true,
    tax: 8,
    taxType: "percentage",
  },
  {
    name: "Indian Desserts",
    description: "Delicious sweet dishes traditionally enjoyed after meals.",
    image: "indian_desserts.jpg",
    taxApplicability: true,
    tax: 10,
    taxType: "percentage",
  },
  {
    name: "Indian Beverages",
    description:
      "Traditional Indian drinks, both hot and cold, often served alongside meals.",
    image: "indian_beverages.jpg",
    taxApplicability: true,
    tax: 5,
    taxType: "percentage",
  },
  {
    name: "Indian Breads",
    description:
      "Various types of Indian breads that accompany curries and main dishes.",
    image: "indian_breads.jpg",
    taxApplicability: false,
    tax: 0,
    taxType: "none",
  },
];

const subcategories = [
  {
    name: "Vegetarian Curries",
    description:
      "Flavorful vegetarian curries made with fresh vegetables, lentils, and paneer.",
    image: "vegetarian_curries.jpg",
    taxApplicability: true,
    tax: 5,
    local_cat_id: 1,
  },
  {
    name: "Non-Vegetarian Curries",
    description: "Rich and hearty curries made with chicken, mutton, or fish.",
    image: "non_vegetarian_curries.jpg",
    taxApplicability: true,
    tax: 5,
    local_cat_id: 1,
  },
  {
    name: "Street Foods",
    description: "Popular Indian street snacks enjoyed by people of all ages.",
    image: "street_foods.jpg",
    taxApplicability: true,
    tax: 8,
    local_cat_id: 2,
  },
  {
    name: "Sweets & Mithai",
    description: "Traditional Indian sweets and confections.",
    image: "sweets_mithai.jpg",
    taxApplicability: true,
    tax: 10,
    local_cat_id: 3,
  },
  {
    name: "Hot Drinks",
    description: "Hot beverages including traditional Indian teas and coffees.",
    image: "hot_drinks.jpg",
    taxApplicability: true,
    tax: 5,
    local_cat_id: 4,
  },
  {
    name: "Cold Drinks",
    description:
      "Refreshing cold drinks including lassis, milkshakes, and soft drinks.",
    image: "cold_drinks.jpg",
    taxApplicability: true,
    tax: 5,
    local_cat_id: 4,
  },
  {
    name: "Flatbreads",
    description: "A variety of Indian flatbreads that complement main dishes.",
    image: "flatbreads.jpg",
    taxApplicability: false,
    tax: 0,
    local_cat_id: 5,
  },
  {
    name: "Stuffed Breads",
    description:
      "Indian breads stuffed with a variety of fillings like potatoes, paneer, and more.",
    image: "stuffed_breads.jpg",
    taxApplicability: false,
    tax: 0,
    local_cat_id: 5,
  },
];

const items = [
  {
    name: "Paneer Butter Masala",
    image: "https://example.com/images/paneer_butter_masala.jpg",
    description:
      "Rich and creamy curry made with paneer in a buttery tomato sauce.",
    taxApplicability: true,
    tax: 5,
    baseAmount: 250,
    discount: 20,
    local_cat_id: 1,
    local_subcat_id: 1,
  },
  {
    name: "Aloo Gobi",
    image: "https://example.com/images/aloo_gobi.jpg",
    description: "A spicy and dry curry made with potatoes and cauliflower.",
    taxApplicability: true,
    tax: 5,
    baseAmount: 180,
    discount: 15,
    local_cat_id: 1,
    local_subcat_id: 1,
  },
  {
    name: "Chicken Tikka Masala",
    image: "https://example.com/images/chicken_tikka_masala.jpg",
    description: "Chunks of grilled chicken in a spiced, creamy tomato curry.",
    taxApplicability: true,
    tax: 12,
    baseAmount: 300,
    discount: 25,
    local_cat_id: 1,
    local_subcat_id: 2,
  },
  {
    name: "Mutton Rogan Josh",
    image: "https://example.com/images/mutton_rogan_josh.jpg",
    description: "Aromatic mutton curry cooked with spices and yogurt.",
    taxApplicability: true,
    tax: 12,
    baseAmount: 350,
    discount: 30,
    local_cat_id: 1,
    local_subcat_id: 2,
  },
  {
    name: "Pani Puri",
    image: "https://example.com/images/pani_puri.jpg",
    description:
      "Crispy hollow puris filled with spicy water and tangy tamarind chutney.",
    taxApplicability: true,
    tax: 8,
    baseAmount: 100,
    discount: 10,
    local_cat_id: 2,
    local_subcat_id: 3,
  },
  {
    name: "Bhel Puri",
    image: "https://example.com/images/bhel_puri.jpg",
    description:
      "A tangy and crunchy mix of puffed rice, vegetables, and tamarind sauce.",
    taxApplicability: true,
    tax: 8,
    baseAmount: 120,
    discount: 15,
    local_cat_id: 2,
    local_subcat_id: 3,
  },
  {
    name: "Gulab Jamun",
    image: "https://example.com/images/gulab_jamun.jpg",
    description:
      "Soft and syrupy dumplings made from khoya, deep-fried and soaked in sugar syrup.",
    taxApplicability: true,
    tax: 10,
    baseAmount: 80,
    discount: 5,
    local_cat_id: 3,
    local_subcat_id: 4,
  },
  {
    name: "Rasgulla",
    image: "https://example.com/images/rasgulla.jpg",
    description: "Soft and spongy cheese balls soaked in sugar syrup.",
    taxApplicability: true,
    tax: 10,
    baseAmount: 90,
    discount: 5,
    local_cat_id: 3,
    local_subcat_id: 4,
  },
  {
    name: "Masala Chai",
    image: "https://example.com/images/masala_chai.jpg",
    description:
      "Traditional Indian tea brewed with spices like ginger, cardamom, and cloves.",
    taxApplicability: true,
    tax: 5,
    baseAmount: 50,
    discount: 5,
    local_cat_id: 4,
    local_subcat_id: 5,
  },
  {
    name: "Filter Coffee",
    image: "https://example.com/images/filter_coffee.jpg",
    description:
      "Strong and flavorful South Indian coffee made with fresh ground beans.",
    taxApplicability: true,
    tax: 5,
    baseAmount: 60,
    discount: 5,
    local_cat_id: 4,
    local_subcat_id: 5,
  },
  {
    name: "Mango Lassi",
    image: "https://example.com/images/mango_lassi.jpg",
    description: "A refreshing yogurt-based drink blended with mango pulp.",
    taxApplicability: true,
    tax: 5,
    baseAmount: 100,
    discount: 10,
    local_cat_id: 4,
    local_subcat_id: 6,
  },
  {
    name: "Rose Milk",
    image: "https://example.com/images/rose_milk.jpg",
    description: "Chilled milk flavored with rose syrup.",
    taxApplicability: true,
    tax: 5,
    baseAmount: 80,
    discount: 10,
    local_cat_id: 4,
    local_subcat_id: 6,
  },
  {
    name: "Naan",
    image: "https://example.com/images/naan.jpg",
    description:
      "Soft and chewy flatbread made from wheat flour, often served with curries.",
    taxApplicability: false,
    tax: 0,
    baseAmount: 40,
    discount: 5,
    local_cat_id: 5,
    local_subcat_id: 7,
  },
  {
    name: "Tandoori Roti",
    image: "https://example.com/images/tandoori_roti.jpg",
    description:
      "Whole wheat flatbread cooked in a tandoor, served hot with butter.",
    taxApplicability: false,
    tax: 0,
    baseAmount: 30,
    discount: 5,
    local_cat_id: 5,
    local_subcat_id: 7,
  },
  {
    name: "Aloo Paratha",
    image: "https://example.com/images/aloo_paratha.jpg",
    description:
      "Whole wheat bread stuffed with a spiced potato filling, served with yogurt or pickle.",
    taxApplicability: false,
    tax: 0,
    baseAmount: 60,
    discount: 10,
    local_cat_id: 5,
    local_subcat_id: 8,
  },
  {
    name: "Paneer Kulcha",
    image: "https://example.com/images/paneer_kulcha.jpg",
    description:
      "Fluffy bread stuffed with spiced paneer filling, baked in a tandoor.",
    taxApplicability: false,
    tax: 0,
    baseAmount: 70,
    discount: 10,
    local_cat_id: 5,
    local_subcat_id: 8,
  },
];

/* Function to save data via Model to the database */
async function saveToDB(Model, data) {
  try {
    const object = new Model(data);
    return await object.save();
  } catch (error) {
    console.error(`Error saving ${Model.modelName}:`, error);
  }
}

/* Function to save the complete sample data into the database */
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

/* Function to empty the database */
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
  countOf: {
    categories: categories.length,
    subcategories: subcategories.length,
    items: items.length,
  },
};
