const fs = require('fs');
var randomstring = require("randomstring");

var getAccount = (uuid) => {
  return JSON.parse(fs.readFileSync("./accounts.JSON", 'utf-8'))[uuid]
}

var redditAuth = (uuid, redditaccount) => {
  var acc = JSON.parse(fs.readFileSync("./accounts.JSON", 'utf-8'))
  acc[uuid].reddit = redditaccount;
  fs.writeFileSync("./accounts.JSON", JSON.stringify(acc, null, 4))
  return acc[uuid]
}

var makeAccount = (name, pass) => {
  var uuid = randomstring.generate({
    length: 63,
    charset: 'alphanumeric'
  });
  var acc = JSON.parse(fs.readFileSync("./accounts.JSON", 'utf-8'))
  acc[uuid] = {
    "name": name,
    "pass": pass
  }
  fs.writeFileSync("./accounts.JSON", JSON.stringify(acc, null, 4))
  return uuid
}

var authenticate = (name, pass) => {
  var acc = JSON.parse(fs.readFileSync("./accounts.JSON", 'utf-8'))
  var ret;
  Object.keys(acc).forEach(uuid => {
    if(acc[uuid] == name && acc[uuid] == pass) {
      ret = uuid;
    }
  })
  return ret;
}

var destroyAccount = (uuid) => {
  var acc = JSON.parse(fs.readFileSync("./accounts.JSON", 'utf-8'))
  delete acc[uuid];
  fs.writeFileSync("./accounts.JSON", JSON.stringify(acc, null, 4))
  return uuid
}

module.exports = {
  "getAccount":      getAccount     ,
  "redditAuth":      redditAuth     ,
  "makeAccount":     makeAccount    ,
  "authenticate":    authenticate   ,
  "destroyAccount":  destroyAccount
}