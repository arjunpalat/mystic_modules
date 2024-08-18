/*
This file contains tests for the API endpoints of the application.
The tests are divided into three sections: Category, Subcategory, and Item.
Each section contains tests for GET, POST, and PATCH requests.
The tests are written using the node:test module and the supertest library.
*/

const { test, after, beforeEach, describe, before } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const assert = require("assert");
const { loadDB, emptyDB, countOf } = require("./testHelper");
const config = require("../utils/config");
const category = require("../models/category");

const api = supertest(app);

/* 
// Reset the database before running each test //
beforeEach(async () => {
  await emptyDB();
  await loadDB();
}); 
*/

describe("API TEST", () => {
  /* Empty the database and load sample data before starting the tests */
  before(async () => {
    await emptyDB();
    await loadDB();
    console.log("Reset DB successfully");
  });

  /* CATEGORY TEST */
  describe("CATEGORY TEST", () => {
    describe("GET", () => {
      test("Categories are returned as json", async () => {
        await api
          .get("/api/categories")
          .expect(200)
          .expect("Content-Type", /application\/json/);
      });

      test("All categories are returned", async () => {
        const categories = await api.get("/api/categories");
        assert.strictEqual(categories.body.length, countOf.categories);
      });

      test("A category can be fetched by id", async () => {
        const categories = await api.get("/api/categories");
        const id = categories.body[0].id;

        const category = await api.get(`/api/categories?id=${id}`);
        assert.strictEqual(category.body.id, id);
      });

      test("A category can be fetched by name", async () => {
        const categories = await api.get("/api/categories");
        const name = categories.body[0].name;

        const category = await api.get(`/api/categories?name=${name}`);
        assert.strictEqual(category.body.name, name);
      });
    });
    describe("POST", () => {
      test("Authorization is required to add a category", async () => {
        const newCategory = {
          name: "Tandoori Delights",
          description:
            "Savor the smoky, aromatic flavors of our Tandoori Delights, where each dish is marinated to perfection and cooked in a traditional clay oven.",
          image: "tandoori.jpg",
          taxApplicability: true,
          tax: 5,
          taxType: "percentage",
        };

        await api.post("/api/categories").send(newCategory).expect(401);
      });

      test("A valid category can be added if authorized", async () => {
        const newCategory = {
          name: "Tandoori Delights",
          description:
            "Savor the smoky, aromatic flavors of our Tandoori Delights, where each dish is marinated to perfection and cooked in a traditional clay oven.",
          image: "tandoori.jpg",
          taxApplicability: true,
          tax: 5,
          taxType: "percentage",
        };

        await api
          .post("/api/categories")
          .set("Authorization", `Bearer ${config.SECRET}`)
          .send(newCategory)
          .expect(201)
          .expect("Content-Type", /application\/json/);

        const categories = await api.get("/api/categories");
        assert(
          categories.body
            .map((category) => category.name)
            .includes("Tandoori Delights")
        );
      });

      test("A category cannot be added without a name", async () => {
        const categories = await api.get("/api/categories");
        const newCategory = {
          description:
            "Savor the smoky, aromatic flavors of our Tandoori Delights, where each dish is marinated to perfection and cooked in a traditional clay oven.",
          image: "tandoori.jpg",
          taxApplicability: true,
          tax: 5,
          taxType: "percentage",
        };

        await api
          .post("/api/categories")
          .set("Authorization", `Bearer ${config.SECRET}`)
          .send(newCategory)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        const updatedCategories = await api.get("/api/categories");
        assert.strictEqual(
          categories.body.length,
          updatedCategories.body.length
        );
      });

      test("A category requires a unique name", async () => {
        const categories = await api.get("/api/categories");
        const newCategory = {
          name: categories.body[0].name,
          description:
            "Savor the smoky, aromatic flavors of our Tandoori Delights, where each dish is marinated to perfection and cooked in a traditional clay oven.",
          image: "tandoori.jpg",
          taxApplicability: true,
          tax: 5,
          taxType: "percentage",
        };

        await api
          .post("/api/categories")
          .set("Authorization", `Bearer ${config.SECRET}`)
          .send(newCategory)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        const updatedCategories = await api.get("/api/categories");
        assert.strictEqual(
          categories.body.length,
          updatedCategories.body.length
        );
      });

      test("Tax applicability is required for a category", async () => {
        const categories = await api.get("/api/categories");
        const newCategory = {
          name: "NC1",
          description:
            "Savor the smoky, aromatic flavors of our Tandoori Delights, where each dish is marinated to perfection and cooked in a traditional clay oven.",
          image: "tandoori.jpg",
          tax: 5,
          taxType: "percentage",
        };

        await api
          .post("/api/categories")
          .set("Authorization", `Bearer ${config.SECRET}`)
          .send(newCategory)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        const updatedCategories = await api.get("/api/categories");
        assert.strictEqual(
          categories.body.length,
          updatedCategories.body.length
        );
      });

      test("Tax is required if tax applicable", async () => {
        const categories = await api.get("/api/categories");
        const newCategory = {
          name: "NC2",
          description:
            "Savor the smoky, aromatic flavors of our Tandoori Delights, where each dish is marinated to perfection and cooked in a traditional clay oven.",
          image: "tandoori.jpg",
          taxApplicability: true,
          taxType: "percentage",
        };

        await api
          .post("/api/categories")
          .set("Authorization", `Bearer ${config.SECRET}`)
          .send(newCategory)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        const updatedCategories = await api.get("/api/categories");
        assert.strictEqual(
          categories.body.length,
          updatedCategories.body.length
        );
      });

      test("Tax type is required if tax applicable", async () => {
        const categories = await api.get("/api/categories");
        const newCategory = {
          name: "NC3",
          description:
            "Savor the smoky, aromatic flavors of our Tandoori Delights, where each dish is marinated to perfection and cooked in a traditional clay oven.",
          image: "tandoori.jpg",
          taxApplicability: true,
          tax: 5,
        };

        await api
          .post("/api/categories")
          .set("Authorization", `Bearer ${config.SECRET}`)
          .send(newCategory)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        const updatedCategories = await api.get("/api/categories");
        assert.strictEqual(
          categories.body.length,
          updatedCategories.body.length
        );
      });
    });

    describe("PATCH", () => {
      test("Authorization is required to update a category", async () => {
        const categories = await api.get("/api/categories");
        const id = categories.body[0].id;

        const updatedCategory = {
          name: "Updated Category",
          description: "Updated description",
          image: "updated.jpg",
        };

        await api
          .patch(`/api/categories?id=${id}`)
          .send(updatedCategory)
          .expect(401);
      });

      test("A category can be updated if authorized", async () => {
        const categories = await api.get("/api/categories");
        const id = categories.body[0].id;

        const updatedCategory = {
          name: "Updated Category",
          description: "Updated description",
          image: "updated.jpg",
        };

        await api
          .patch(`/api/categories?id=${id}`)
          .set("Authorization", `Bearer ${config.SECRET}`)
          .send(updatedCategory)
          .expect(200)
          .expect("Content-Type", /application\/json/);

        const category = await api.get(`/api/categories?id=${id}`);
        assert.strictEqual(category.body.name, "Updated Category");
      });

      test("An updated category name cannot be empty and must be unique", async () => {
        const categories = await api.get("/api/categories");
        const id = categories.body[0].id;

        const updatedCategory = {
          name: categories.body[1].name,
        };

        await api
          .patch(`/api/categories?id=${id}`)
          .set("Authorization", `Bearer ${config.SECRET}`)
          .send(updatedCategory)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        const category = await api.get(`/api/categories?id=${id}`);
        assert.strictEqual(category.body.name, categories.body[0].name);
      });
    });
  });

  /* SUBCATEGORY TEST */
  describe("SUBCATEGORY TEST", () => {
    describe("GET", () => {
      test("Subcategories are returned as json", async () => {
        await api
          .get("/api/subcategories")
          .expect(200)
          .expect("Content-Type", /application\/json/);
      });

      test("All subcategories are returned", async () => {
        const subcategories = await api.get("/api/subcategories");
        assert.strictEqual(subcategories.body.length, countOf.subcategories);
      });

      test("A subcategory can be fetched by id", async () => {
        const subcategories = await api.get("/api/subcategories");
        const id = subcategories.body[0].id;

        const subcategory = await api.get(`/api/subcategories?id=${id}`);
        assert.strictEqual(subcategory.body.id, id);
      });

      test("A subcategory can be fetched by name", async () => {
        const subcategories = await api.get("/api/subcategories");
        const name = subcategories.body[0].name;

        const subcategory = await api.get(`/api/subcategories?name=${name}`);
        assert.strictEqual(subcategory.body.name, name);
      });
    });

    describe("POST", () => {
      test("Authorization is required to add a subcategory", async () => {
        const categories = await api.get("/api/categories");
        const newSubcategory = {
          name: "Grilled Specialties",
          description:
            "A selection of items that are grilled to perfection, offering a smoky and flavorful experience.",
          image: "grilled_specialties.jpg",
          taxApplicability: true,
          tax: 7,
          category: categories.body[0].id,
        };

        await api.post("/api/subcategories").send(newSubcategory).expect(401);
      });

      test("A valid subcategory can be added if authorized", async () => {
        const categories = await api.get("/api/categories");

        const newSubcategory = {
          name: "Spicy Main",
          description: "Spicy main course dishes",
          image: "spicy.jpg",
          taxApplicability: true,
          tax: 18,
          category: categories.body[0].id,
        };

        await api
          .post("/api/subcategories")
          .set("Authorization", `Bearer ${config.SECRET}`)
          .send(newSubcategory)
          .expect(201);

        const subcategories = await api.get("/api/subcategories");
        assert(
          subcategories.body
            .map((subcategory) => subcategory.name)
            .includes("Spicy Main")
        );
      });

      test("A subcategory cannot be added without a name", async () => {
        const subcategories = await api.get("/api/subcategories");
        const categories = await api.get("/api/categories");

        const newSubcategory = {
          description: "Spicy main course dishes",
          image: "spicy.jpg",
          taxApplicability: true,
          tax: 18,
          category: categories.body[0].id,
        };

        await api
          .post("/api/subcategories")
          .set("Authorization", `Bearer ${config.SECRET}`)
          .send(newSubcategory)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        const updatedSubcategories = await api.get("/api/subcategories");
        assert.strictEqual(
          subcategories.body.length,
          updatedSubcategories.body.length
        );
      });

      test("A subcategory requires a unique name", async () => {
        const subcategories = await api.get("/api/subcategories");
        const categories = await api.get("/api/categories");
        const newSubcategory = {
          name: subcategories.body[0].name,
          description: "Spicy main course dishes",
          image: "spicy.jpg",
          taxApplicability: true,
          tax: 18,
          category: categories.body[0].id,
        };

        await api
          .post("/api/subcategories")
          .set("Authorization", `Bearer ${config.SECRET}`)
          .send(newSubcategory)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        const updatedSubcategories = await api.get("/api/subcategories");
        assert.strictEqual(
          subcategories.body.length,
          updatedSubcategories.body.length
        );
      });

      test("Adding a subcategory requires a valid category", async () => {
        const subcategories = await api.get("/api/subcategories");
        const newSubcategory = {
          name: "Spicy Main",
          description: "Spicy main course dishes",
          image: "spicy.jpg",
          taxApplicability: true,
          tax: 18,
          category: "invalid",
        };

        await api
          .post("/api/subcategories")
          .set("Authorization", `Bearer ${config.SECRET}`)
          .send(newSubcategory)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        const updatedSubcategories = await api.get("/api/subcategories");
        assert.strictEqual(
          subcategories.body.length,
          updatedSubcategories.body.length
        );
      });

      test("Tax details are inherited from parent category if not provided", async () => {
        const categories = await api.get("/api/categories");

        const newSubcategory = {
          name: "SC1",
          description: "Spicy main course dishes",
          image: "spicy.jpg",
          category: categories.body[0].id,
        };

        await api
          .post("/api/subcategories")
          .set("Authorization", `Bearer ${config.SECRET}`)
          .send(newSubcategory)
          .expect(201)
          .expect("Content-Type", /application\/json/);

        const subcategories = await api.get("/api/subcategories");
        const subcategory = subcategories.body.find(
          (subcategory) => subcategory.name === "SC1"
        );
        assert.strictEqual(
          subcategory.taxApplicability,
          categories.body[0].taxApplicability
        );
        assert.strictEqual(subcategory.tax, categories.body[0].tax);
      });
    });

    describe("PATCH", () => {
      test("Authorization is required to update a subcategory", async () => {
        const subcategories = await api.get("/api/subcategories");
        const id = subcategories.body[0].id;

        const updatedSubcategory = {
          name: "Updated Subcategory",
          description: "Updated description",
          image: "updated.jpg",
        };

        await api
          .patch(`/api/subcategories?id=${id}`)
          .send(updatedSubcategory)
          .expect(401);
      });

      test("A subcategory can be updated if authorized", async () => {
        const subcategories = await api.get("/api/subcategories");
        const id = subcategories.body[0].id;

        const updatedSubcategory = {
          name: "Updated Subcategory",
          description: "Updated description",
          image: "updated.jpg",
        };

        await api
          .patch(`/api/subcategories?id=${id}`)
          .set("Authorization", `Bearer ${config.SECRET}`)
          .send(updatedSubcategory)
          .expect(200)
          .expect("Content-Type", /application\/json/);

        const subcategory = await api.get(`/api/subcategories?id=${id}`);
        assert.strictEqual(subcategory.body.name, "Updated Subcategory");
      });

      test("Validation is performed while updating parent category of a subcategory", async () => {
        const subcategories = await api.get("/api/subcategories");
        const categories = await api.get("/api/categories");
        const id = subcategories.body[0].id;

        const updatedSubcategory = {
          category: "invalid",
        };

        await api
          .patch(`/api/subcategories?id=${id}`)
          .set("Authorization", `Bearer ${config.SECRET}`)
          .send(updatedSubcategory)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        const subcategory = await api.get(`/api/subcategories?id=${id}`);
        assert.strictEqual(
          subcategory.body.category,
          subcategories.body[0].category
        );
      });

      test("An updated subcategory name must be unique and non-empty", async () => {
        const subcategories = await api.get("/api/subcategories");
        const id = subcategories.body[0].id;

        const updatedSubcategory = {
          name: subcategories.body[1].name,
        };

        await api
          .patch(`/api/subcategories?id=${id}`)
          .set("Authorization", `Bearer ${config.SECRET}`)
          .send(updatedSubcategory)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        const subcategory = await api.get(`/api/subcategories?id=${id}`);
        assert.strictEqual(subcategory.body.name, subcategories.body[0].name);
      });
    });
  });

  /* ITEM TEST */
  describe("ITEM TEST", () => {
    describe("GET", () => {
      test("Items are returned as json", async () => {
        await api
          .get("/api/items")
          .expect(200)
          .expect("Content-Type", /application\/json/);
      });

      test("All items are returned", async () => {
        const items = await api.get("/api/items");
        assert.strictEqual(items.body.length, countOf.items);
      });

      test("An item can be fetched by id", async () => {
        const items = await api.get("/api/items");
        const id = items.body[0].id;

        const item = await api.get(`/api/items?id=${id}`);
        assert.strictEqual(item.body.id, id);
      });

      test("An item can be fetched by name", async () => {
        const items = await api.get("/api/items");
        const name = items.body[0].name;

        const item = await api.get(`/api/items?name=${name}`);
        assert.strictEqual(item.body.name, name);
      });

      test("Items can be fetched by category", async () => {
        const items = await api.get("/api/items");
        const category = items.body[0].category;

        const item = await api.get(`/api/items?category=${category}`);
        assert.strictEqual(item.body[0].category, category);
      });

      test("Items can be fetched by subcategory", async () => {
        const items = await api.get("/api/items");
        const subcategory = items.body[0].subcategory;

        const item = await api.get(`/api/items?subcategory=${subcategory}`);
        assert.strictEqual(item.body[0].subcategory, subcategory);
      });
    });

    describe("POST", () => {
      test("Authorization is required to add an item", async () => {
        const newItem = {
          name: "New Item",
          description:
            "Grilled bread rubbed with garlic and topped with tomatoes, olive oil, salt, and basil.",
          image: "https://example.com/images/New Item.jpg",
          taxApplicability: true,
          tax: 5,
          baseAmount: 50,
          discount: 5,
        };

        await api.post("/api/items").send(newItem).expect(401);
      });

      test("A valid item can be added if authorized", async () => {
        const categories = await api.get("/api/categories");
        const subcategories = await api.get("/api/subcategories");

        const newItem = {
          name: "New Item",
          description:
            "Grilled bread rubbed with garlic and topped with tomatoes, olive oil, salt, and basil.",
          image: "https://example.com/images/New Item.jpg",
          taxApplicability: true,
          tax: 5,
          baseAmount: 50,
          discount: 5,
          category: categories.body[0].id,
          subcategory: subcategories.body[0].id,
        };

        await api
          .post("/api/items")
          .set("Authorization", `Bearer ${config.SECRET}`)
          .send(newItem)
          .expect(201);

        const items = await api.get("/api/items");
        assert(
          items.body.map((item) => item.name).includes("New Item"),
          "New Item not found"
        );
      });

      test("An item cannot be added without a name", async () => {
        const items = await api.get("/api/items");
        const categories = await api.get("/api/categories");
        const subcategories = await api.get("/api/subcategories");

        const newItem = {
          description:
            "Grilled bread rubbed with garlic and topped with tomatoes, olive oil, salt, and basil.",
          image: "https://example.com/images/New Item.jpg",
          taxApplicability: true,
          tax: 5,
          baseAmount: 50,
          discount: 5,
          category: categories.body[0].id,
          subcategory: subcategories.body[0].id,
        };

        await api
          .post("/api/items")
          .set("Authorization", `Bearer ${config.SECRET}`)
          .send(newItem)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        const updatedItems = await api.get("/api/items");
        assert.strictEqual(items.body.length, updatedItems.body.length);
      });

      test("An item requires a unique name", async () => {
        const items = await api.get("/api/items");
        const categories = await api.get("/api/categories");
        const subcategories = await api.get("/api/subcategories");

        const newItem = {
          name: items.body[0].name,
          description:
            "Grilled bread rubbed with garlic and topped with tomatoes, olive oil, salt, and basil.",
          image: "https://example.com/images/New Item.jpg",
          taxApplicability: true,
          tax: 5,
          baseAmount: 50,
          discount: 5,
          category: categories.body[0].id,
          subcategory: subcategories.body[0].id,
        };

        await api
          .post("/api/items")
          .set("Authorization", `Bearer ${config.SECRET}`)
          .send(newItem)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        const updatedItems = await api.get("/api/items");
        assert.strictEqual(items.body.length, updatedItems.body.length);
      });

      test("Either a valid category or valid subcategory is required for adding an item", async () => {
        const items = await api.get("/api/items");

        const newItem = {
          name: "I1",
          description:
            "Grilled bread rubbed with garlic and topped with tomatoes, olive oil, salt, and basil.",
          image: "https://example.com/images/New Item.jpg",
          taxApplicability: true,
          tax: 5,
          baseAmount: 50,
          discount: 5,
        };

        await api
          .post("/api/items")
          .set("Authorization", `Bearer ${config.SECRET}`)
          .send(newItem)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        const updatedItems = await api.get("/api/items");
        assert.strictEqual(items.body.length, updatedItems.body.length);
      });

      test("Discount cannot be greater than base amount", async () => {
        const categories = await api.get("/api/categories");
        const subcategories = await api.get("/api/subcategories");

        const newItem = {
          name: "I2",
          description:
            "Grilled bread rubbed with garlic and topped with tomatoes, olive oil, salt, and basil.",
          image: "https://example.com/images/New Item.jpg",
          taxApplicability: true,
          tax: 5,
          baseAmount: 50,
          discount: 60,
          category: categories.body[0].id,
          subcategory: subcategories.body[0].id,
        };

        await api
          .post("/api/items")
          .set("Authorization", `Bearer ${config.SECRET}`)
          .send(newItem)
          .expect(400)
          .expect("Content-Type", /application\/json/);
      });

      test("Total amount is calculated correctly for an added item", async () => {
        const categories = await api.get("/api/categories");
        const subcategories = await api.get("/api/subcategories");

        const newItem = {
          name: "I3",
          description:
            "Grilled bread rubbed with garlic and topped with tomatoes, olive oil, salt, and basil.",
          image: "https://example.com/images/New Item.jpg",
          taxApplicability: true,
          tax: 5,
          baseAmount: 50,
          discount: 5,
          totalAmount: 5000,
          category: categories.body[0].id,
          subcategory: subcategories.body[0].id,
        };

        await api
          .post("/api/items")
          .set("Authorization", `Bearer ${config.SECRET}`)
          .send(newItem)
          .expect(201)
          .expect("Content-Type", /application\/json/);

        const items = await api.get("/api/items");
        const item = items.body.find((item) => item.name === "New Item");
        assert.strictEqual(
          item.totalAmount,
          newItem.baseAmount - newItem.discount
        );
      });
    });

    describe("PATCH", () => {
      test("Authorization is required to update an item", async () => {
        const items = await api.get("/api/items");
        const id = items.body[0].id;

        const updatedItem = {
          name: "Updated Item",
          description: "Updated description",
          image: "updated.jpg",
        };

        await api.patch(`/api/items?id=${id}`).send(updatedItem).expect(401);
      });

      test("An item can be updated if authorized", async () => {
        const items = await api.get("/api/items");
        const id = items.body[0].id;

        const updatedItem = {
          name: "Updated Item",
          description: "Updated description",
          image: "updated.jpg",
        };

        await api
          .patch(`/api/items?id=${id}`)
          .set("Authorization", `Bearer ${config.SECRET}`)
          .send(updatedItem)
          .expect(200)
          .expect("Content-Type", /application\/json/);

        const item = await api.get(`/api/items?id=${id}`);
        assert.strictEqual(item.body.name, "Updated Item");
      });

      test("Discount cannot be greater than base amount", async () => {
        const items = await api.get("/api/items");
        const id = items.body[0].id;

        const updatedItem = {
          baseAmount: 50,
          discount: 60,
        };

        await api
          .patch(`/api/items?id=${id}`)
          .set("Authorization", `Bearer ${config.SECRET}`)
          .send(updatedItem)
          .expect(400)
          .expect("Content-Type", /application\/json/);

        const item = await api.get(`/api/items?id=${id}`);
        assert.strictEqual(item.body.discount, items.body[0].discount);
      });

      test("Total amount is calculated correctly after updating either base amount or discount or both", async () => {
        const items = await api.get("/api/items");
        const id = items.body[0].id;

        const updatedItem = {
          baseAmount: 50,
          discount: 5,
        };

        await api
          .patch(`/api/items?id=${id}`)
          .set("Authorization", `Bearer ${config.SECRET}`)
          .send(updatedItem)
          .expect(200)
          .expect("Content-Type", /application\/json/);

        const item = await api.get(`/api/items?id=${id}`);
        assert.strictEqual(item.body.totalAmount, 45);
      });

      test("Total amount cannot be directly updated or tampered", async () => {
        const items = await api.get("/api/items");
        const id = items.body[0].id;

        const updatedItem = {
          totalAmount: 100,
        };

        await api
          .patch(`/api/items?id=${id}`)
          .set("Authorization", `Bearer ${config.SECRET}`)
          .send(updatedItem)
          .expect(200)
          .expect("Content-Type", /application\/json/);

        const item = await api.get(`/api/items?id=${id}`);
        assert.strictEqual(item.body.totalAmount, items.body[0].totalAmount);
      });
    });
  });

  describe("SEARCH TEST", () => {
    describe("GET", () => {
      test("An existing item can be searched by name", async () => {
        const items = await api.get("/api/items");
        const name = encodeURIComponent(items.body[0].name);
        const item = await api.get(`/api/search?name=${name}`);
        assert.strictEqual(
          item.body.success,
          `Item named ${items.body[0].name} found`
        );
      });

      test("An non-existing item can be searched by name", async () => {
        const name = encodeURIComponent("Non-existing Item");
        const item = await api.get(`/api/search?name=${name}`);
        assert.strictEqual(item.body.error, "Item not found");
      });
    });
  });
});

/* Close the database connection after running the tests */
after(async () => {
  await mongoose.connection.close();
  console.log("Closed DB connection");
});
