/*document.getElementById('accclick').addEventListener('click', () => {
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
}*/

var appledevwarn = () => {
  Swal.fire({
    title: '<pre class="swaltitle">iOS / OSX releases</pre>',
    type: 'info',
    showCancelButton: true,
    html: `<pre class="swalbody">Due to the <a href="https://developer.apple.com/programs/">Apple Developer License</a>, we have to pay<br>99 USD /yr too release on the Mac app store and the<br>iOS app store.<br><br>Unfortunately we are students, and don't have the money<br>to cover these costs. If you would like to help out the<br>development of DankBank, work to an apple release,<br>and get some other sweet features, <br>please consider supporting us on Patreon!`,
    confirmButtonText: '<pre onclick="window.open(`https://www.patreon.com/dankbank`)">Sure!</pre>',
    cancelButtonText: 'No Thanks.'
  })
}

window.addEventListener("resize", () => {
  c();
});

var c = () => {
  Array.from(document.styleSheets, (ss) => {
    try {
    	(ss.rules[1].style.setProperty('--wid', Math.floor(window.innerWidth/394)*394 + "px"))
      (ss.rules[1].style.setProperty('--hei', Math.ceil(7/Math.floor(window.innerWidth/394))*124 + "px"))
    } catch(err) {

    }
  })
}

c();