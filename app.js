//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const bcrypt = require("bcrypt");
const session = require('express-session');
const saltRounds = 11;

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));


mongoose.connect("mongodb://localhost:27017/tiffinDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  name : String,
  phoneNo : {
    type : String,
    minLength : 10,
    maxLength : 10
  },
  address : String,
  password : String
});

const User = mongoose.model("User" , userSchema);

// const user = new User({
//   name: 'Omkar Harade',
//   phoneNo: '8169660492',
//   address: 'India',
//   password: 'qwerty'
// });

// user.save();

app.get("/", function(req, res) {
  res.render("landing-page");
});

app.get("/signup", function(req, res) {
  res.render("signup");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/error", function(req, res){
  res.render("error");
});



// bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
//
//   const newUser = new User({
//     email: req.body.username,
//     password: hash
//   });
//
//   newUser.save(function(err) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render("secrets");
//     }
//   });
//
// });

app.post("/signup", function(req,res){

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

    bcrypt.compare(req.body.reEnterPassword, hash).then(function(result) {
         if(result === true){
           console.log("error in passwords");
           const register = new User({
           name: req.body.name,
           phoneNo: req.body.phoneNo,
           address: req.body.address,
           password: hash
         });

           register.save();
           console.log('successfully registered');
           res.redirect("/");
        }
        else{
          console.log("error in passwords");
          res.redirect("/error");
        }
      });

    });

});

app.post("/login", function(req, res){

  const username = req.body.myPhoneNo;
  const password =req.body.password;

  User.findOne({
    phoneNo: username
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password).then(function(result) {
      if(result === true){
        console.log("success");
        res.render("menu");
      }
      else{
        console.log("fail");
        res.render("error");
      }
  });
      }
    }
  });
});


app.listen(3000, function() {
  console.log("server started on port 3000");
});
