const express = require("express");
const app = express();
const port = 4000;
const api = require("./routes/api");
const cors = require("cors");
// const validate = require('validate')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public")); // upload image and access for outside world(means public)

app.use(cors());
// app.use(validate());
app.use("/api", api);

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
