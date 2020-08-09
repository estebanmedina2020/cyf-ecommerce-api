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


app.post("/customers/:customerId/orders", function (req, res) {
  let customerId = req.params.customerId;
  let { orderDate, orderReference } = req.body;

  pool
    .query("SELECT * FROM customers c WHERE c.id = $1", [customerId])
    .then((result) => {
      console.log(result);
      if (result.rowCount > 0) {
        pool
          .query(
            "INSERT INTO orders (order_date, order_reference, customer_id) VALUES ($1, $2, $3)",
            [orderDate, orderReference, customerId]
          )
          .then((secondResult) =>
            res.status(201).send("order created for customer ${customerId}")
          )
          .catch((error) => {
            console.log(error);
            res.status(500).send("Could Not Save The Order :( ...");
          });
      } else {
        return res.status(400).send("Customer With ID ${customerId} NOT FOUND");
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("something went wrong :( ...");
    });
});


app.put("/customers/:customerId", function (req,res) {
    const {newName, newAddress, newCity, newCountry} = req.body;
    const customerId = req.params.customerId;
    pool
    .query("UPDATE customers SET name=$1, address=$2, city=$3, country=$4 WHERE id=$5", [newName, newAddress, newCity, newCountry, customerId])
    .then(() => res.send(`Customer ${customerId} Update!`))
    .catch((e) => console.error(e));
});


app.delete("/orders/:orderId", function (req, res) {
  const orderId = req.params.orderId;
  let query = "DELETE FROM order_items WHERE order_id=$1";
  pool
    .query(query, [orderId])
    .then(() => {
      pool
        .query("DELETE FROM orders WHERE id=$1", [orderId])
        .then(() => res.send(`Order ${orderId} Deleted`))
        .catch((e) => console.error(e));
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("something went wrong :(..");
    });
});


app.delete("/customers/:customersId", function (req, res) {
  let customerId = req.params.customerId;

  pool
    .query("SELECT * FROM orders WHERE customer_id=$1", [customerId])
    .then((result) => {
      if (result.rows.length <= 0) {
        pool
          .query("DELETE FROM customers WHERE id=$1", [customerId])
          .then((result) =>
            res.status(201).send(`Customer ${customerId} was Deleted !`)
          )
          .catch((error) => {
            console.log(error);
            res.status(500).send("error my friend");
          });
      } else {
        return res
          .status(400)
          .send("The Customers has Orders, can not be deleted!");
      }
    });
});
*/

app.get("/customers/:customerId/orders", function (req, res) {
  const customerId = req.params.customerId;
  const query = `SELECT 
    customers.name,
    orders.order_reference,
    orders.order_date,
    products.product_name,
    products.unit_price,
    suppliers.supplier_name,
    suppliers.country,
    order_items.quantity
    FROM customers
    INNER JOIN orders ON customer_id = customers.id
    INNER JOIN order_items ON order_id = orders.id
    INNER JOIN products ON products.id = order_items.product_id
    INNER JOIN suppliers ON suppliers.id = products.supplier_id
    WHERE customers.id = $1`;

  pool
    .query(query, [customerId])
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});

app.listen(3100, function () {
  console.log("Server is listening on port 3100. Ready to accept requests!");
});
