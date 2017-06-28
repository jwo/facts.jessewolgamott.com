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

app.get("/speak/:id.:format", function(req, res) {
  const fact = facts.randomFact();

  const params = {
    OutputFormat: req.params.format,
    Text: fact,
    TextType: "text",
    VoiceId: "Joanna"
  };
  polly.synthesizeSpeech(params, function(err, data) {
    if (err) {
      res.status(422).json(err);
    } else {

      var filename = req.params.id + req.params.format;
      fs.writeFile('/tmp/'+filename, data.AudioStream, function (err) {
        if (err) {
          console.log("Error:", err)
          res.status(422).json(err);
        } else {
          // Send the audio file
          res.setHeader('content-type', req.params.format === 'mp3' ? 'audio/mpeg' : 'audio/ogg');
          res.download('/tmp/'+filename);
        }
      })
    }
  });
})

const port = (process.env.PORT || 3000)
app.listen(port, function(){
  console.log(`OK, listening on ${port}`)
})
