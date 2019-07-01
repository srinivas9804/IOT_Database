
/*
setTimeout(() => {
  location.reload();
}, 30000);
*/
let lat, lon, sensorData;
let tempChart, moistChart, lightChart, phChart;
let chartArr;

let dayButton = document.getElementById('dayButton');
let weekButton = document.getElementById('weekButton');
let monthButton = document.getElementById('monthButton');
let yearButton = document.getElementById('yearButton');
let maxButton = document.getElementById('maxButton');
let buttonArr = [dayButton,weekButton,monthButton,yearButton,maxButton]; //just for easier iteration 
let indexCtr = 4;
maxButton.style.color = '#fff';
maxButton.style.background = '#007bff';

let allNodes = document.getElementById('allNodes');
let sn1 = document.getElementById('node1');
let sn2 = document.getElementById('node2');
let sn3 = document.getElementById('node3');
let nodeCtr = 0;


if ('geolocation' in navigator) {//Passing lat and long to server. Gets the local weather and updates 
  console.log('geolocation available');
  navigator.geolocation.getCurrentPosition(async position => {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    const api_url = `/weather/${lat},${lon}`;
    const response = await fetch(api_url);
    const json = await response.json();
    const location = document.getElementById('location');
    const temp = document.getElementById('tempValue');
    const humid = document.getElementById('humidValue');
    temp.textContent = json.currently.temperature;
    humid.textContent = json.currently.humidity;
    location.textContent = json.timezone
  });
}
else{
  const weatherText = document.getElementById('weatherText');
  weatherText.textContent = 'Current Weather not available';
  console.log('geolocation not available');
}
getData('all');

function onClickNodeListener(button){
  let tempCtr;
  if(button == allNodes){
    tempCtr = 0;
  }
  else if(button == sn1){
    tempCtr = 1;
  }
  else if(button == sn2){
    tempCtr = 2;
  }
  else if(button == sn3){
    tempCtr = 3;
  }
  if(tempCtr != nodeCtr){
    nodeCtr = tempCtr;
    if(nodeCtr == 0){
      getData('all');
    }
    else if(nodeCtr == 1){
      getData('SN1');
    }
    else if(nodeCtr == 2){
      getData('SN2');
    }
    else if(nodeCtr == 3){
      getData('SN3');
    } 
  }
}

function onClickScaleListener(button){//changing the timescale of the data 
  let newCtr;
  if(button == dayButton){
    newCtr = 0;
  }
  else if(button == weekButton){
    newCtr = 1;
  }
  else if(button == monthButton){
    newCtr = 2;
  }
  else if(button == yearButton){
    newCtr = 3;
  }
  else{
    newCtr = 4;
  }

  if(newCtr != indexCtr){
    for(var i =0; i < buttonArr.length; i++){
      if(i == newCtr){
        buttonArr[i].style.color = '#fff';
        buttonArr[i].style.background = '#007bff';
      }
      else{
        buttonArr[i].style.color = '#007bff';
        buttonArr[i].style.background = '#fff';
      }
    }
    indexCtr = newCtr;
    updateChart();
  }
}


async function getData(sensorNode){//fetching data from the node server, which in turn gets the data stored in the mongo-db
  const response = await fetch(`/api/${sensorNode}`);
  sensorData = await response.json();
  console.log('Data length = ' + sensorData.length);
  if(sensorData.length > 0){
    dataContainer = document.getElementById('dataContainerID');
    errorMessage = document.getElementById('noDataMessage');
    dataContainer.style.visibility = 'visible';
    dataContainer.style.display = 'grid';
    errorMessage.style.visibility = 'hidden';
    errorMessage.style.display = 'none';

    const table = document.getElementById('table');
    for(var i = table. rows. length - 1; i > 0; i--){
      table. deleteRow(i);
    }
    ctr = 0;//ctr controls the number of elements displayed in the table
    for(var i = sensorData.length-1; i>=0; i--){
      item = sensorData[i];
      ctr++;
      if (ctr > 15) {break;}// change the threshold value to get more/less data in the table
      row = table.insertRow();
      id = row.insertCell(0);
      timestamp = row.insertCell(1);
      temp = row.insertCell(2);
      moisture = row.insertCell(3);
      ph = row.insertCell(4);
      light = row.insertCell(5);

      id.textContent = `${item.sensorID}`;
      temp.textContent = `${item.temperature}`;
      moisture.textContent = `${item.moisture}`;
      ph.textContent = `${item.ph}`;
      light.textContent = `${item.light}`;
      const dateString = new Date(item.timestamp).toLocaleString();
      timestamp.textContent = dateString;
    }
    if(tempChart == null){
      chartIt();
    }
    else{
      updateChart();
    }
  }
  else{
    const table = document.getElementById('table');
    for(var i = table. rows. length - 1; i > 0; i--){
      table. deleteRow(i);
    }
    if(tempChart != null){
      dataContainer = document.getElementById('dataContainerID');
      errorMessage = document.getElementById('noDataMessage');
      dataContainer.style.visibility = 'hidden';
      dataContainer.style.display = 'none';
      errorMessage.style.visibility = 'visible';
      errorMessage.style.display = 'grid';
    }
  }  
}

async function chartIt(){//function that creates the 4 charts

  /*
  would probably be better to use arrays and loop through, slightly lazy.
  */

  var parent1 = document.getElementById('chart1');
  var canvas1 = document.getElementById('ch1');
  var parent2 = document.getElementById('chart2');
  var canvas2 = document.getElementById('ch2');
  var parent3 = document.getElementById('chart3');
  var canvas3 = document.getElementById('ch3');
  var parent4 = document.getElementById('chart4');
  var canvas4 = document.getElementById('ch4');

  canvas1.width = parent1.offsetWidth;
  canvas1.height = parent1.offsetHeight;
  canvas2.width = parent2.offsetWidth;
  canvas2.height = parent2.offsetHeight;
  canvas3.width = parent3.offsetWidth;
  canvas3.height = parent3.offsetHeight;
  canvas4.width = parent4.offsetWidth;
  canvas4.height = parent4.offsetHeight;
  
  var ctx1 = document.getElementById('ch1').getContext('2d');
  var ctx2 = document.getElementById('ch2').getContext('2d');
  var ctx3 = document.getElementById('ch3').getContext('2d');
  var ctx4 = document.getElementById('ch4').getContext('2d');

  const temperature = [];
  const moisture = [];
  const ph = [];
  const light =[];

  for(item of sensorData){
    var temp_item = {x:item.timestamp, y:item.temperature};
    var moist_item = {x:item.timestamp, y:item.moisture};
    var ph_item = {x:item.timestamp, y:item.ph};
    var light_item = {x:item.timestamp, y:item.light};
    temperature.push(temp_item);
    moisture.push(moist_item);
    ph.push(ph_item);
    light.push(light_item);
  }


  tempChart = new Chart(ctx1, {
    maintainAspectRatio: false,
    type: 'line',
    responsive: true,
    data: {
        datasets: [{
            label: 'Temperature',
            data: temperature,
            fill: false,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            pointRadius: 0
        }]
    },
    options: {
        scales: {
            xAxes: [{
                type: 'time',
                distribution:'series',
                time:{
                  unit: 'month'
                },
                ticks: {
                  autoSkip: true,//really important 
                  source: 'data',
                  maxTicksLimit: 10
                }
            }]
        }
    }
  });

  moistChart = new Chart(ctx2, {
    maintainAspectRatio: false,
    type: 'line',
    responsive: true,
    data: {
        datasets: [{
            label: 'Moisture',
            data: moisture,
            fill: false,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            pointRadius: 0
        }]
    },
    options: {
        scales: {
            xAxes: [{
                type: 'time',
                distribution:'series',
                time:{
                  unit: 'month'
                },
                ticks: {
                  autoSkip: true,
                  source: 'data',
                  maxTicksLimit: 10
                }
            }]
        }
    }
  });

  phChart = new Chart(ctx3, {
    maintainAspectRatio: false,
    type: 'line',
    responsive: true,
    data: {
        datasets: [{
            label: 'pH',
            data: ph,
            fill: false,
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
            pointRadius: 0
        }]
    },
    options: {
        scales: {
            xAxes: [{
                type: 'time',
                distribution:'series',
                time:{
                  unit: 'month'
                },
                ticks: {
                  autoSkip: true,
                  source: 'data',
                  maxTicksLimit: 10
                }
            }]
        }
    }
  });

  lightChart = new Chart(ctx4, {
    maintainAspectRatio: false,
    type: 'line',
    responsive: true,
    data: {
        datasets: [{
            label: 'Light',
            data: light,
            fill: false,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            pointRadius: 0
        }]
    },
    options: {
        scales: {
            xAxes: [{
                type: 'time',
                distribution:'series',
                time:{
                  unit: 'month'
                },
                ticks: {
                  autoSkip: true,
                  source: 'data',
                  maxTicksLimit: 10
                }
            }]
        }
    }
  });
  chartArr = [tempChart, moistChart, lightChart, phChart];
  console.log(chartArr[0]);
}

function updateChart(){
  const temperature = [];
  const moisture = [];
  const ph = [];
  const light =[];
  let refTime = 0;
  if(indexCtr == 0){
    refTime = 86400000;//86400000 = 1 day
    for (var i = chartArr.length - 1; i >= 0; i--) {
      chartArr[i].options.scales.xAxes[0].time.unit = 'hour';
      chartArr[i].options.scales.xAxes[0].time.displayFormats.hour = 'Do MMM hA';
    }
  }
  else if(indexCtr == 1){
    refTime = 604800000;//604800000 = 1 week
    for (var i = chartArr.length - 1; i >= 0; i--) {
      chartArr[i].options.scales.xAxes[0].time.unit = 'day';
    }
  }
  else if(indexCtr == 2){
    refTime = 2.629746 * Math.pow(10,9);//2.629746 * Math.pow(10,9) = 1 month
    for (var i = chartArr.length - 1; i >= 0; i--) {
      chartArr[i].options.scales.xAxes[0].time.unit = 'week';
    }
  }
  else if(indexCtr == 3){
    refTime = 3.1556952 * Math.pow(10,10);//3.1556952 * Math.pow(10,10) = 1 year
    for (var i = chartArr.length - 1; i >= 0; i--) {
      chartArr[i].options.scales.xAxes[0].time.unit = 'month';
    }
  }
  else{
    refTime = -1;
  }
  first_item = sensorData[sensorData.length-1];
  first_time = first_item.timestamp;
  for(var i = sensorData.length-1; i >= 0;i--){
    if((first_time - sensorData[i].timestamp) > refTime && refTime >= 0)//at the moment 1 minute for testing
      break;
    item = sensorData[i];
    var temp_item = {x:item.timestamp, y:item.temperature};
    var moist_item = {x:item.timestamp, y:item.moisture};
    var ph_item = {x:item.timestamp, y:item.ph};
    var light_item = {x:item.timestamp, y:item.light};
    temperature.unshift(temp_item);
    moisture.unshift(moist_item);
    ph.unshift(ph_item);
    light.unshift(light_item);
  }

  data = [temperature, moisture, light, ph];

  for(var i =0;i<chartArr.length;i++){
    chartArr[i].data.datasets[0].data = data[i];
    chartArr[i].update();
  }
}