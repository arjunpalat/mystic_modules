const Items = require("../models/items");

const searchItem = async (request, response) => {
  const name = decodeURIComponent(request.query.name);

  if (!name) {
    return response.status(400).json({ error: "Name of item is required" });
  }

  const item = await Items.findOne({ name });
  if (item) {
    return response.json({ success: `Item named ${item.name} found` });
  }
  response.status(404).json({ error: "Item not found" });
};

module.exports = {
  searchItem,
};
