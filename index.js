const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

//middleware
app.use(cors());
app.use(express.json());

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
    await client.connect();

    const gadgetCollection = client.db("GadgetZone").collection("gadget");

    // app.get("/gadget", async (req, res) => {
    //   const result = await gadgetCollection.find().toArray();
    //   res.send(result);
    // });

    app.get("/gadget", async (req, res) => {
      const search = req.query.search || "";
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const brand = req.query.brand || "";
      const category = req.query.category || "";
      const minPrice = parseFloat(req.query.minPrice) || 0;
      const maxPrice = parseFloat(req.query.maxPrice) || Infinity;
      console.log(search);
      let query = {};
      if (search) {
        query = { productName: { $regex: search, $options: "i" } };
      }
      if (brand) {
        query.brand = brand;
      }

      if (category) {
        query.category = category;
      }

      if (minPrice !== 0 || maxPrice !== Infinity) {
        query.price = { $gte: minPrice, $lte: maxPrice };
      }

      const totalItems = await gadgetCollection.countDocuments();
      const result = await gadgetCollection
        .find()
        .skip(page * size)
        .limit(size)
        .toArray();

      res.send({ totalItems, result });
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
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
