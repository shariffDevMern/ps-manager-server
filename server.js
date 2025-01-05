const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = "mongodb+srv://shariffDevMongoDb:Shariff%402425@cluster0.cqokp.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function startServer() {
  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("Connected to MongoDB");

    const collection = client.db("password_manager").collection("user_passwords");

    // API Routes
    app.get("/", (req, res) => {
      res.send("Welcome to my API!");
    });

    app.get("/passwords", async (req, res) => {
      try {
        const passwords = await collection.find({}).toArray();
        res.json(passwords);
      } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).send("An error occurred while fetching passwords.");
      }
    });

    app.post("/users", async (req, res) => {
      try {
        const result = await collection.insertOne({ name: req.body.name });
        res.send("User successfully added!");
      } catch (err) {
        console.error("Error adding user:", err);
        res.status(500).send("An error occurred while adding the user.");
      }
    });

    // Start Server
    app.listen(3001, () => {
      console.log("Server is running on port 3001");
    });
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1); // Exit process on failure
  }
}

startServer();
