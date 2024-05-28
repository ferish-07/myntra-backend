const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");

connectToMongo();
const port = 9090;
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
// app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
