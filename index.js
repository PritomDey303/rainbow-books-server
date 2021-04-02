const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const port = 5000;
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());
console.log(process.env.DB_NAME);
const DB_USER = process.env.DB_USER;
const DB_NAME = process.env.DB_NAME;
const DB_PASS = process.env.DB_PASS;

//////////////////////

const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.yvlli.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const books = client.db(DB_NAME).collection("books");
  const orders = client.db(DB_NAME).collection("orders");

  app.get("/books", (req, res) => {
    books.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/orderdata", (req, res) => {
    const email = req.query.email;
    orders
      .find({ customer_email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.post("/addbooks", (req, res) => {
    const book = req.body;
    books.insertOne(book).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/orders", (req, res) => {
    const orderData = req.body;
    orders.insertOne(orderData).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.delete("/delete/:id", (req, res) => {
    books
      .deleteOne({ _id: ObjectId(req.params.id) })

      .then((result) => res.send(result));
  });
});
/////////////////////

app.listen(process.env.PORT || port);
