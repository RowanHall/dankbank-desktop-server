const express = require('express');
var cookieParser = require('cookie-parser')
const request = require('request-promise').defaults({ json: true, baseUrl: 'https://www.reddit.com/api/v1/' })
const fs = require('fs');
const app = express()
app.use(cookieParser())
var socketsbyuuid = {};
var snoosbyuuid = {};
global.loops = {};
const accountmanager = require("./accountmanager.js")
const fetch = require('node-fetch');
const FormData = require('form-data');
const chalk = require('chalk');
const uuidv4 = require('uuid/v4')
const requestregular = require('request');
const https = require('https');

function sort_by_key(array, key)
{
 return array.sort(function(a, b)
 {
  var x = a[key]; var y = b[key];
  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
 });
}

global.posthistory = {}

app.use(function(req, res, next){
  req.headers.host = (req.headers.host.split(".dev.localhost").join(""))
  req.url = req.headers.host + req.url;
  next();
});

app.use(function(req, res, next){
  console.log(chalk.red("S <H- B"), chalk.blue(req.url))
  console.log(chalk.green("S -H> B"), chalk.blue(req.url))
  next();
});

app.get('dankbank.io/', (req, res) => {
  res.type('.html')
  res.send(fs.readFileSync(__dirname + "/HTML/HOME/index.html", 'utf-8'))
})
app.get('dankbank.io/home/index.css', (req, res) => {
  res.type('.css')
  res.send(fs.readFileSync(__dirname + "/HTML/HOME/index.css"))
})
app.get('dankbank.io/homepreload.js', (req, res) => {
  res.type('.js')
  res.send(fs.readFileSync(__dirname + "/HTML/HOME/preload.js"))
})
app.get('dankbank.io/homepostload.js', (req, res) => {
  res.type('.js')
  res.send(fs.readFileSync(__dirname + "/HTML/HOME/postload.js"))
})
app.get('dankbank.io/CDN/logo_outline.png', (req, res) => {
  res.type('.png')
  res.send(fs.readFileSync(__dirname + "/CDN/logo_outline.png"))
})
app.get('dankbank.io/settings', (req, res) => {
  res.type('.html')
  res.send(fs.readFileSync(__dirname + "/HTML/settings/index.html", "utf-8"))
})
app.get('dankbank.io/settings/index.css', (req, res) => {
  res.type('.css')
  res.send(fs.readFileSync(__dirname + "/HTML/settings/index.css"))
})
app.get('dankbank.io/settings/index.js', (req, res) => {
  res.type('.js')
  res.send(fs.readFileSync(__dirname + "/HTML/settings/index.js"))
})
app.get('dankbank.io/CDN/buildings.jpeg', (req, res) => {
  res.type('.jpeg')
  res.send(fs.readFileSync(__dirname + "/CDN/buildings.jpeg"))
})
app.get('dankbank.io/CDN/laptop.png', (req, res) => {
  res.type('.png')
  res.send(fs.readFileSync(__dirname + "/CDN/laptop.png"))
})
app.get('dankbank.io/CDN/phone.png', (req, res) => {
  res.type('.png')
  res.send(fs.readFileSync(__dirname + "/CDN/phone.png"))
})
app.get('dankbank.io/CDN/devices.png', (req, res) => {
  res.type('.png')
  res.send(fs.readFileSync(__dirname + "/CDN/devices.png"))
})
app.get('desktopapi.dankbank.io/getAccount', (req, res) => {
  res.send(accountmanager.getAccount(req.query.uuid))
})
app.get('desktopapi.dankbank.io/redditAuth', async (req, res) => {
  if(req.query.code) {
    console.log(chalk.green("S -R> R"), chalk.blue(`acsess_token('${req.query.code}')`))
    var d = await request.post({
      uri: 'access_token',
      auth: { user: "s05eekpXEMDenA", pass: "BOGCDA_bD1hAaUQsQ5xuAD4LYQ8" || '' },
      form: { grant_type: 'authorization_code', code: req.query.code, redirect_uri: "http://desktopapi.dankbank.io/redditAuth" },
    })
    console.log(chalk.red("S <R- R"), chalk.blue(`acsess_token('${req.query.code}')`))
    console.log(d)
    accountmanager.redditAuth(req.query.state, d.refresh_token)
    redditAuthed(socketsbyuuid[req.query.state], req.query.state, (snoo) => {
      snoosbyuuid[req.query.state] = snoo
      res.send(fs.readFileSync(__dirname + "/HTML/AUTH/index.html", 'utf-8'))
    })
  } else {
    res.send(fs.readFileSync(__dirname + "/HTML/AUTH/failed.html", 'utf-8'))
  }
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
app.get('webapi.dankbank.io/authenticate', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.send(accountmanager.authenticate(req.query.username, req.query.password))
})
app.get('webapi.dankbank.io/makeAccount', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if(req.query.email.split("@").length == 2 && req.query.email.split(".").length > 1) {
    var z = accountmanager.makeAccount(req.query.username, req.query.password, req.query.email)
    res.send(z)
  } else {
    res.send({
      "ERROR": "Email Invalid"
    })
  }
})
app.get('web.dankbank.io/', (req, res) => {
  if(req.cookies.uuid) {
    res.redirect("home")
  } else {
    res.redirect("notauthed")
  }
})
app.get('web.dankbank.io/notauthed', (req, res) => {
  res.type('.html')
  res.send(fs.readFileSync(__dirname + "/HTML/notauthed/index.html", 'utf-8'))
})
app.get('web.dankbank.io/notauthed/index.css', (req, res) => {
  res.type('.css')
  res.send(fs.readFileSync(__dirname + "/HTML/notauthed/index.css", 'utf-8'))
})
app.get('web.dankbank.io/notauthed/index.js', (req, res) => {
  res.type('.js')
  res.send(fs.readFileSync(__dirname + "/HTML/notauthed/index.js", 'utf-8'))
})
app.get('web.dankbank.io/login', (req, res) => {
  if(req.query.uuid) {
    res.cookie("uuid", req.query.uuid)
    res.redirect("home")
  } else {
    res.send(fs.readFileSync(__dirname + "/HTML/login/index.html", 'utf-8'))
  }
})
app.get('web.dankbank.io/login/index.css', (req, res) => {
  res.type('.css')
  res.send(fs.readFileSync(__dirname + "/HTML/login/index.css", 'utf-8'))
})
app.get('web.dankbank.io/login/index.js', (req, res) => {
  res.type('.js')
  res.send(fs.readFileSync(__dirname + "/HTML/login/index.js", 'utf-8'))
})
app.get('web.dankbank.io/createaccount', (req, res) => {
  if(req.query.uuid) {
    res.cookie("uuid", req.query.uuid)
    res.redirect("home")
  } else {
    res.send(fs.readFileSync(__dirname + "/HTML/createaccount/index.html", 'utf-8'))
  }
})
app.get('web.dankbank.io/createaccount/index.css', (req, res) => {
  res.type('.css')
  res.send(fs.readFileSync(__dirname + "/HTML/createaccount/index.css", 'utf-8'))
})
app.get('web.dankbank.io/createaccount/index.js', (req, res) => {
  res.type('.js')
  res.send(fs.readFileSync(__dirname + "/HTML/createaccount/index.js", 'utf-8'))
})
app.get('web.dankbank.io/home', (req, res) => {
  if(req.cookies.uuid) {
    res.send(fs.readFileSync(__dirname + "/HTML/apphome/index.html", 'utf-8'))
  } else {
    res.redirect("http://web.dankbank.io/notauthed")
  }
  res.send(fs.readFileSync(__dirname + "/HTML/apphome/index.html", 'utf-8'))
})
app.get('web.dankbank.io/home/index.css', (req, res) => {
  res.type('.css')
  res.send(fs.readFileSync(__dirname + "/HTML/apphome/index.css", 'utf-8'))
})
app.get('web.dankbank.io/home/index.js', (req, res) => {
  res.type('.js')
  res.send(fs.readFileSync(__dirname + "/HTML/apphome/index.js", 'utf-8'))
})
app.get('web.dankbank.io/home/index2.js', (req, res) => {
  res.type('.js')
  res.send(fs.readFileSync(__dirname + "/HTML/apphome/index2.js", 'utf-8'))
})
app.get('web.dankbank.io/home/Chart.js', (req, res) => {
  res.type('.js')
  res.send(fs.readFileSync(__dirname + "/HTML/apphome/Chart.js", 'utf-8'))
})
app.get('web.dankbank.io/home/ChartModern.js', (req, res) => {
  res.type('.js')
  res.send(fs.readFileSync(__dirname + "/HTML/apphome/ChartModern.js", 'utf-8'))
})
app.get('web.dankbank.io/home/Luminous.js', (req, res) => {
  res.type('.js')
  res.send(fs.readFileSync(__dirname + "/HTML/apphome/Luminous.js", 'utf-8'))
})
app.get('web.dankbank.io/home/nextpayout.svg', (req, res) => {
  res.type('.svg')
  res.send(fs.readFileSync(__dirname + "/HTML/apphome/nextpayout.svg", 'utf-8'))
})
app.get('web.dankbank.io/home/members.svg', (req, res) => {
  res.type('.svg')
  res.send(fs.readFileSync(__dirname + "/HTML/apphome/members.svg", 'utf-8'))
})
app.get('web.dankbank.io/home/tax.svg', (req, res) => {
  res.type('.svg')
  res.send(fs.readFileSync(__dirname + "/HTML/apphome/tax.svg", 'utf-8'))
})
app.get('web.dankbank.io/home/visibility.svg', (req, res) => {
  res.type('.svg')
  res.send(fs.readFileSync(__dirname + "/HTML/apphome/visibility.svg", 'utf-8'))
})
app.get('web.dankbank.io/home/level.svg', (req, res) => {
  res.type('.svg')
  res.send(fs.readFileSync(__dirname + "/HTML/apphome/level.svg", 'utf-8'))
})
app.get('web.dankbank.io/home/leave.svg', (req, res) => {
  res.type('.svg')
  res.send(fs.readFileSync(__dirname + "/HTML/apphome/leave.svg", 'utf-8'))
})
app.get('web.dankbank.io/home/leave0.svg', (req, res) => {
  res.type('.svg')
  res.send(fs.readFileSync(__dirname + "/HTML/apphome/leave0.svg", 'utf-8'))
})
app.get('web.dankbank.io/home/bal.svg', (req, res) => {
  res.type('.svg')
  res.send(fs.readFileSync(__dirname + "/HTML/apphome/bal.svg", 'utf-8'))
})
app.get('web.dankbank.io/home/upvotes.svg', (req, res) => {
  res.type('.svg')
  res.send(fs.readFileSync(__dirname + "/HTML/apphome/upvotes.svg", 'utf-8'))
})
app.get('web.dankbank.io/home/breakeven.svg', (req, res) => {
  res.type('.svg')
  res.send(fs.readFileSync(__dirname + "/HTML/apphome/breakeven.svg", 'utf-8'))
})
app.get('web.dankbank.io/home/maxprofit.svg', (req, res) => {
  res.type('.svg')
  res.send(fs.readFileSync(__dirname + "/HTML/apphome/maxprofit.svg", 'utf-8'))
})
app.get('web.dankbank.io/home/firm.svg', (req, res) => {
  res.type('.svg')
  res.send(fs.readFileSync(__dirname + "/HTML/apphome/firm.svg", 'utf-8'))
})
app.get('web.dankbank.io/home/bal.svg', (req, res) => {
  res.type('.svg')
  res.send(fs.readFileSync(__dirname + "/HTML/apphome/bal.svg", 'utf-8'))
})
app.get('web.dankbank.io/home/level.svg', (req, res) => {
  res.type('.svg')
  res.send(fs.readFileSync(__dirname + "/HTML/apphome/level.svg", 'utf-8'))
})
app.get('web.dankbank.io/home/bank.jpg', (req, res) => {
  res.type('.jpg')
  res.send(fs.readFileSync(__dirname + "/HTML/apphome/bank.jpg"))
})
app.get('web.dankbank.io/home/clock.svg', (req, res) => {
  res.type('.svg')
  res.send(fs.readFileSync(__dirname + "/HTML/apphome/clock.svg", 'utf-8'))
})
app.get('web.dankbank.io/home/kickuser.svg', (req, res) => {
  res.type('.svg')
  res.send(fs.readFileSync(__dirname + "/HTML/apphome/kickuser.svg", 'utf-8'))
})
app.get('web.dankbank.io/home/promoteuser.svg', (req, res) => {
  res.type('.svg')
  res.send(fs.readFileSync(__dirname + "/HTML/apphome/promoteuser.svg", 'utf-8'))
})
app.get('web.dankbank.io/home/demoteuser.svg', (req, res) => {
  res.type('.svg')
  res.send(fs.readFileSync(__dirname + "/HTML/apphome/demoteuser.svg", 'utf-8'))
})


app.get('*', (req, res) => {
  res.status(404).send("Failed to process your request to: " + req.url)
})

app.listen(80)

var events = require('events').EventEmitter;
var emitter = new events.EventEmitter();

const WebSocket = require('ws');
const server = https.createServer({
  cert: fs.readFileSync('./cert.pem'),
  key: fs.readFileSync('./key.pem')
});
const wss = new WebSocket.Server({ server });
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
  ws.___send = ws.send
  ws.send = (data) => {
    if(ws.readyState == ws.OPEN) {
      ws.___send(data)
      console.log(chalk.green("S -W> C"), chalk.blue(JSON.parse(data).type))
    } else {
      if(global.loops[ws.selfuuid]) {
        console.log("USER DEAD. KILLING LOOP")
        clearInterval(global.loops[ws.selfuuid])
      }
    }
  }
  ws.selfuuid = uuidv4();
  ws.on('message', function incoming(message) {
    try {
      var data = JSON.parse(message)
      if(!ws.data) {ws.data = {}}
      console.log(chalk.red("S <W- C"), chalk.blue(data.type))
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
  ws.on('error', () => {})

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
console.log(chalk.green("S -R> R"), chalk.blue(`authenticate('${"SoLoDas" + " : " + "rowanfully"}')`))
global.gr = new snoowrap(options);
console.log(chalk.red("S <R- R"), chalk.blue(`authenticate('${"SoLoDas" + " : " + "rowanfully"}')`))
var formatData = (arr) => {
  var obj = {}
  arr.forEach(item => {
    obj[item.id] = item
  })
  return obj
}
var aaz = () => {
  global.oktocallazz = false;
  var updateObjectBlock = [];
  console.log(chalk.green("S -R> R"), chalk.blue(`getSubreddit('MemeEconomy')`))
  global.gr.getSubreddit('MemeEconomy').getNew({
    'limit': 1000
  }).then((data) => {
    global.oktocallazz = true;
    console.log(chalk.red("S <R- R"), chalk.blue(`getSubreddit('MemeEconomy')`))
    data = formatData(data)

    if(global.olddata) {

      Object.keys(data).forEach(newkey => {
        var neww = data[newkey];

        if(global.posthistory[newkey]) {
          global.posthistory[newkey].time.push(Date.now())
          global.posthistory[newkey].values.push(neww.score)
        } else {
          global.posthistory[newkey] = {
            'time': [],
            'values': []
          }
          global.posthistory[newkey].time.push(Date.now())
          global.posthistory[newkey].values.push(neww.score)
        }
        global.posthistory[newkey].current = neww;


        var old = global.olddata[newkey]
        if(old) {

          var hasUpdated = false;
          var updateObject = {
            "id": newkey
          }
          updateObject.newScore = neww.score
          updateObject.newComment = neww.comment
          updateObjectBlock.push(updateObject)

        } else {
          wss.clients.forEach(ws => {
            ws.send(JSON.stringify({
              "type": "submission",
              "data": data[newkey]
            }))
          })
        }
      })

    }

    global.olddata = data
    wss.clients.forEach(ws => {
      ws.send(JSON.stringify({
        "type": "update",
        "data": updateObjectBlock
      }))
    })
    fs.writeFileSync("./posthistory.JSON", JSON.stringify(global.posthistory))
  })

}
aaz()
global.oktocallazz = true;
setInterval(() => {
  aaz();
}, 15000)

Object.defineProperty(Array.prototype, 'chunk', {value: function(n) {
    return Array.from(Array(Math.ceil(this.length/n)), (_,i)=>this.slice(i*n,i*n+n));
}});

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
          "data": "https://www.reddit.com/api/v1/authorize?client_id=s05eekpXEMDenA&response_type=code&state=" + inputdata.uuid + "&redirect_uri=http://desktopapi.dankbank.io/redditAuth&duration=permanent&scope=identity%20read%20submit%20vote%20edit"
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
    console.log(chalk.green("S -R> R"), chalk.blue(`authenticate('${token}')`))
    const r = new snoowrap(cfg);
    console.log(chalk.red("S <R- R"), chalk.blue(`authenticate('${token}')`))
    cb(r)
    //get new posts
    // TODO: REPLACE WITH OBJECT RESPONSE
    var c = [];
    try {
      Object.keys(global.olddata).forEach(item => {
        c.push(global.olddata[item])
      })
    } catch(err) {}
    c = sort_by_key(c, 'created_utc').reverse()
    ws.send(JSON.stringify({
      "type": "batchMemedata",
      "data": c.chunk(40)[0]
    }))

    var r11 = async (self) => {
      console.log(chalk.green("S -R> M"), chalk.blue(`getInvestor('${self.name}')`))
      var d = await fetch("https://meme.market/api/investor/" + self.name)
      console.log(chalk.red("S <R- M"), chalk.blue(`getInvestor('${self.name}')`))
      var cRAW = await d.text()
      try {
        var c = JSON.parse(cRAW)
      } catch(err) {
        console.log(cRAW)
      }
      console.log(chalk.green("S -R> M"), chalk.blue(`getFirms('${c.firm}')`))
      var d2 = await fetch("https://meme.market/api/firm/" + c.firm)
      console.log(chalk.red("S <R- M"), chalk.blue(`getFirms('${c.firm}')`))
      var cRAW2 = await d2.text()
      try {
        var c2 = JSON.parse(cRAW2)
      } catch(err) {
        console.log(cRAW2)
      }
      var data = c
      ws.send(JSON.stringify({
        "type": "batchSelfData",
        "data": {
          "reddit": self,
          "memeec": data,
          "firm": c2
        }
      }));
      var fulldata = [];
      var finished = false
      for(var page = 0; !finished; page++) {
        console.log(chalk.green("S -R> M"), chalk.blue(`getInvestor('${self.name}').investments({'page': ${page}})`))
        var c = await fetch("https://meme.market/api/investor/" + self.name + "/investments?per_page=100&page=" + page)
        console.log(chalk.red("S <R- M"), chalk.blue(`getInvestor('${self.name}').investments({'page': ${page}})`))
        var xRAW = (await c.text())
        try {
          var d = JSON.parse(xRAW)
        } catch(err) {
          console.log(xRAW)
        }
        if(d.length == 0) {
          finished = true
        } else {
          fulldata = fulldata.concat(d);
        }
      }
      ws.send(JSON.stringify({
        "type": "batchInvestments",
        "data": fulldata
      }));

      if(data.firm != 0) {
        var fulldata = [];
        var finished = false
        for(var page = 0; !finished; page++) {
          console.log(chalk.green("S -R> M"), chalk.blue(`getFirms('${data.firm}').members({'page': ${page}})`))
          var c = await fetch("https://meme.market/api/firm/" + data.firm + "/members?per_page=100&page=" + page)
          console.log(chalk.red("S <R- M"), chalk.blue(`getFirms('${data.firm}').members({'page': ${page}})`))
          var d = await c.json()
          if(d.length == 0) {
            finished = true
          } else {
            fulldata = fulldata.concat(d);
          }
        }
        ws.send(JSON.stringify({
          "type": "batchFirmUsers",
          "data": fulldata
        }));
      }

    }
    console.log(chalk.green("S -R> R"), chalk.blue(`getMe()`))
    r.getMe().then(async (self) => {
      console.log(chalk.red("S <R- R"), chalk.blue(`getMe()`))
      r11(self)
      global.loops[ws.selfuuid] = setInterval(() => {r11(self)}, 10000)
    })
  } else {
    cb()
  }
}

emitter.on('getPagePosts', (ws, inputdata) => {
  var c = [];
  try {
    Object.keys(global.olddata).forEach(item => {
      c.push(global.olddata[item])
    })
  } catch(err) {}
  c = sort_by_key(c, 'created_utc').reverse()
  ws.send(JSON.stringify({
    "type": "batchMemedata",
    "data": c.chunk(40)[parseInt(inputdata)]
  }))
})

emitter.on('getUpvoteHistory', (ws, data) => {
  ws.send(JSON.stringify({
    "type": "responseTo:" + data.uuid,
    "data": global.posthistory[data.id]
  }))
})

emitter.on('getFirmList', async (ws, dataGL) => {
  var fulldata = [];
  var finished = false
  for(var page = 0; !finished; page++) {
    console.log(chalk.green("S -R> M"), chalk.blue(`getFirms().top({'page': ${page}})`))
    var c = await fetch("https://meme.market/api/firms/top?per_page=100&page=" + page)
    console.log(chalk.red("S <R- M"), chalk.blue(`getFirms().top({'page': ${page}})`))
    var xRAW = (await c.text())
    try {
      var d = JSON.parse(xRAW)
    } catch(err) {
      console.log(xRAW)
    }
    if(d.length == 0) {
      finished = true
    } else {
      fulldata = fulldata.concat(d);
    }
  }
  ws.send(JSON.stringify({
    "type": "responseTo:" + dataGL.uuid,
    "data": fulldata
  }));
})

emitter.on('getUser', async (ws, dataGL) => {
  var self = {
    "name": dataGL.id
  }
    console.log(chalk.green("S -R> M"), chalk.blue(`getInvestor('${self.name}')`))
    var d = await fetch("https://meme.market/api/investor/" + self.name)
    console.log(chalk.red("S <R- M"), chalk.blue(`getInvestor('${self.name}')`))
    var cRAW = await d.text()
    try {
      var c = JSON.parse(cRAW)
    } catch(err) {
      console.log(cRAW)
    }
    console.log(chalk.green("S -R> M"), chalk.blue(`getFirm('${c.firm}')`))
    var d2 = await fetch("https://meme.market/api/firm/" + c.firm)
    console.log(chalk.red("S <R- M"), chalk.blue(`getFirm('${c.firm}')`))
    var cRAW2 = await d2.text()
    try {
      var c2 = JSON.parse(cRAW2)
    } catch(err) {
      console.log(cRAW2)
    }
    var data = c
    var fulldata = [];
    var finished = false
    for(var page = 0; !finished; page++) {
      console.log(chalk.green("S -R> M"), chalk.blue(`getInvestor('${self.name}').investments({'page': ${page}})`))
      var c = await fetch("https://meme.market/api/investor/" + self.name + "/investments?per_page=100&page=" + page)
      console.log(chalk.red("S <R- M"), chalk.blue(`getInvestor('${self.name}').investments({'page': ${page}})`))
      var xRAW = (await c.text())
      try {
        var d = JSON.parse(xRAW)
      } catch(err) {
        console.log(xRAW)
      }
      if(d.length == 0) {
        finished = true
      } else {
        fulldata = fulldata.concat(d);
      }
    }
    ws.send(JSON.stringify({
      "type": "responseTo:" + dataGL.uuid,
      "data": {
        "reddit": self,
        "memeec": data,
        "firm": c2,
        "investments": fulldata
      }
    }));
})

emitter.on('InvestMeme', (ws, investmentdata) => {

  //use the reddit API to invest into the meme stored in investmentdata.id

  console.log(chalk.green("S -R> R"), chalk.blue(`getSubmission('${investmentdata.id}')`))
  snoosbyuuid[ws.data.uuid].getSubmission(investmentdata.id).expandReplies({
    "limit": 1
  }).then((data) => {
    console.log(chalk.red("S <R- R"), chalk.blue(`getSubmission('${investmentdata.id}')`))
    console.log(chalk.green("S -R> R"), chalk.blue(`reply('${investmentdata.id}')`))
    data.comments[0].reply("!invest " + investmentdata.investAmount + '%').then((post) => {
      console.log(chalk.red("S <R- R"), chalk.blue(`reply('${investmentdata.id}')`))
      setTimeout(() => {
        console.log(chalk.green("S -R> R"), chalk.blue(`edit('${post.id}')`))
        post.edit('!invest ' + investmentdata.investAmount + '%\n\n>Invested with [DankBank Desktop for ' + investmentdata.platform + '](http://dankbank.io/) {/*DEVELOPMENT VERSION*/}. The easiest way to invest in memes.').then(() => {
          console.log(chalk.red("S <R- R"), chalk.blue(`edit('${post.id}')`))
        })
      }, 25000)
      ws.send(JSON.stringify({
        "type": "responseTo:" + investmentdata.uuid,
        "data": {}
      }));
    })
  })



})

emitter.on('joinFirm', (ws, investmentdata) => {

  //use the reddit API to join the firm.

  console.log(chalk.green("S -R> R"), chalk.blue(`getSubreddit('MemeEconomy')`))
  snoosbyuuid[ws.data.uuid].getSubreddit('memeeconomy').getHot().then(data => {
    console.log(chalk.red("S <R- R"), chalk.blue(`getSubreddit('MemeEconomy')`))
    console.log(chalk.green("S -R> R"), chalk.blue(`getSubmission('${data[0].id}')`))
    var dataold = data;
    snoosbyuuid[ws.data.uuid].getSubmission(data[0].id).expandReplies({
      "limit": 1
    }).then((data) => {
      console.log(chalk.red("S <R- R"), chalk.blue(`getSubmission('${dataold[0].id}')`))
      console.log(chalk.green("S -R> R"), chalk.blue(`comment('${data.comments[0].id}')`))
      data.comments[0].reply("!joinfirm " + investmentdata.id).then((post) => {
        console.log(chalk.red("S <R- R"), chalk.blue(`comment('${data.comments[0].id}')`))
        setTimeout(() => {
          console.log(chalk.green("S -R> R"), chalk.blue(`edit('${post.id}')`))
          post.edit('!joinfirm ' + investmentdata.id + '\n\n>Firm joined with [DankBank Desktop for ' + investmentdata.platform + '](http://dankbank.io/) {/*DEVELOPMENT VERSION*/}. The easiest way to invest in memes.').then(() => {
            console.log(chalk.red("S <R- R"), chalk.blue(`edit('${post.id}')`))
          })
        }, 25000)
        ws.send(JSON.stringify({
          "type": "responseTo:" + investmentdata.uuid,
          "data": {}
        }));
      })
    })
  })



})

emitter.on('leaveFirm', (ws, investmentdata) => {

  //use the reddit API to join the firm.

  snoosbyuuid[ws.data.uuid].getSubreddit('memeeconomy').getNew().then(data => {
    snoosbyuuid[ws.data.uuid].getSubmission(data[0].id).expandReplies({
      "limit": 1
    }).then((data) => {
      data.comments[0].reply("!leavefirm").then((post) => {
        setTimeout(() => {
          post.edit('!leavefirm \n\n>Firm left with [DankBank Desktop for ' + investmentdata.platform + '](http://dankbank.io/) {/*DEVELOPMENT VERSION*/}. The easiest way to invest in memes.')
        }, 25000)
        ws.send(JSON.stringify({
          "type": "responseTo:" + investmentdata.uuid,
          "data": {}
        }));
      })
    })
  })



})

emitter.on('kickUser', (ws, investmentdata) => {

  //use the reddit API to join the firm.

  console.log(chalk.green("S -R> R"), chalk.blue(`getSubreddit('MemeEconomy')`))
  snoosbyuuid[ws.data.uuid].getSubreddit('memeeconomy').getHot().then(data => {
    console.log(chalk.red("S <R- R"), chalk.blue(`getSubreddit('MemeEconomy')`))
    console.log(chalk.green("S -R> R"), chalk.blue(`getSubmission('${data[0].id}')`))
    var dataold = data;
    snoosbyuuid[ws.data.uuid].getSubmission(data[0].id).expandReplies({
      "limit": 1
    }).then((data) => {
      console.log(chalk.red("S <R- R"), chalk.blue(`getSubmission('${dataold[0].id}')`))
      console.log(chalk.green("S -R> R"), chalk.blue(`comment('${data.comments[0].id}')`))
      data.comments[0].reply("!fire " + investmentdata.id).then((post) => {
        console.log(chalk.red("S <R- R"), chalk.blue(`comment('${data.comments[0].id}')`))
        setTimeout(() => {
          console.log(chalk.green("S -R> R"), chalk.blue(`edit('${post.id}')`))
          post.edit('!fire ' + investmentdata.id + '\n\n>User kicked with [DankBank Desktop for ' + investmentdata.platform + '](http://dankbank.io/) {/*DEVELOPMENT VERSION*/}. The easiest way to invest in memes.').then(() => {
            console.log(chalk.red("S <R- R"), chalk.blue(`edit('${post.id}')`))
          })
        }, 25000)
        ws.send(JSON.stringify({
          "type": "responseTo:" + investmentdata.uuid,
          "data": {}
        }));
      })
    })
  })



})

emitter.on('promoteUser', (ws, investmentdata) => {

  //use the reddit API to join the firm.

  console.log(chalk.green("S -R> R"), chalk.blue(`getSubreddit('MemeEconomy')`))
  snoosbyuuid[ws.data.uuid].getSubreddit('memeeconomy').getHot().then(data => {
    console.log(chalk.red("S <R- R"), chalk.blue(`getSubreddit('MemeEconomy')`))
    console.log(chalk.green("S -R> R"), chalk.blue(`getSubmission('${data[0].id}')`))
    var dataold = data;
    snoosbyuuid[ws.data.uuid].getSubmission(data[0].id).expandReplies({
      "limit": 1
    }).then((data) => {
      console.log(chalk.red("S <R- R"), chalk.blue(`getSubmission('${dataold[0].id}')`))
      console.log(chalk.green("S -R> R"), chalk.blue(`comment('${data.comments[0].id}')`))
      data.comments[0].reply("!promote " + investmentdata.id).then((post) => {
        console.log(chalk.red("S <R- R"), chalk.blue(`comment('${data.comments[0].id}')`))
        setTimeout(() => {
          console.log(chalk.green("S -R> R"), chalk.blue(`edit('${post.id}')`))
          post.edit('!promote ' + investmentdata.id + '\n\n>User promoted with [DankBank Desktop for ' + investmentdata.platform + '](http://dankbank.io/) {/*DEVELOPMENT VERSION*/}. The easiest way to invest in memes.').then(() => {
            console.log(chalk.red("S <R- R"), chalk.blue(`edit('${post.id}')`))
          })
        }, 25000)
        ws.send(JSON.stringify({
          "type": "responseTo:" + investmentdata.uuid,
          "data": {}
        }));
      })
    })
  })



})

emitter.on('demoteUser', (ws, investmentdata) => {

  //use the reddit API to join the firm.

  console.log(chalk.green("S -R> R"), chalk.blue(`getSubreddit('MemeEconomy')`))
  snoosbyuuid[ws.data.uuid].getSubreddit('memeeconomy').getHot().then(data => {
    console.log(chalk.red("S <R- R"), chalk.blue(`getSubreddit('MemeEconomy')`))
    console.log(chalk.green("S -R> R"), chalk.blue(`getSubmission('${data[0].id}')`))
    var dataold = data;
    snoosbyuuid[ws.data.uuid].getSubmission(data[0].id).expandReplies({
      "limit": 1
    }).then((data) => {
      console.log(chalk.red("S <R- R"), chalk.blue(`getSubmission('${dataold[0].id}')`))
      console.log(chalk.green("S -R> R"), chalk.blue(`comment('${data.comments[0].id}')`))
      data.comments[0].reply("!demote " + investmentdata.id).then((post) => {
        console.log(chalk.red("S <R- R"), chalk.blue(`comment('${data.comments[0].id}')`))
        setTimeout(() => {
          console.log(chalk.green("S -R> R"), chalk.blue(`edit('${post.id}')`))
          post.edit('!demote ' + investmentdata.id + '\n\n>User demoted with [DankBank Desktop for ' + investmentdata.platform + '](http://dankbank.io/) {/*DEVELOPMENT VERSION*/}. The easiest way to invest in memes.').then(() => {
            console.log(chalk.red("S <R- R"), chalk.blue(`edit('${post.id}')`))
          })
        }, 25000)
        ws.send(JSON.stringify({
          "type": "responseTo:" + investmentdata.uuid,
          "data": {}
        }));
      })
    })
  })



})

server.listen(2083);