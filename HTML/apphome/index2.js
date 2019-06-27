
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

window.memory = {}
window.usercharts = {};
window.charts = {}
window.formatChart = (chart, postID) => {
  getChartInfo(postID, (data) => {
    var ctx = chart.getContext("2d"); 
    var myChart = new ChartModern(ctx, {
      type: 'line',
      data: {
        labels: data.time,
        datasets: [{
          label: '# of Votes',
          data: data.values,
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderColor: 'rgba(0, 0, 255, 1)',
          borderWidth: 2
        }]
      },
      options: {
        tooltips: {
          mode: 'nearest',
          axis: 'x'
        },
        animation: false,
        elements: {
          line: {
            tension: 0
          },
          point: {
            radius: 0,
            hitRadius: 10000000,
            hoverRadius: 0
          }
        },
        scales: {
          xAxes: [{
            display: false
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        responsive: false
      }
    });
    if(window.charts[postID]) {
      window.charts[postID].push(myChart)
    } else {
      window.charts[postID] = [myChart]
    }
  })
}

window.formatChartUser = (chart, data,name ) => {
  var ctx = chart.getContext("2d"); 
  var myChart = new ChartModern(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Investment Profit',
        data: data.data,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderColor: 'rgba(0, 0, 255, 1)',
        borderWidth: 2
      }]
    },
    options: {
      tooltips: {
        mode: 'nearest',
        axis: 'x'
      },
      animation: false,
      elements: {
        line: {
          tension: 0
        },
        point: {
          radius: 0,
          hitRadius: 10000000,
          hoverRadius: 0
        }
      },
      scales: {
        xAxes: [{
          display: false
        }]
      },
      responsive: false
    }
  });
  window.usercharts[name] = myChart
}

window.clearChartUser = (chart) => {
  var ctx = chart.getContext("2d"); 
  var myChart = new ChartModern(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Investment Profit',
        data: [],
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderColor: 'rgba(0, 0, 255, 1)',
        borderWidth: 2
      }]
    },
    options: {
      tooltips: {
        mode: 'nearest',
        axis: 'x'
      },
      animation: false,
      elements: {
        line: {
          tension: 0
        },
        point: {
          radius: 0,
          hitRadius: 10000000,
          hoverRadius: 0
        }
      },
      scales: {
        xAxes: [{
          display: false
        }]
      },
      responsive: false
    }
  });
  Object.keys(window.usercharts).forEach((i) => {
    window.usercharts[i].destroy();
    delete window.usercharts[i]
  })
}


var getChartInfo = (id, cb) => {
  if(window.memory[id]) {
    var data = window.memory[id]
    data.time = Array.from(data.time, (c) => {
      var now = new Date(c)
      return formatAMPM(now) + " " + monthNames[now.getMonth()] + " " + now.getDate()
    })
    
    cb(data)
  }
  var uuid = uuidv4()
  var x = ("responseTo:" + uuid)
  window.socket.send(JSON.stringify({
    type: "getUpvoteHistory",
    data: {
      "uuid": uuid,
      "id": id
    }
  }))
  window.myEmitter.on(x, (data, ws) => {
    window.memory[id] = data
    /*data.time = data.time.filter(function(value, index, Arr) {
      return index % Math.ceil(data.time.length / 200) == 0;
    });
    data.values = data.values.filter(function(value, index, Arr) {
      return index % Math.ceil(data.time.length / 200) == 0;
    });*/
    data.time = Array.from(data.time, (c) => {
      var now = new Date(c)
      return formatAMPM(now).split(" ")[0] + ":" + String(now.getSeconds()).padStart(2, "0") + " " + formatAMPM(now).split(" ")[1] + " " + monthNames[now.getMonth()] + " " + now.getDate()
    })
    
    cb(data)
  })
  
}
