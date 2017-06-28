const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const facts = require("./src/facts");
const AWS = require('aws-sdk');
const path = require("path");
const fs = require("fs");
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

app.get("/speak/:id", function(req, res) {
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

      var filename = req.params.id + ".mp3";
      fs.writeFile('./public/mp3/'+filename, data.AudioStream, function (err) {
        if (err) {
          res.status(422).json(err);
        } else {
          // Send the audio file
          res.setHeader('content-type', 'audio/mpeg');
          res.download('public/mp3/'+filename);
        }
      })
    }
  });
})

const port = (process.env.PORT || 3000)
app.listen(port, function(){
  console.log(`OK, listening on ${port}`)
})
