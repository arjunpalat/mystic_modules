const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const assert = require("assert");
const { loadDB, emptyDB } = require("./testHelper");
const config = require("../utils/config");

const api = supertest(app);

beforeEach(async () => {
  await emptyDB();
  await loadDB();
});

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
      assert.strictEqual(categories.body.length, 5);
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

    test("An invalid category cannot be added", async () => {
      const newCategory = {
        name: "Tandoori Delights",
        description:
          "Savor the smoky, aromatic flavors of our Tandoori Delights, where each dish is marinated to perfection and cooked in a traditional clay oven.",
        image: "tandoori.jpg",
        taxApplicability: true,
        tax: 9,
      };

      await api
        .post("/api/categories")
        .set("Authorization", `Bearer ${config.SECRET}`)
        .send(newCategory)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const categories = await api.get("/api/categories");
      assert.strictEqual(categories.body.length, 5);
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
  });
});

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
      assert.strictEqual(subcategories.body.length, 6);
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
      const newSubcategory = {
        name: "Cricket Bat",
        description: "Cricket bat for all ages",
        image: "cricket-bat.jpg",
        taxApplicability: true,
        tax: 18,
      };

      await api.post("/api/subcategories").send(newSubcategory).expect(401);
    });

    test("A valid subcategory can be added if authorized", async () => {
      const categoryNameEncoded = encodeURIComponent("Italian Main Courses");
      const category = await api.get(
        `/api/categories?name=${categoryNameEncoded}`
      );

      const newSubcategory = {
        name: "Cricket Bat",
        description: "Cricket bat for all ages",
        image: "cricket-bat.jpg",
        taxApplicability: true,
        tax: 18,
        category: category.body.id,
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
          .includes("Cricket Bat")
      );
    });

    test("An invalid subcategory cannot be added", async () => {
      const newSubcategory = {
        name: "Cricket Bat",
        description: "Cricket bat for all ages",
        image: "cricket-bat.jpg",
        taxApplicability: true,
        tax: 18,
      };

      await api
        .post("/api/subcategories")
        .set("Authorization", `Bearer ${config.SECRET}`)
        .send(newSubcategory)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const subcategories = await api.get("/api/subcategories");
      assert.strictEqual(subcategories.body.length, 6);
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
  });
});

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
      assert.strictEqual(items.body.length, 6);
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
      const catName = encodeURIComponent("Italian Main Courses");
      const subcatName = encodeURIComponent("Pasta Dishes");
      const category = await api.get(`/api/categories?name=${catName}`);
      const subcategory = await api.get(
        `/api/subcategories?name=${subcatName}`
      );

      const newItem = {
        name: "New Item",
        description:
          "Grilled bread rubbed with garlic and topped with tomatoes, olive oil, salt, and basil.",
        image: "https://example.com/images/New Item.jpg",
        taxApplicability: true,
        tax: 5,
        baseAmount: 50,
        discount: 5,
        category: category.body.id,
        subcategory: subcategory.body.id,
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

    test("An invalid item cannot be added", async () => {
      const newItem = {
        name: "Bruschetta",
        description:
          "Grilled bread rubbed with garlic and topped with tomatoes, olive oil, salt, and basil.",
        image: "https://example.com/images/bruschetta.jpg",
        taxApplicability: true,
        tax: 5,
        discount: 5,
      };

      await api
        .post("/api/items")
        .set("Authorization", `Bearer ${config.SECRET}`)
        .send(newItem)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const items = await api.get("/api/items");
      assert.strictEqual(items.body.length, 6);
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

      await api
        .patch(`/api/items?id=${id}`)
        .send(updatedItem)
        .expect(401);
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
  });
});

describe("SEARCH TEST", () => {
  describe("GET", () => {
    test("A valid item can be searched by name", async () => {
      const name = encodeURIComponent("Focaccia");
      const item = await api.get(`/api/search?name=${name}`);
      assert.strictEqual(item.body.success, "Item named Focaccia found");
    });

    test("An invalid item cannot be searched by name", async () => {
      const name = encodeURIComponent("Lorem Ipsum");
      const item = await api.get(`/api/search?name=${name}`);
      assert.strictEqual(item.body.error, "Item not found");
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
