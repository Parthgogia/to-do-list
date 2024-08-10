import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "SQL19post",
  port: 5432
});
db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM items ORDER BY id ASC");
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: result.rows,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try {
    const result = await db.query (`INSERT INTO items (title) VALUES ('${item}') RETURNING id,title`);
    console.log(result.rows);
  } catch (error) {
    console.error("error executing query: ",error);
  }
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const id = req.body.updatedItemId
  const item = req.body.updatedItemTitle;
  try {
    const result=  await db.query ("UPDATE items SET title = ($1) WHERE id = ($2) RETURNING id,title",[item,id]);
    console.log(result.rows);  
    res.redirect("/");  
  } catch (error) {
    console.error("error executing query: ",error);
  }
 });

app.post("/delete", async (req, res) => {
  const item = req.body.deleteItemId;
  console.log(item);
  try {
    await db.query("DELETE FROM items WHERE id = ($1)",[item]);
    res.redirect("/");
  } catch (error) {
    console.error("error executing query: ",error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
