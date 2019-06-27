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
    "username": document.getElementById('usr').value,
    "password": document.getElementById('pwd').value
  }
  var fetchObject = await fetch("http://desktopapi.dankbank.io:80/authenticate?username=" + accountDetails.username + "&password=" + accountDetails.password)
  var uuid = await fetchObject.text();
  if(uuid != "") {
    fs.writeFileSync(__dirname + "/../../../account.JSON", JSON.stringify({
      "uuid": uuid
    }))
    document.location.href += "/../../home/index.html"
  } else {
    document.getElementById("error").innerText = "Failed to login: Incorrect Credentials."
    document.getElementById('logindisabled').id = 'login'
  }
}); 