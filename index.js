const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
require("dotenv").config();

connectToMongo();
const port = process.env.PORT;
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
// app.get("/", (req, res) => {
//   res.send("Hello Harry!");
// });
// app.use("/downloads", express.static(path.join("downloads")));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/categories", require("./routes/category"));
app.use("/api/brands", require("./routes/brands"));
// app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
