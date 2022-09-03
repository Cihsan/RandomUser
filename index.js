const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

const router=require('./router/user.route')
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome To Random User Data Server");
});

app.use("/user", router);

app.all("*", (req, res) => {
  res.send("route Not exist.");
});


app.listen(port, () => {
  console.log(`Random User Data Running on port ${port}`);
});

process.on("unhandledRejection", (error) => {
  console.log(error.name, error.message);
  app.close(() => {
    process.exit(1);
  });
});