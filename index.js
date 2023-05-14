const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { urlencoded } = require("body-parser");
const User = require("./Schemas/User");
const Log = require("./Schemas/log");
require("dotenv").config();

app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(express.static("public"));
async function main() {
  await mongoose.connect(process.env.MONGOOSE, {  });
  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
  });

  app
    .route("/api/users")
    .post(function (req, res) {
      let newUser = new User(req.body);
      newUser.save();
      res.json(newUser.toJSON());
    })
    .get(async function (req, res) {
      let users = await User.find({}).select(["_id", "username"]);
      res.json(users);
    });
  app.get(
    "/api/users/:_id/logs",
    function (req, res, next) {
      res.match = {};

      if ("from" in req.query || "to" in req.query) res.match.date = {};
      if (req.query.from) res.match.date.$gt = new Date(req.query.from);
      if (req.query.to) res.match.date.$lt = new Date(req.query.to);
      next();
    },
    async function (req, res) {
      let user = await User.findById(req.params._id)
        .select({ log: 1 })
        .populate({
          path: "log",
          match: res.match,
          limit: req.query.limit
        })
        .exec()
        .catch((e) => console.error(e));
      const userJSON = user.toJSON();
      userJSON.count = userJSON.log.length;
      res.json(userJSON);
    }
  );
  app.post("/api/users/:_id/exercises", async function (req, res) {
    const log = await Log.create(req.body);
    const user = await User.findByIdAndUpdate(
      req.params._id,
      {
        $push: { log: log._id },
      },
      { new: true }
    ).select('username');

    res.json({ ...log.toJSON(), ...user.toJSON()});
  });

  const listener = app.listen(process.env.PORT || 3000, () => {
    console.log("Your app is listening on port " + listener.address().port);
  });
}
main().catch((e) => console.error(e));
