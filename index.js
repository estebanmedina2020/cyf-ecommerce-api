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
*/
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

app.listen(3100, function () {
  console.log("Server is listening on port 3100. Ready to accept requests!");
});
