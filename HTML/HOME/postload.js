document.getElementById('accclick').addEventListener('click', () => {
  if(document.getElementsByClassName('paperAccountSettings')[0].style.opacity == "0") {
    document.getElementsByClassName('paperAccountSettings')[0].style.opacity = "1"
  } else {
    document.getElementsByClassName('paperAccountSettings')[0].style.opacity = "0"
  }
})

Array.from(document.getElementsByClassName('setting')).forEach(item => {
  item.addEventListener('click', () => {
    settingclicked(item.children[0].innerText)
  })
})

var settingclicked = (setting) => {
  switch (setting) {
    case 'Account Settings':
      document.location.pathname = "/settings"
      break;
    default:
      alert('I dunno how but you broke it')
  }
}