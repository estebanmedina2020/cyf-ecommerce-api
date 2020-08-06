const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();

const pool = new Pool({
  user: "migracode",
  host: "localhost",
  database: "cyf_ecommerce",
  password: "migracode1234",
  port: 5432,
});

app.use(bodyParser.json());
/*
app.get("/products", function (req, res) {
  pool.query(
    "select product_name, supplier_name from products join suppliers on products.supplier_id= suppliers.id;",
    (error, result) => {
      res.json(result.rows);
    }
  );
});

app.get("/products", function (req, res) {
  let name = req.query.name;
  pool
    .query(
      "select product_name, supplier_name from products join suppliers on products.supplier_id= suppliers.id where products.product_name like $1;",
      [name]
    )
    .then((result) => {
      res.json(result.rows);
    })
    .catch((e) => console.error(e));
});

app.get("/customers/:customerId", function (req, res) {
  let customerId = req.params.customerId;
  pool
    .query("SELECT * FROM customers c WHERE c.id = $1", [customerId])
    .then((result) => {
      if (result.rowCount > 0) {
        return res.json(result.rows[0]);
      } else {
        return res
          .status(404)
          .send(`Customer with Id = ${customerId} NOT FOUND`);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("something went wrong :( ...");
    });
});

app.post("/customers", function (req, res) {
  const { name, address, city, country } = req.body;

  pool
    .query(
      "INSERT INTO customers (name, address, city, country) VALUES ($1, $2, $3, $4);",
      [name, address, city, country]
    )
    .then((result) => res.status(201).send("customer created :) !"))
    .catch((error) => {
      console.log(error);
      res.status(500).send("something went wrong :( ...");
    });
});
*/

app.post("/products", function (req, res) {
  const { product_name, unit_price, supplier_id } = req.body;

  if (unit_price < 0) {
    console.log("integer validation");
    return res.status(500).send("Please check the unit price :( ...");
  }

  pool
    .query("SELECT * FROM suppliers WHERE suppliers.id = $1", [supplier_id])
    .then((result) => {
      if (result.rows.length < 1) {
        return res.status(500).send("Supplier ID not found :( ...");
      } else {
        pool
          .query(
            "INSERT INTO products (product_name, unit_price, supplier_id) VALUES ($1, $2, $3);",
            [product_name, unit_price, supplier_id]
          )
          .then((result) => res.status(201).send("product created :) !"))
          .catch((error) => {
            console.log(error);
            res.status(500).send("oopps, something went wrong :( ...");
          });
      }
    })
    .catch((error) =>
      res.status(500).send({
        message: "oopps, something went wrong :( ...",
        error,
      })
    );
});

app.listen(3100, function () {
  console.log("Server is listening on port 3100. Ready to accept requests!");
});
