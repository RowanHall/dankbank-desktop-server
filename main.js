const express = require('express');
const fs = require('fs');
const app = express()
var socketsbyuuid = {};
var snoosbyuuid = {}
const accountmanager = require("./accountmanager.js")
const fetch = require('node-fetch');

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
app.get('desktopapi.dankbank.io/redditAuth', async (req, res) => {
  var postdata = {
    "method": "POST",
    'headers': {
      'User-Agent': 'DankBank Server',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from("N29L0e4LMXnJLA" + ":" + "vior6LJQ2kkQwp6SS9GRxdyKuV8").toString('base64')
    },
    "body": `grant_type=authorization_code&code=${req.query.code}&redirect_uri=http://desktopapi.dankbank.io/redditAuth`
  }
  var c = await fetch('https://www.reddit.com/api/v1/access_token', postdata)
  var d = await c.json()
  console.log(d, postdata)
  redditAuthed(socketsbyuuid[req.query.state], req.query.state, (snoo) => {
    snoosbyuuid[req.query.state] = snoo
    res.send(accountmanager.redditAuth(req.query.state, d['refresh_token']))
  })
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

var events = require('events').EventEmitter;
var emitter = new events.EventEmitter();

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 81 });
const snoowrap = require('snoowrap');
const snoostorm = require('snoostorm-es6');
function noop() {}
function heartbeat() {
  this.isAlive = true;
}
wss.on('connection', function connection(ws) {
  ws.isAlive = true;
  ws.on('pong', heartbeat);
});
const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 10000);

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    try {
      var data = JSON.parse(message)
      if(!ws.data) {ws.data = {}}
      emitter.emit(data.type, ws, data.data, (data) => {
        ws.data = data
      });
    } catch(err) {
      console.log(err)
      ws.send(JSON.stringify({
        "type": "err",
        "data": 0
      }))
    }
  });
  
  ws.on('close', () => {
    
  })
  
});



//snoowrap get data
wss.clients

const options = {
  userAgent: "Checker for DankBank Desktop / Server",
  clientSecret: "vior6LJQ2kkQwp6SS9GRxdyKuV8",
  clientId: "N29L0e4LMXnJLA",
  username: "SoLoDas",
  password: "rowanfully"
};
const r = new snoowrap(options);
const s = new snoostorm(r);
const submissions = s.Stream("submission", {
  subreddit: "MemeEconomy",
  pollTime: 2500
});
submissions.on("item", item => {
  //console.log(JSON.parse(JSON.stringify(item)))
  wss.clients.forEach(ws => {
    ws.send(JSON.stringify({
      "type": "submission",
      "data": item
    }))
  })
});

emitter.on('authenticate', (ws, inputdata, ret) => {
  var data = ws.data
  if(inputdata.uuid) {
    data.account = accountmanager.getAccount(inputdata.uuid);
    data.uuid = inputdata.uuid
    ret(data)
    if(data.account) {
      socketsbyuuid[inputdata.uuid] = ws;
      if(data.account.reddit) {
        redditAuthed(ws, data.uuid, (snoo) => {
          snoosbyuuid[data.uuid] = snoo
        })
      } else {
        ws.send(JSON.stringify({
          "type": "openURL",
          "data": "https://www.reddit.com/api/v1/authorize?client_id=s05eekpXEMDenA&response_type=code&state=" + inputdata.uuid + "&redirect_uri=http://desktopapi.dankbank.io/redditAuth&duration=permanent&scope=identity%20read%20submit%20vote"
        }))
      }
    } else {
      console.log(data.account)
      console.log("MISSING-ACC")
      ws.send(JSON.stringify({
        "type": "err",
        "data": 1021
      }))
    }
  } else {
    console.log("MISSING-TOKEN")
    ws.send(JSON.stringify({
      "type": "err",
      "data": 0
    }))
  }
})

redditAuthed = (ws, uuid, cb) => {
  if(ws) {
    var token = accountmanager.getAccount(uuid).reddit
    var cfg = {
      userAgent: 'DankBank Server',
      clientId: 's05eekpXEMDenA',
      clientSecret: 'BOGCDA_bD1hAaUQsQ5xuAD4LYQ8',
      refreshToken: token
    }
    console.log(cfg)
    const r = new snoowrap(cfg);
    cb(r)
    r.getSubreddit('MemeEconomy').getNew().then((data) => {
      ws.send(JSON.stringify({
        "type": "batchMemedata",
        "data": data
      }))
    })
    setInterval(() => {
      r.getMe().then(async (self) => {
        var d = await fetch("https://meme.market/api/investor/" + self.name)
        var c = await d.json()
        var data = c
        ws.send(JSON.stringify({
          "type": "batchSelfData",
          "data": {
            "reddit": self,
            "memeec": data
          }
        }));
        var fulldata = [];
        var finished = false
        for(var page = 0; !finished; page++) {
          var c = await fetch("https://meme.market/api/investor/" + self.name + "?per_page=100&page=" + page)
          var d = await c.json()
          if(d == []) {
            finished = true
          } else {
            fulldata = fulldata.concat(d);
          }
        }
        ws.send(JSON.stringify({
          "type": "batchInvestments",
          "data": fulldata
        }));
      })
    }, 10000)
  } else {
    cb()
  }
}