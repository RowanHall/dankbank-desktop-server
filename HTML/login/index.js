document.getElementById("login").addEventListener("click", async function (e) {
  document.getElementById('login').id = 'logindisabled'
  var accountDetails = {
    "username": document.getElementById('usr').value,
    "password": document.getElementById('pwd').value
  }
  var fetchObject = await fetch("http://webapi.dankbank.io:80/authenticate?username=" + accountDetails.username + "&password=" + accountDetails.password)
  var uuid = await fetchObject.text();
  if(uuid != "") {
    document.location.search = "uuid=" + uuid
  } else {
    document.getElementById("error").innerText = "Failed to login: Incorrect Credentials."
    document.getElementById('logindisabled').id = 'login'
  }
}); 