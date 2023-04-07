const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { json } = require("express");
let errorHandler = require("./utils").errorHandler;
const config = require("./config.json");

let app = express();

let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;
let port = process.env.PORT || config.port;

let Hero = mongoose.model(
  "Hero",
  Schema({
    id: ObjectId,
    title: String,
    firstname: String,
    lastname: String,
  })
);

let Bookingform = mongoose.model(
  "Bookingform",
  Schema({
    model: String,
    city: String,
    branch: String,
    date: String,
    title: String,
    firstName: String,
    lastName: String,
    phoneNumber: Number,
    email: String,
  })
);

mongoose
  .connect(
    `mongodb+srv://${config.dbuser}:${config.password}@cluster0.x4x3eny.mongodb.net/${config.dbname}?retryWrites=true&w=majority`
  )
  .then(function () {
    console.log("Db Connected");
  })
  .catch((error) => {
    console.log("Error ", error);
  });

app.use(express.static(__dirname + "/tesla"));
app.use(express.json()).use(cors());
// app.get("/",(req,res)=>{
//     res.send("Hello Express");
// })

//READ
app.get("/data", function (req, res) {
  Hero.find().then((dbres) => res.json(dbres));
});
app.get("/login", (req, res) => {

  res.sendFile(__dirname + '/tesla/index.html');

})

app.post("/savedetails", (req, res) => {
  let a = req.body
  let detail = new Bookingform({
    model: a.model,
    city: a.city,
    branch: a.branch,
    date: a.date,
    title: a.title,
    firstName: a.firstName,
    lastName: a.lastName,
    phoneNumber: a.phoneNumber,
    email: a.email,
  })
  // console.log(detail);
  detail.save().then((db) => {
    res.send("updated")
  })
})

//CREATE

app.post("/data", (req, res) => {
  let hero = new Hero(req.body);
  hero
    .save()
    .then((dbreq) => {
      res.send({ message: "hero added" });
      console.log("db updated");
    })
    .catch((err) => errorHandler);

});

//UPdate

app.post("/update/:hid", (req, res) => {
  console.log("update request received");
  Hero.findByIdAndUpdate({ _id: req.params.hid })
    .then((dbRes) => {
      console.log(dbRes);
      dbRes.title = req.body.title;
      dbRes.firstname = req.body.firstname;
      dbRes.lastname = req.body.lastname;
      dbRes
        .save()
        .then((updateRes) => res.send({ message: "hero info updated" }));
    })
    .catch((error) => errorHandler);
});
//READ UPDATE
app.get("/edit/:heroid", (req, res) => {
  Hero.findById({ _id: req.params.heroid }).then((dbres) => {
    res.send(dbres);
  });
});

//DELETE
app.delete("/delete/:hid", (req, res) => {
  Hero.findByIdAndDelete({ _id: req.params.hid }).then((dbRes) =>
    res.send({ message: "hero deleted", hero: dbRes.title })
  );
});

app.listen(port);
console.log(`Server is now live on : ${port}`);
