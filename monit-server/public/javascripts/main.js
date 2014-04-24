var socket = io.connect();

var time = [];
var mem = [];

var options = {
  scaleOverride : false,
  scaleSteps : null,
  scaleStepWidth : null,
  scaleStartValue : 1,
  animation : false
}

var dataChart = {
  labels : time,
  datasets : [
    {
      fillColor : "rgba(151,187,205,0.5)",
      strokeColor : "rgba(151,187,205,1)",
      pointColor : "rgba(151,187,205,1)",
      pointStrokeColor : "#fff",
      data : mem
    }
  ]
}

var ctx = document.getElementById("myChart").getContext("2d");
var myNewChart = new Chart(ctx);

socket.on('monit', function(data) {
  
  if (time.length > 30 || mem.length > 30) {
    time.shift();
    mem.shift();
  }

  time.push(data.date);
  mem.push(data.mem);

  myNewChart.Line(dataChart, options);
  console.log(data);
});