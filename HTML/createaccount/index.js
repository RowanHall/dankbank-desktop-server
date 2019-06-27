const remote = require('electron').remote;
const fs = require('fs');
document.getElementById("close").addEventListener("click", function (e) {
   remote.getCurrentWindow().close();
}); 
document.getElementById("back").addEventListener("click", function (e) {
  document.location.href += "/../../notauthed/index.html"
}); 

document.getElementById("login").addEventListener("click", async function (e) {
  document.getElementById('login').id = 'logindisabled'
  var accountDetails = {
    "email": document.getElementById('eml').value,
    "username": document.getElementById('usr').value,
    "password": document.getElementById('pwd').value
  }
  var fetchObject = await fetch("http://desktopapi.dankbank.io:80/makeAccount?username=" + accountDetails.username + "&password=" + accountDetails.password + "&email=" + accountDetails.email)
  var res = await fetchObject.json();
  if(res.ERROR == -1) {
    fs.writeFileSync(__dirname + "/../../../account.JSON", JSON.stringify({
      "uuid": res.uuid
    }))
    document.location.href += "/../../home/index.html"
  } else {
    document.getElementById("error").innerText = "Failed to create account: " + res.ERROR
    document.getElementById('logindisabled').id = 'login'
  }
}); 

/// DEBUG: REMOVE THIS. AUTO RELOADER!!

setInterval(() => {
  document.head.children[2].href = "./index.css"
}, 500);