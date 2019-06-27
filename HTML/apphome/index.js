function abbreviate(number, maxPlaces, forcePlaces, forceLetter) {
  number = Number(number)
  forceLetter = forceLetter || false
  if(forceLetter !== false) {
    return annotate(number, maxPlaces, forcePlaces, forceLetter)
  }
  var abbr
  if(number >= 1e12) {
    abbr = 'T'
  }
  else if(number >= 1e9) {
    abbr = 'B'
  }
  else if(number >= 1e6) {
    abbr = 'M'
  }
  else if(number >= 1e3) {
    abbr = 'K'
  }
  else {
    abbr = ''
  }
  return annotate(number, maxPlaces, forcePlaces, abbr)
}

function annotate(number, maxPlaces, forcePlaces, abbr) {
  // set places to false to not round
  var rounded = 0
  switch(abbr) {
    case 'T':
      rounded = number / 1e12
      break
    case 'B':
      rounded = number / 1e9
      break
    case 'M':
      rounded = number / 1e6
      break
    case 'K':
      rounded = number / 1e3
      break
    case '':
      rounded = number
      break
  }
  if(maxPlaces !== false) {
    var test = new RegExp('\\.\\d{' + (maxPlaces + 1) + ',}$')
    if(test.test(('' + rounded))) {
      rounded = rounded.toFixed(maxPlaces)
    }
  }
  if(forcePlaces !== false) {
    rounded = Number(rounded).toFixed(forcePlaces)
  }
  return rounded + abbr
}

function linear_interpolate(x, x_0, x_1, y_0, y_1){
 let m = (y_1 - y_0) / x_1 - x_0;
 let c = y_0;
 let y = (m * x) + c;
 return y;
}
function S(x, max, mid, stp){
  let arg = -(stp * (x - mid));
  let y = max / (1 + Math.exp(arg));
  return y;
}
function gain(start, end) {
  if(end < start) {
    // treat negative gain as no gain
    return 0;
  }
  else {
    return end - start;
  }
}
function max(start) {
  return 1.2 + 0.6 / ((start / 10) + 1);
}
function mid(start) {
  let sig_mp_0 = 50;
  let sig_mp_1 = 500;
  return linear_interpolate(start, 0, 25000, sig_mp_0, sig_mp_1);
}
function stp(start){
  return 0.06 / ((start / 100) + 1);
}
function C(start, end) {
 return S(gain(start, end), max(start), mid(start), stp(start));
}
window.formatAMPM = (date) => {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}
var ctx = document.getElementById("mainchart").getContext("2d"); 
const fs = require('fs');
const EventEmitter = require('events');
function sort_by_key(array, key)
{
 return array.sort(function(a, b)
 {
  var x = a[key]; var y = b[key];
  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
 });
}
function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}
window.investIn = [];
window.myEmitter = new EventEmitter();
window.monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
var sendHTTPRequest = function(url, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            callback(request.responseText); // Another callback here
        }
    }; 
    request.open('GET', url);
    request.send();
}

const en = require('javascript-time-ago/locale/en')
const TimeAgo = require('javascript-time-ago')
TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')

/*** Gradient ***/
var gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');   
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
/***************/

var data = {
  labels : [],
  datasets: [
    {
      fillColor : gradient, // Put the gradient here as a fill color
      pointRadius: 10,
      bezierCurve: false,
      data : []
    }
  ]
};

var options = {
  responsive: true,
  datasetStrokeWidth : 2,
  pointDotStrokeWidth : 4,
  tooltipFillColor: "rgba(0,0,0,0.8)",
  tooltipFontStyle: "bold",
  tooltipTemplate: "<%if (label){%><%=label + ' hod' %>: <%}%><%= value + '°C' %>",
  scaleLabel : "<%= Number(value).toFixed(0).replace('.', ',') + '°C'%>"
};




var chart = new Chart(ctx)
var myLineChart = chart.Line(data, options);


// ---

const remote = require('electron').remote;
document.getElementById("close").addEventListener("click", function (e) {
  remote.getCurrentWindow().close();
}); 

// calc(decimal-floor(calc(calc(100vw - 350px) / 500px)) * 500px)

var executesetSize = () => {
  try {
    document.styleSheets[1].rules[29].styleMap.set('width', (Math.floor((document.body.parentElement.offsetWidth - 350)/600)*600)+'px')
  } catch(err) {
    document.styleSheets[0].rules[29].styleMap.set('width', (Math.floor((document.body.parentElement.offsetWidth - 350)/600)*600)+'px')
  }
}

window.onresize = function(event) {
  executesetSize();
};
executesetSize();

screenids = [
  '350px',
  '100vw',
  'calc(200vw - 350px)',
  'calc(300vw - 700px)',
  'calc(400vw - 1050px)'
]


var switchtotab = (tabnum) => {
  Array.from(document.getElementById('bottomslab').children).forEach(child => {
    child.children[0].id = "notactivesvg"
  })
  document.getElementById('bottomslab').children[tabnum].children[0].id = "activesvg"
  document.getElementById('mainwrap').style.setProperty('--screen', screenids[tabnum])
}
document.getElementById('mainwrap').style.setProperty('--screen', '350px')

document.getElementById('investmodal').children[0].children[1].children[2].children[1].addEventListener('input', function () {
  global.investButton = {};
  window.modal.children[0].children[1].children[2].children[0].innerText = "Invest amount: " + document.getElementById('investmodal').children[0].children[1].children[2].children[1].value + "%"
  global.investButton.precent = (document.getElementById('investmodal').children[0].children[1].children[2].children[1].value/100)
  window.modal.children[0].children[1].children[3].innerText = `Invest ${(window.batchSelfData.memeec.balance * (parseInt(document.getElementById('investmodal').children[0].children[1].children[2].children[1].value)/100)).toFixed(2).toLocaleString()} M¢`
  global.investButton.amount = (window.batchSelfData.memeec.balance * (parseInt(document.getElementById('investmodal').children[0].children[1].children[2].children[1].value)/100)).toFixed(2).toLocaleString()
  if((window.batchSelfData.memeec.balance * (parseInt(document.getElementById('investmodal').children[0].children[1].children[2].children[1].value)/100)) < 100) {
    window.modal.children[0].children[1].children[3].style.opacity = "0.3"
    global.investButton.canInvest = false
  } else {
    window.modal.children[0].children[1].children[3].style.opacity = "1"
    global.investButton.canInvest = true
  }
}, false);

var invest = (e) => {
  var item = null;
  window.investIn.forEach(possibleInvestment => {
    if(possibleInvestment.id == e) {
      item = possibleInvestment
    }
  })
  window.selectedInvestment = item
  if(item == null) {
    throw new Error("Investment Not Found. Not Displaying Modal")
  } else {
    window.modal = document.getElementById('investmodal')
    window.modal.children[0].children[1].children[0].children[2].innerText = window.batchSelfData.memeec.balance.toLocaleString() + ".00 M¢"
    formatChart(window.modal.children[0].children[1].children[1], item.id)
    window.modal.children[0].children[2].children[0].src = item.preview.images[0].source.url
    window.modal.children[0].children[2].children[1].children[1].children[1].innerText = item.score
    window.modal.children[0].children[2].children[2].children[1].children[1].innerText = item.breakEven
    window.modal.children[0].children[2].children[3].children[1].children[1].innerText = item.maxProfit
    toggleinvestmodal();
  }
}

var showInvestModal = () => {
  document.getElementById('investmodal').style.opacity = "1"
  document.getElementById('investmodal').style.zIndex = "1000000"
}
var hideInvestModal = () => {
  document.getElementById('investmodal').style.opacity = "0"
  setTimeout(() => {
    document.getElementById('investmodal').style.zIndex = "-100"
  }, 100)
}

var investModalShowing = () => {
  return (document.getElementById('investmodal').style.opacity == 1)
}

var toggleinvestmodal = () => {
  if(investModalShowing()) {
    hideInvestModal()
  } else {
    showInvestModal();
  }
}

document.getElementById('usersearchbar').addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    showUser(document.getElementById('usersearchbar').value)
  }
});

var showUser = (e) => {
  clearChartUser(document.getElementsByClassName('modalleft')[1].children[2])
  document.getElementsByClassName('balmodal')[1].innerText = "..."
  document.getElementsByClassName('balmodal')[2].innerText = "..."
  if(document.getElementsByClassName('balmodal')[2].innerText == "") {
    document.getElementsByClassName('balmodal')[2].innerText = "N/A"
  }
  document.getElementsByClassName('modalrightval')[3].innerText = "..."
  if(document.getElementsByClassName('modalrightval')[3].innerText == "") {
    document.getElementsByClassName('modalrightval')[3].innerText = "..."
  }
  if(document.getElementsByClassName('modalrightval')[2].innerText == "...") {
    document.getElementsByClassName('modalrightval')[3].innerText = "..."
  }
  document.getElementsByClassName('modalrightval')[4].innerText = "..."
  document.getElementsByClassName('modalrightval')[5].innerText = "..."
  document.getElementsByClassName('modalrightval')[6].innerText = "..."
  document.getElementsByClassName("modalrealtitle")[1].innerText = "u/" + e
  toggleusermodal();
  var uuid = uuidv4()
  var x = ("responseTo:" + uuid)
  window.socket.send(JSON.stringify({
    type: "getUser",
    data: {
      "uuid": uuid,
      "id": e
    }
  }))
  window.myEmitter.on(x, (data, ws) => {
    //do something with data
    var parsedinvestments = {
      "data":[],
      "labels":[]
    }
    data.investments.reverse().forEach(investment => {
      if(investment.profit != 0) {
        parsedinvestments.data.push(investment.profit)
        parsedinvestments.labels.push("")
      }
    })
    formatChartUser(document.getElementsByClassName('modalleft')[1].children[2], parsedinvestments, data.reddit.name)
    document.getElementsByClassName('balmodal')[1].innerText = data.memeec.balance.toLocaleString() + ".00 M¢"
    document.getElementsByClassName('balmodal')[2].innerText = data.firm.name
    var isInFirm = true
    if(document.getElementsByClassName('balmodal')[2].innerText == "") {
      document.getElementsByClassName('balmodal')[2].innerText = "N/A"
      isInFirm = false
    }
    document.getElementsByClassName('modalrightval')[3].innerText = data.memeec.firm_role
    if(document.getElementsByClassName('modalrightval')[3].innerText == "") {
      document.getElementsByClassName('modalrightval')[3].innerText = "Floor Trader"
    }
    if(!isInFirm) {
      document.getElementsByClassName('modalrightval')[3].innerText = "N/A"
    }
    document.getElementsByClassName('modalrightval')[4].innerText = data.memeec.rank.toLocaleString();
    document.getElementsByClassName('modalrightval')[5].innerText = data.memeec.broke.toLocaleString();
    document.getElementsByClassName('modalrightval')[6].innerText = data.memeec.completed.toLocaleString();
    document.getElementsByClassName("modalrealtitle")[1].innerText = "u/" + data.reddit.name
  })
}

var showUserModal = () => {
  document.getElementById('usermodal').style.opacity = "1"
  document.getElementById('usermodal').style.zIndex = "1000000"
}
var hideUserModal = () => {
  document.getElementById('usermodal').style.opacity = "0"
  setTimeout(() => {
    document.getElementById('usermodal').style.zIndex = "-100"
  }, 100)
}

var userModalShowing = () => {
  return (document.getElementById('usermodal').style.opacity == 1)
}

var toggleusermodal = () => {
  if(userModalShowing()) {
    hideUserModal()
  } else {
    showUserModal();
  }
}


//websocket

window.socket = new WebSocket('ws://dankbank.io:81');
global.page = 0;
global.isoktocall = false;
// Connection opened
socket.addEventListener('open', function (event) {
  socket.send(JSON.stringify({
    "type": "authenticate", 
    "data": JSON.parse(fs.readFileSync("./account.JSON", 'utf-8'))
  }));
});

// Listen for messages
socket.addEventListener('message', function (event) {
  var message = JSON.parse(event.data)
  console.log(message.type, message.data)
  myEmitter.emit(message.type, message.data, socket);
});

myEmitter.on('openURL', (url, ws) => {
  require('open')(url)
});

myEmitter.on('batchSelfData', (data, ws) => {
  var firm_role = data.memeec.firm_role
  if(firm_role == "" && data.firm.name != "") {
    firm_role = "Floor Trader"
  }
  if(data.firm.name == "") {
    document.getElementById('firm').innerText = "N/A"
    document.getElementById('firmrank').innerText = "N/A"
    document.getElementById('firmplacement').innerText = "N/A"
  } else {
    document.getElementById('firm').innerText = data.firm.name
    document.getElementById('firmrank').innerText = firm_role
  }
  window.batchSelfData = data
  document.getElementById('welcomeName').innerText = data.reddit.name
  document.getElementById('memecoins').innerText = data.memeec.balance.toLocaleString() + ".00"
  document.getElementById('memecoinsinvested').innerText = (data.memeec.networth - data.memeec.balance).toLocaleString() + ".00"
  document.getElementById('rank').innerText = data.memeec.rank.toLocaleString()
  document.getElementById('broke').innerText = data.memeec.broke.toLocaleString()
  document.getElementById('compInvestments').innerText = data.memeec.completed.toLocaleString()
  
  
  //firm stuff :sigh:
  
  if(data.firm.id == 0) {
    // warn user to join a firm
    // frimmain
    document.getElementsByClassName('paper-firminfo-firmname')[0].innerText = "Join A Firm!"
    document.getElementsByClassName('paper-firminfo-firmcoin')[0].innerText = ``
    var uuid = uuidv4()
    var x = ("responseTo:" + uuid)
    window.socket.send(JSON.stringify({
      type: "getFirmList",
      data: {
        "uuid": uuid
      }
    }))
    window.myEmitter.on(x, (data, ws) => {
      if(!window.lastfirm) {
        window.lastfirm = [];
      }
      if(data.length != window.lastfirm.length) {
        document.getElementsByClassName('frimmain')[0].children[0].innerHTML = `<div class="paper-investment"><div class="paper-firm-piechart-title"><pre class="paper-frim-piechart-title-text">Join A Firm</pre><pre class="paper-frim-piechart-title-range">Firm list:</pre> </div><div class="memberwrapper"></div> </div>`
        console.log("FIRMS", data)
        
        var firmmembers = ''
        data.forEach((data) => {
          firmmembers = firmmembers + `<div class="member" style="opacity:${data.private ? "0.5" : "1"};">
            <div class="memberinfowrapper">
              <pre class="memberinforank">${data.size} Members</pre>
              <pre class="memberinfoname">${data.name}</pre>
              <pre class="memberinfobal">M¢ ${data.balance.toLocaleString()}.00</pre>
            </div>
            <div class="memberactionswrapper">
              <img class="memberactionicon" src="./promoteuser.svg" onclick="joinfirm(this.parentElement.parentElement.children[0].children[1].innerText)">
            </div>
          </div>`
        })
        document.getElementsByClassName('memberwrapper')[0].innerHTML =  firmmembers
      }
      window.lastfirm = data
    })
  } else {
    window.lastfirm =[]
    if(document.getElementsByClassName('firmsettingval').length != 6) {
      document.getElementsByClassName('frimmain')[0].children[0].innerHTML = `<div class="paper-investment"><div class="paper-firm-piechart-title"><pre class="paper-frim-piechart-title-text">Members</pre><pre class="paper-frim-piechart-title-range">Sorted by balance</pre> </div><div class="memberwrapper"></div> </div><div class="paper-investment"><div class="paper-firm-piechart-title"><pre class="paper-frim-piechart-title-text">Firm Settings</pre></div><div class="firmsetting"><div class="firmsettingiconwrap"><img class="firmsettingicon" src="./nextpayout.svg"></div><div class="firmsettingtextwrap"><pre class="firmsettingtext">Next payout</pre><pre class="firmsettingval">M¢ ...</pre></div></div><div class="firmsetting"><div class="firmsettingiconwrap"><img class="firmsettingicon" src="./members.svg"></div><div class="firmsettingtextwrap"><pre class="firmsettingtext">Members</pre><pre class="firmsettingval">... members</pre></div></div><div class="firmsetting"><div class="firmsettingiconwrap"><img class="firmsettingicon" src="./tax.svg"></div><div class="firmsettingtextwrap"><pre class="firmsettingtext">Tax</pre><pre class="firmsettingval">...%</pre></div></div><div class="firmsetting"><div class="firmsettingiconwrap"><img class="firmsettingicon" src="./visibility.svg"></div><div class="firmsettingtextwrap"><pre class="firmsettingtext">Visibility</pre><pre class="firmsettingval">...</pre></div></div><div class="firmsetting"><div class="firmsettingiconwrap"><img class="firmsettingicon" src="./level.svg"></div><div class="firmsettingtextwrap"><pre class="firmsettingtext">Level</pre><pre class="firmsettingval">...</pre></div></div><div class="firmsetting" id="leavefirm" onclick="leavefirm()"><div class="firmsettingiconwrap"><img class="firmsettingicon" src="./leave0.svg"></div><div class="firmsettingtextwrap"><pre class="firmsettingtext leavefirmtext">Leave</pre><pre class="firmsettingval leavefirmtext">Leave Firm</pre></div></div></div>`
    } else {}
    document.getElementsByClassName('paper-firminfo-firmname')[0].innerText = data.firm.name
    document.getElementsByClassName('paper-firminfo-firmcoin')[0].innerText = `F¢ ${data.firm.balance.toLocaleString()}.00`
    document.getElementsByClassName('firmsettingval')[0].innerText = "M¢ " + abbreviate(data.firm.balance, 2, false, false)
    document.getElementsByClassName('firmsettingval')[1].innerText = batchSelfData.firm.size + " members"
    document.getElementsByClassName('firmsettingval')[2].innerText = batchSelfData.firm.tax + "%"
    document.getElementsByClassName('firmsettingval')[3].innerText = batchSelfData.firm.private ? "Private" : "Public"
    document.getElementsByClassName('firmsettingval')[4].innerText = (batchSelfData.firm.rank + 1)
  }
});

myEmitter.on('batchFirmUsers', (data, ws) => {
  document.getElementsByClassName('memberwrapper')[0].innerHTML = ``;
  var firmplacement = "Error!"
  var x = sort_by_key(data, 'balance')
  x.reverse()
  x.forEach((usr, index) => {
    if(usr.name == window.batchSelfData.reddit.name) {
      var position = index+1
      firmplacement = ordinal_suffix_of(position)
    }
    
    //
    
    var firm_role = usr.firm_role
    if(firm_role == "") {
      firm_role = "Floor Trader"
    }
    
    var member = `<div class="member">
      <div class="memberinfowrapper">
        <pre class="memberinforank">${firm_role}</pre>
        <pre class="memberinfoname">${usr.name}</pre>
        <pre class="memberinfobal">M¢ ${usr.balance.toLocaleString()}.00</pre>
      </div>
      <div class="memberactionswrapper">
        <img class="memberactionicon" src="./kickuser.svg" onclick="kickuser(this.parentElement.parentElement.children[0].children[1].innerText)"> 
        <img class="memberactionicon" src="./demoteuser.svg" onclick="demoteuser(this.parentElement.parentElement.children[0].children[1].innerText)">
        <img class="memberactionicon" src="./promoteuser.svg" onclick="promoteuser(this.parentElement.parentElement.children[0].children[1].innerText)">
      </div>
    </div>`
    
    document.getElementsByClassName('memberwrapper')[0].innerHTML = document.getElementsByClassName('memberwrapper')[0].innerHTML + member
    
  })
  document.getElementById('firmplacement').innerText = firmplacement
  
  
  
  var rankmap
});

myEmitter.on('batchInvestments', (data, ws) => {
  document.getElementsByClassName('mainchild')[0].innerHTML = "";
  var lowestValue = 0;
  var highestValue = 0;
  data.reverse()
  data.forEach((investment,index) => {
    if((Date.now() - (investment.time*1000)) > 14400000) {
      if(investment.profit < lowestValue) {
        lowestValue = investment.profit
      }
      if(investment.profit > highestValue) {
        highestValue = investment.profit
      }
      if(myLineChart.datasets[0].points[index]) {
        myLineChart.datasets[0].points[index].value = investment.profit;
      } else {
        myLineChart.addData([investment.profit], "N/A");
      }
    }
  })
  myLineChart.update()
  var investData = [];
  data.forEach(datablock => {
    var investdataindex = investData.push(datablock) - 1
    if(window.investmentData) {
      window.investmentData.forEach((item) => {
        if(item.id == datablock.id) {
          investData[investdataindex].reddit = item.reddit
        }
      })
    }
  })
  window.investmentData = investData
  renderInvested();
  
})

var leavefirm = () => {
  showLoadModal();
  var uuid = uuidv4()
  var x = ("responseTo:" + uuid)
  window.socket.send(JSON.stringify({
    type: "leaveFirm",
    data: {
      "uuid": uuid
    }
  }))
  window.myEmitter.on(x, (data, ws) => {
    hideLoadModal();
  })
}

var joinfirm = (firmName) => {
  showLoadModal();
  var uuid = uuidv4()
  var x = ("responseTo:" + uuid)
  window.socket.send(JSON.stringify({
    type: "joinFirm",
    data: {
      "uuid": uuid,
      "id": firmName
    }
  }))
  window.myEmitter.on(x, (data, ws) => {
    hideLoadModal();
  })
}

var kickuser = (firmName) => {
  showLoadModal();
  var uuid = uuidv4()
  var x = ("responseTo:" + uuid)
  window.socket.send(JSON.stringify({
    type: "kickUser",
    data: {
      "uuid": uuid,
      "id": firmName
    }
  }))
  window.myEmitter.on(x, (data, ws) => {
    hideLoadModal();
  })
}

var promoteuser = (firmName) => {
  showLoadModal();
  var uuid = uuidv4()
  var x = ("responseTo:" + uuid)
  window.socket.send(JSON.stringify({
    type: "promoteUser",
    data: {
      "uuid": uuid,
      "id": firmName
    }
  }))
  window.myEmitter.on(x, (data, ws) => {
    hideLoadModal();
  })
}

var demoteuser = (firmName) => {
  showLoadModal();
  var uuid = uuidv4()
  var x = ("responseTo:" + uuid)
  window.socket.send(JSON.stringify({
    type: "demoteUser",
    data: {
      "uuid": uuid,
      "id": firmName
    }
  }))
  window.myEmitter.on(x, (data, ws) => {
    hideLoadModal();
  })
}

myEmitter.on('batchMemedata', (data, ws) => {
  window.investIn = window.investIn.concat(data)
  window.investIn = sort_by_key(window.investIn, 'created_utc').reverse()
  renderInvestIn();
})
myEmitter.on('submission', (data, ws) => {
  window.investIn.push(data)
  window.investIn = sort_by_key(window.investIn, 'created_utc').reverse()
  renderInvestIn();
})

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

var showTextModal = (v) => {
  document.getElementById('textmodaltext').innerText = v
  document.getElementById('textmodal').style.opacity = "1"
  document.getElementById('textmodal').style.zIndex = "1000000"
}
var hideTextModal = () => {
  document.getElementById('textmodal').style.opacity = "0"
  setTimeout(() => {
    document.getElementById('textmodal').style.zIndex = "-100"
  }, 100)
}

var showLoadModal = () => {
  showTextModal("Loading")
}
var hideLoadModal = () => {
  showTextModal("Completed Action. Please allow a few seconds to a minute\nfor the data to update visually.")
  setTimeout(hideTextModal, 4000)
}
document.getElementsByClassName("modalinvestbutton")[0].addEventListener('click', () => {
  
  if(global.investButton.canInvest) {
    
    showLoadModal();
    
    var uuid = uuidv4()
    var x = ("responseTo:" + uuid)
    window.socket.send(JSON.stringify({
      type: "InvestMeme",
      data: {
        "uuid": uuid,
        "id": window.selectedInvestment.id,
        "investAmount": String(window.investButton.precent * 100)
      }
    }))
    window.myEmitter.on(x, (data, ws) => {
      hideLoadModal();
      hideInvestModal();
    })
    
  }
  
})

window.toUpdate = []
window.rendering = false

setInterval(() => {
  if(window.rendering) {return}
  window.rendering = true;
  Array.from(document.getElementsByClassName('mainchild')[1].children).forEach(item => {
    updateObject = window.toUpdate.shift()
    if(updateObject) {
      if(window.selectedInvestment && updateObject.id == window.selectedInvestment.id) {
        if(updateObject.newComment) {
          window.selectedInvestment.num_comments = updateObject.newComment
        }
        if(updateObject.newScore) {
          window.selectedInvestment.num_comments = updateObject.newScore
          
          var maxProfit = C(updateObject.newScore, 100000000000000000000).toFixed(2)
          var breakEven = "Error!"
          var found = false;
          for(var i = 0; !found; i++) {
            if(i > 500000) {
              found = true;
            }
            if(C(updateObject.newScore, i).toFixed(1) == 1) {
              found = true;
              breakEven = i;
            }
          }
          
          document.getElementsByClassName("modalrightval")[0].innerText = updateObject.newScore
          document.getElementsByClassName("modalrightval")[1].innerText = breakEven
          document.getElementsByClassName("modalrightval")[2].innerText = maxProfit
        }
      }
      
      
      if(item.attributes[1].nodeValue == updateObject.id) {
        var index = -1
        window.investIn.forEach((iiitem,iii) => {
          if (iiitem.id == updateObject.id) {
            index = iii
          }
        })
        if(index != -1) {
          if(updateObject.newComment) {
            window.investIn[index].num_comments = updateObject.newComment
          } 
          if(updateObject.newScore) {
            window.investIn[index].score = updateObject.newScore
            window.investIn[index].maxProfit = C(window.investIn[index].score, 100000000000000000000).toFixed(2)
            var found = false;
            for(var i = 0; !found; i++) {
              if(C(window.investIn[index].score, i).toFixed(1) == 1) {
                found = true;
                window.investIn[index].breakEven = i;
              }
            }
          } 
          item.children[2].children[0].children[0].innerText = `${window.investIn[index].breakEven} Upvotes to break even, ${window.investIn[index].maxProfit}x Max profit.`
          item.children[2].children[0].children[1].innerText = `${window.investIn[index].score} Upvotes. ${window.investIn[index].num_comments} Comments.`
          if(global.charts[updateObject.id]) {
            var now = new Date()
            global.charts[updateObject.id].forEach(charttoupdate => {
              addData(charttoupdate, formatAMPM(now) + " " + monthNames[now.getMonth()] + " " + now.getDate(), window.investIn[index].score)
            })
            
          }
        }
      }
    }
  })
  window.rendering = false;
}, 50)

myEmitter.on('update', (data) => {
  window.toUpdate = data
  global.isoktocall = true;
})


renderInvestIn = () => {
  document.getElementsByClassName('mainchild')[1].innerHTML = "";
  var htmlBuilder =  (title, imageURL, upvotes, postID, comments, upvotesToBreakEven, maxProfit) => {return `<div class="paper-investment" postID="${postID}">
  <h1>${title}</h1>
  <a href="${imageURL}" class="lightbox">
    <img src='${imageURL}'></img>
  </a>
  <div class="info">
    <div class="investmentinfo">
      <pre class="inventmentinfo1">${upvotesToBreakEven} Upvotes to break even, ${maxProfit}x Max profit.</pre> 
      <pre class="inventmentinfo2">${upvotes} Upvotes. ${comments} Comments.</pre>
    </div>
    <div class="investmentbuttonwrap">
      <button class="investmentbutton" onclick="invest('${postID}')">Invest</button>
    </div>
    <canvas class="upvotechart" width="520px" height="180px"></canvas>
  </div>
</div>`}
var batchAdd = ""
  window.investIn.forEach((item, index) => {
    try {
      item.maxProfit = C(item.score, 100000000000000000000).toFixed(2)
      var found = false;
      for(var i = 0; !found; i++) {
        if(C(item.score, i).toFixed(1) == 1) {
          found = true;
          item.breakEven = i;
        }
      }
    } catch(err) {}
    try {
      
      window.investIn[index] = item
      batchAdd = batchAdd + htmlBuilder(item.title, item.preview.images[0].source.url, item.score, item.id, item.num_comments, item.breakEven, item.maxProfit)
    } catch(err) {}
  })
  document.getElementsByClassName('mainchild')[1].innerHTML = batchAdd
  Array.from(document.getElementsByClassName('mainchild')[1].children, (a) => {
    formatChart(a.children[2].children[2], a.attributes[1].nodeValue)
  })
  Array.from(document.getElementsByClassName("lightbox")).forEach(lightbox => {
    var l = new Luminous(lightbox);
  })
}

renderInvested = async () => {
  var batchHTML = ""
  window.investmentData.reverse()
  window.investmentData.forEach((investment,investmentindex) => {
    investment.completed = ((Date.now() - (investment.time*1000)) > 14400000);
    if(investment.completed) {
      var investmentHTML = `<div class="paper-investment investment-finished" id="${investment.id}"  rid="${investment.post}">
        <h1>${(() => {
          if(investment.reddit) {
            return investment.reddit.title
          } else {
            return "..."
          }
        })()}</h1>
        <img src='${(() => {
          if(investment.reddit) {
            try {
              return investment.reddit.preview.images[0].source.url
            } catch(err) {
              return null
            }
          } else {
            return ""
          }
        })()}'></img>
        <div class="info">
          <div class="investmentinfo">
            <pre class="inventmentinfo2">Ended with ${investment.final_upvotes} (${(() => {
              var c = ""
              var num = investment.final_upvotes - investment.upvotes
              if(num > -1) {
                c = "+"
              }
              return c + num
            })()}) upvotes.</pre>
            <pre class="inventmentinfo1">${timeAgo.format(new Date(investment.time * 1000))}</pre>
          </div>
          <div class="investmentfinishedvaluewrap">
            <pre class="investmentfinishedvalue ${(() => {
              if(investment.profit < 0) {
                return "investmentfinishedfailed"
              }
            })()}">${(() => {
              var c = ""
              var num = investment.profit
              if(num > -1) {
                c = "+"
              }
              return c + num
            })()}.0 M¢</pre>
          </div>
        </div>
      </div>`
    } else {
      var investmentHTML = `<div class="paper-investment" id="${investment.id}"  rid="${investment.post}">
        <h1>${(() => {
          if(investment.reddit) {
            return investment.reddit.title
          } else {
            return "..."
          }
        })()}</h1>
        <img src='${(() => {
          if(investment.reddit) {
            return investment.reddit.preview.images[0].source.url
          } else {
            return ""
          }
        })()}'></img>
        <div class="info">
          <div class="investmentinfo">
            <pre class="inventmentinfo1">Invested ${investment.amount} M¢ at ${investment.upvotes} upvotes</pre>
            <pre class="inventmentinfo2">$ ${(() => {
              if(investment.reddit) {
                return (() => {
                  //get % relative
                  var c = ""
                  var num = (C(investment.upvotes,investment.reddit.score)*100)-100
                  if(num > -1) {
                    c = "+"
                  }
                  return c + (num).toFixed(2)
                })()
              } else {
                return "..."
              }
            })()}% (${(() => {
              if(investment.reddit) {
                return (() => {
                  //get bal relative
                  var c = ""
                  var num = (C(investment.upvotes,investment.reddit.score)*investment.amount) - investment.amount
                  if(num > -1) {
                    c = "+"
                  }
                  return c + Math.round(num)
                  
                })()
              } else {
                return "..."
              }
            })()} M¢)</pre>
          </div>
          <div class="investmentinfotime">
            <pre class="investmenttime">${(() => {
              var timeDifference = new Date((14400000 - (Date.now() - (investment.time * 1000))))
              return String(timeDifference.getHours() - 1).padStart(2, "0")+":"+String(timeDifference.getMinutes()).padStart(2, "0")
            })()}<img style="width: 20px;height: 20px;position: relative;top: 9px;margin: 5px;" src="./clock.svg"></img></pre>
          </div>
          <canvas class="upvotechart" width="520px" height="180px"></canvas>
        </div>
      </div>`
    }
    
    batchHTML = batchHTML + investmentHTML
    if(investment.reddit && investment.completed) {} else {
      sendHTTPRequest("http://reddit.com/" + investment.post + ".json", (data) => {
      var res = JSON.parse(data)[0].data.children[0].data
      window.investmentData[investmentindex].reddit = res
      Array.from(document.getElementsByClassName('mainchild')[0].children).forEach(child => {
        if(child.attributes[1].nodeValue == investment.id) {
          if(investment.completed) {
            var investmentHTML = `<div class="paper-investment investment-finished" id="${investment.id}" rid="${investment.post}">
              <h1>${res.title}</h1>
              <img src='${res.preview.images[0].source.url}'></img>
              <div class="info">
                <div class="investmentinfo">
                  <pre class="inventmentinfo2">Ended with ${investment.final_upvotes} (${(() => {
                    var c = ""
                    var num = investment.final_upvotes - investment.upvotes
                    if(num > -1) {
                      c = "+"
                    }
                    return c + num
                  })()}) upvotes.</pre>
                  <pre class="inventmentinfo1">${timeAgo.format(new Date(investment.time * 1000))}</pre>
                </div>
                <div class="investmentfinishedvaluewrap">
                  <pre class="investmentfinishedvalue ${(() => {
                    if(investment.profit < 0) {
                      return "investmentfinishedfailed"
                    }
                  })()}">${(() => {
                    var c = ""
                    var num = investment.profit
                    if(num > -1) {
                      c = "+"
                    }
                    return c + num
                  })()}.0 M¢</pre>
                </div>
              </div>
            </div>`
          } else {
            var investmentHTML = `<div class="paper-investment" id="${investment.id}" rid="${investment.post}">
              <h1>${res.title}</h1>
              <img src='${res.preview.images[0].source.url}'></img>
              <div class="info">
                <div class="investmentinfo">
                  <pre class="inventmentinfo1">Invested ${investment.amount} M¢ at ${investment.upvotes} upvotes</pre>
                  <pre class="inventmentinfo2">$ ${(() => {
                    //get % relative
                    var c = ""
                    var num = (C(investment.upvotes,res.score)*100)-100
                    if(num > -1) {
                      c = "+"
                    }
                    return c + num.toFixed(2)
                  })()}% (${(() => {
                    //get bal relative
                    var c = ""
                    var num = (C(investment.upvotes,res.score)*investment.amount) - investment.amount
                    if(num > -1) {
                      c = "+"
                    }
                    return c + Math.round(num)
                  })()} M¢)</pre>
                </div>
                <div class="investmentinfotime">
                  <pre class="investmenttime">${(() => {
                    var timeDifference = new Date((14400000 - (Date.now() - (investment.time * 1000))))
                    return String(timeDifference.getHours() - 1).padStart(2, "0")+":"+String(timeDifference.getMinutes()).padStart(2, "0")
                  })()}<img style="width: 20px;height: 20px;position: relative;top: 9px;margin: 5px;" src="./clock.svg"></img></pre>
                </div>
                <canvas class="upvotechart" width="520px" height="180px"></canvas>
              </div>
            </div>`
          }
          
          child.outerHTML = investmentHTML
          if(!(child.classList[1])) {
            var child = document.getElementById(child.id)
            formatChart(child.children[2].children[2], child.attributes[2].nodeValue)
          }
        }
      })
    })
    }
  })
  
  document.getElementsByClassName('mainchild')[0].innerHTML = batchHTML
  Array.from(document.getElementsByClassName('mainchild')[0].children).forEach((a) => {
    if(!(a.classList[1])) {
      var a = document.getElementById(a.id)
      formatChart(a.children[2].children[2], a.attributes[2].nodeValue)
    }
  })
}

document.getElementsByClassName('main')[1].onscroll = () => {
  var distancefrombottom = Math.abs(document.getElementsByClassName('main')[1].scrollTop - document.getElementsByClassName('main')[1].scrollHeight) - 990
  if(distancefrombottom < 4000 && global.isoktocall) {
    global.isoktocall = false;
    global.page++;
    socket.send(JSON.stringify({
      "type": "getPagePosts", 
      "data": global.page
    }));
  }
}