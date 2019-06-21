const express = require('express');
const fs = require('fs');
const app = express()

const accountmanager = require("./accountmanager.js")

app.use(function(req, res, next){
  req.headers.host = (req.headers.host.split(".dev.localhost").join(""))
  req.url = req.headers.host + req.url;
  next();
});

app.use(function(req, res, next){
  console.log(req.url)
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
  if(req.query.email.split("@").length == 2 && req.query.email.split(".").length > 1) {
    res.send(accountmanager.makeAccount(req.query.username, req.query.password, req.query.email))
  } else {
    res.send({
      "ERROR": "Email Invalid"
    })
  }

})
app.get('desktopapi.dankbank.io/authenticate', (req, res) => {
  res.send(accountmanager.authenticate(req.query.username, req.query.password))
})
app.get('desktopapi.dankbank.io/destroyAccount', (req, res) => {
  res.send(accountmanager.destroyAccount(req.query.uuid))
})
app.get('desktop.dankbank.io/redditAuth', (req, res) => {
  res.send(accountmanager.redditAuth(req.query.state, req.query.code))
})

app.get('*', (req, res) => {
  res.send("Failed to process your request to: " + req.url)
})

app.listen(80)