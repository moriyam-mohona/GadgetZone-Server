const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//middleware
app.use(express.json());
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://gadgetzone-f7d41.web.app",
  ],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z3gfp8c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const gadgetCollection = client.db("GadgetZone").collection("gadget");
    const cartCollection = client.db("GadgetZone").collection("cart");

    app.post("/gadget", async (req, res) => {
      const newProduct = req.body;
      const result = await gadgetCollection.insertOne(newProduct);
      res.send(result);
    });

    app.get("/gadget", async (req, res) => {
      const search = req.query.search || "";
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const brand = req.query.brand || "";
      const category = req.query.category || "";
      const minPrice = parseFloat(req.query.minPrice) || 0;
      const maxPrice = parseFloat(req.query.maxPrice) || Infinity;
      const sortOrder = req.query.sortOrder || "";

      let query = {};
      if (search) {
        query.productName = { $regex: search, $options: "i" };
      }
      if (brand) {
        query.brand = brand;
      }
      if (category) {
        query.category = category;
      }
      if (minPrice || maxPrice < Infinity) {
        query.price = { $gte: minPrice, $lte: maxPrice };
      }
      let sort = {};
      if (sortOrder === "price_asc") {
        sort.price = 1;
      } else if (sortOrder === "price_desc") {
        sort.price = -1;
      } else if (sortOrder === "date_desc") {
        sort.dateAdded = -1;
      }
      const totalItems = await gadgetCollection.countDocuments(query);
      const result = await gadgetCollection
        .find(query)
        .sort(sort)
        .skip(page * size)
        .limit(size)
        .toArray();

      res.send({ totalItems, result });
    });

    // Cart API's
    app.post("/cart", async (req, res) => {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    });
    app.get("/cart", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is Running");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
