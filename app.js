//jshint esversion:6

const cool = require('cool-ascii-faces');
const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");

var app = express();
var port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.listen(port, () => {
  console.log("Listening on port: " + port);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.get('/cool', (req, res) => res.send(cool()));

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.post("/", (req, res) => {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;

  var data = {
    members:[
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  var dataJson = JSON.stringify(data);

  var options = {
    uri: 'https://us3.api.mailchimp.com/3.0/lists/2d67b0f463',
    method: "POST",
    headers: {
      'content-type': 'application/json',
      'Authorization': "Borui 2d47b3050ab7da648f1726f86b41723a-us3"
    },
    body: dataJson
  };

  function callback(error, response, body) {
    if(error) {
      res.sendFile(__dirname + "/failure.html");
    } else {
      if(response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    }
  }

  request(options, callback);
});
