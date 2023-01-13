const express = require("express"); // Import the Express.js module

const app = express(); // Create an Express.js application object

const date = require(__dirname + "/data.js"); // Import the date module from data.js file

let items = ["Buy Food", "Cook Food", "Eat Food"]; // Initialize an array for main page items

let workItems = []; // Initialize an array for work page items

app.set("view engine", "ejs"); // Set the view engine to EJS

app.use(express.static("public")); // Serve static files from the "public" directory

app.use(express.urlencoded({ extended: true })); // Parse incoming request bodies in a middleware before handlers

app.get("/", function (req, res) {
  // Route for main page
  const day = date.getDate(); // Get the current date
  res.render("list", { listTitle: day, newlistItems: items }); // Render the "list" template with the date as the title and the main page items
});

app.get("/work", function (req, res) {
  // Route for work page
  res.render("list", { listTitle: "Work List", newlistItems: workItems }); // Render the "list" template with "Work List" as the title and the work page items
});

app.get("/about", function (req, res) {
  // Route for about page
  res.render("about"); // Render the "about" template
});

app.post("/", function (req, res) {
  // Route to handle POST requests
  console.log(req.body); // Log the request body to the console
  let item = req.body.newItem; // Get the new item from the request body
  if (req.body.list === "Work List") {
    // Check if the new item is for the work page
    workItems.push(item); // Add the new item to the work page items array
    res.redirect("/work"); // Redirect the user to the work page
  } else {
    items.push(item); // Add the new item to the main page items array
    res.redirect("/"); // Redirect the user to the main page
  }
});

app.listen(3000, function () {
  // Start the server on port 3000
  console.log("Sever is running on port 3000"); // Log a message to the console when the server is running
});
