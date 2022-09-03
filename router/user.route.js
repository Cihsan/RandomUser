const express = require("express");

const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const router = express.Router();

// router.get("/", (req, res) => {
//   res.send("tools found with id");
// });

// router.post("/", (req, res) => {
//   res.send("tool added");
// });
router.get("/random",  (req, res) => {
  const users = fs.readFileSync(path.join(__dirname, '../data/userData.json'), 'utf8');
  const user = JSON.parse(users)[Math.floor(Math.random() * JSON.parse(users).length)];
  res.send(user);
});

router.get("/all", (req, res) => {
    const users = fs.readFileSync("../data/userData.json", "utf-8");
    const user = JSON.parse(users);
    const limit = req.query.limit;
    if (limit) {
      res.send(user.slice(0, limit));
    } else {
      res.send(user);
    }
  }),

  router.post("/save", (req, res) => {
    const users = fs.readFileSync("../data/userData.json", "utf-8");
    const user = JSON.parse(users);
    const newUser = req.body;
    if (newUser.id && newUser.name && newUser.contact && newUser.address && newUser.photoUrl && newUser.gender) {
      user.push(newUser);
      fs.writeFileSync("../data/userData.json", JSON.stringify(user));
      res.send(user);
    } else {
      res.status(400).send("Bad Request - Missing required properties");
    }
  }),

  router.patch("/update/:id", (req, res) => {
    const users = fs.readFileSync("../data/userData.json", "utf-8");
    const user = JSON.parse(users);
    const id = Number(req.params.id);
    const updatedData = req.body;
      const index = user.findIndex(user => user.id === id);
    if(!index) {
    if (index !== -1) {
      const result = user[index] = { ...user[index], ...updatedData };
      fs.writeFileSync("../data/userData.json", JSON.stringify(user));
      res.status(200).send(result);
    }
    }
    else {
      res.status(404).send("Not found - 404");
    }
  });


  app.patch("/bulk-update", (req, res) => {
    const users = fs.readFileSync("../data/userData.json", "utf-8");
    const user = JSON.parse(users);
    const ids = req.body.ids;
    const updatedData = req.body.data;
   if(ids && updatedData){
    const updatedUser = user.map(user => {
      if (ids.includes(user.id)) {
        return { ...user, ...updatedData };
      } else {
        return user;
      }
    })
    fs.writeFileSync("../data/userData.json", JSON.stringify(updatedUser));
    res.status(200).send(updatedUser)
   }else{
      res.status(400).send("Bad Request - Missing required properties");
   }
  });

  router.delete("/delete", (req, res) => {
    const users = fs.readFileSync("../data/userData.json", "utf-8");
    const user = JSON.parse(users);
    const id = Number(req.body.id);
    const index = user.findIndex(user => user.id === id);
    if(!index){
      if (index !== -1) {
        user.splice(index, 1);
        fs.writeFileSync("../data/userData.json", JSON.stringify(user));
        res.status(200).send(user);
      }
    }else{
      res.status(404).send("Not found - 404");
    }
  });
module.exports = router;