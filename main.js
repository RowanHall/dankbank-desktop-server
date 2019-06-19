const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express()
const port = 3000

const accountmanager = require("./accountmanager.js")

app.use(function(req, res, next){
  req.headers.host = (req.headers.host.split(".dev.localhost").join(""))
  req.url = req.headers.host + req.url;
  next(); 
});

app.get('localhost/', (req, res) => {
  res.send("REG")
})
app.get('desktopapi.dankbank.io/getAccount', (req, res) => {
  res.send(accountmanager.getAccount(req.query.uuid))
})
app.get('desktopapi.dankbank.io/redditAuth', (req, res) => {
  res.send(accountmanager.redditAuth(req.query.state, req.query.code))
})
app.get('desktopapi.dankbank.io/makeAccount', (req, res) => {
  res.send(accountmanager.makeAccount(req.query.username, req.query.password))
})
app.get('desktopapi.dankbank.io/authenticate', (req, res) => {
  res.send(accountmanager.authenticate(req.query.username, req.query.password))
})
app.get('desktopapi.dankbank.io/destroyAccount', (req, res) => {
  res.send(accountmanager.destroyAccount(req.query.uuid))
})

https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: 'YOUR PASSPHRASE HERE'
}, app).listen(443, console.log("LISTENING"))