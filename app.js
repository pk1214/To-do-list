const express = require("express"); // Import the Express.js module

const app = express(); // Create an Express.js application object

const date = require(__dirname + "/data.js"); // Import the date module from data.js file

const mongoose = require("mongoose");

main().catch((err) => console.log(err));

async function main() {
  mongoose.set("strictQuery", false);
  await mongoose.connect(
    "mongodb+srv://admin-prateek:test-123@cluster0.p3lluu0.mongodb.net/todolistDB"
  );
  console.log("Connected to MongoDB");

  const itemsSchema = new mongoose.Schema({
    name: String,
  });

  const Item = mongoose.model("Item", itemsSchema);

  const item1 = new Item({
    name: "Eat",
  });

  const item2 = new Item({
    name: "Sleep",
  });

  const item3 = new Item({
    name: "Repeat",
  });

  const defaultItems = [item1, item2, item3];

  const listSchema = mongoose.Schema({
    name: String,
    items: [itemsSchema],
  });

  const List = mongoose.model("List", listSchema);

  app.set("view engine", "ejs"); // Set the view engine to EJS

  app.use(express.static("public")); // Serve static files from the "public" directory

  app.use(express.urlencoded({ extended: true })); // Parse incoming request bodies in a middleware before handlers

  app.get("/", function (req, res) {
    Item.find({}, function (err, foundItems) {
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("successfully saved items to the database");
          }
          res.redirect("/");
        });
      }
      const day = date.getDate(); // Get the current date
      res.render("list", { listTitle: day, newlistItems: foundItems });
    });
  });

  app.get("/about", function (req, res) {
    // Route for about page
    res.render("about"); // Render the "about" template
  });

  //To make only the first letter capital.
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  app.get("/:customListName", function (req, res) {
    const customListName = capitalizeFirstLetter(req.params.customListName);
    List.findOne({ name: customListName }, function (err, foundList) {
      if (!err) {
        // if (customListName === "About") {
        //   res.render("about");
        // }
        if (!foundList) {
          // Create a new list
          const list = new List({
            name: customListName,
            items: defaultItems,
          });
          list.save();
          res.redirect("/" + customListName);
        } else {
          // Show an existing list
          res.render("list", {
            listTitle: foundList.name,
            newlistItems: foundList.items,
          });
        }
      }
    });
  });

  app.post("/", function (req, res) {
    const itemName = req.body.newItem; // Get the new item from the request body
    const listName = req.body.list;
    const itemNew = new Item({
      name: itemName,
    });
    if (listName === date.getDate()) {
      itemNew.save();
      res.redirect("/");
    } else {
      List.findOne({ name: listName }, function (err, foundList) {
        foundList.items.push(itemNew);
        foundList.save();
        res.redirect("/" + listName);
      });
    }
  });

  app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    if (listName === date.getDate()) {
      Item.findByIdAndDelete(checkedItemId, function (err) {
        if (!err) {
          console.log("Successfully deleted checked item.");
          res.redirect("/");
        }
      });
    } else {
      List.findOne({ name: listName }, function (err, foundList) {
        //******ALTERNATE LINE FROM VIDEO ***************
        foundList.items.pull({ _id: checkedItemId });
        foundList.save();
        res.redirect("/" + listName);
      });
    }
  });

  app.listen(3000, function () {
    // Start the server on port 3000
    console.log("Sever is running on port 3000"); // Log a message to the console when the server is running
  });
}
