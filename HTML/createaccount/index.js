document.getElementById("login").addEventListener("click", async function (e) {
  document.getElementById('login').id = 'logindisabled'
  var accountDetails = {
    "email": document.getElementById('eml').value,
    "username": document.getElementById('usr').value,
    "password": document.getElementById('pwd').value
  }
  var fetchObject = await fetch("http://webapi.dankbank.io:80/makeAccount?username=" + accountDetails.username + "&password=" + accountDetails.password + "&email=" + accountDetails.email)
  var res = await fetchObject.json();
  if(res.ERROR == -1) {
    document.location.search = "uuid=" + res.uuid
  } else {
    document.getElementById("error").innerText = "Failed to create account: " + res.ERROR
    document.getElementById('logindisabled').id = 'login'
  }
});