const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const facts = require("./src/facts");
const AWS = require('aws-sdk');
const path = require("path");
require('dotenv').config()

app.use(bodyParser.json())
app.use(express.static('public'))

const polly = new AWS.Polly({apiVersion: '2016-06-10', region: 'us-east-1', credentials: {
  accessKeyId: process.env.AWS_SECRET_ID,
  secretAccessKey: process.env.AWS_ACCESS_KEY
}});

app.get("/", function(req, res){
  res.sendFile(path.join(__dirname+'/index.html'))
})

app.post("/speak", function(req, res) {
  const fact = facts.randomFact();

  const params = {
    OutputFormat: "mp3",
    Text: fact,
    TextType: "text",
    VoiceId: "Joanna"
  };
  polly.synthesizeSpeech(params, function(err, data) {
    if (err) {
      res.status(422).json(err);
    } else {
      res.json(data)
    }
  });
})

const port = (process.env.PORT || 3000)
app.listen(port, function(){
  console.log(`OK, listening on ${port}`)
})
