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
    const usersCollection = client.db("bestBags").collection("users");
    const bookingsCollection = client.db("bestBags").collection("bookings");

    // Get all Products
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const allProducts = await cursor.toArray();
      res.send(allProducts);
    });

    // Get individual Product by ID
    app.get("/products/:id", async (req, res) => {
      const productId = req.params.id;
      const cursor = productsCollection.find({ id: productId });
      const productDetails = await cursor.toArray();
      res.send(productDetails);
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

    // booking post
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
      console.log(result);
    });

    // get all bookings for user
    app.get("/bookings", async (req, res) => {
      let query = {};
      const email = req.query.email;
      if (email) {
        query = {
          buyerEmail: email,
        };
      }
      const result = await bookingsCollection.find(query).toArray();
      console.log(result);
      res.send(result);
    });

    // save user email & generate jwt
    app.put("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      console.log(user);
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      // const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      //   expiresIn: "7d",
      // });
      res.send({  result });
    });

     app.post("/users", async (req, res) => {
       const user = req.body;
       console.log(user);
       const result = await usersCollection.insertOne(user);
       res.send(result);
     });

    // get individual user role
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      console.log(user);
      res.send(user);
    });

    // get all user
    app.get("/users", async (req, res) => {
      const query = {};
      const users = await userCollection.find(query).toArray();
      res.send(users);
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
