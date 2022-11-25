const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
// const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 8000;

// middlewares
app.use(cors());
app.use(express.json());
console.log(process.env.DB_USER);

// Database Connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qbydxwz.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const cetegoriesCollection = client.db("bestBags").collection("categories");
    const productsCollection = client.db("bestBags").collection("products");

    // Get all Products
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const allProducts = await cursor.toArray();
      res.send(allProducts);
    });

    // Get all Categories
    app.get("/categories", async (req, res) => {
      const query = {};
      const cursor = cetegoriesCollection.find(query);
      const allCategories = await cursor.toArray();
      res.send(allCategories);
    });

    // Get individual Category
    app.get("/categories/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const category = await cetegoriesCollection.findOne(query);
      res.send(category);
    });

    console.log("Database Connected...");
  } finally {
  }
}

run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.listen(port, () => {
  console.log(`Server is running...on ${port}`);
});
