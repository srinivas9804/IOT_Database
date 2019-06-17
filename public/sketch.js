
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
let buttonArr = [dayButton,weekButton,monthButton,yearButton,maxButton];
let indexCtr = 4;
maxButton.style.color = '#fff';
maxButton.style.background = '#36A2EB'; 

if ('geolocation' in navigator) {
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
    location.textContent = json.timezone;
  });
}
else{
  console.log('geolocation not available');
}
getData();



function onClickListener(button){
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
        buttonArr[i].style.background = '#36A2EB';
      }
      else{
        buttonArr[i].style.color = '#36A2EB';
        buttonArr[i].style.background = '#fff';
      }
    }
    indexCtr = newCtr;
    updateChart();
  }
}


async function getData(){
  const response = await fetch('/api');
  sensorData = await response.json();
  console.log('Data length = ' + sensorData.length);
  if(sensorData.length > 0){
    table = document.getElementById('table');

    ctr = 0;//ctr controls the number of elements displayed in the table
    for(var i = sensorData.length-1; i>=0; i--){
      item = sensorData[i];
      ctr++;
      if (ctr > 20) {break;}
      row = table.insertRow();
      timestamp = row.insertCell(0);
      temp = row.insertCell(1);
      moisture = row.insertCell(2);
      ph = row.insertCell(3);
      light = row.insertCell(4);

      temp.textContent = `${item.temperature}`;
      moisture.textContent = `${item.moisture}`;
      ph.textContent = `${item.ph}`;
      light.textContent = `${item.light}`;
      const dateString = new Date(item.timestamp).toLocaleString();
      timestamp.textContent = dateString;
    }
    chartIt();
  }
  else{
    document.write('<H1>No data to show</H1>');
  }  
}

async function chartIt(){
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
    temperature.unshift(temp_item);
    moisture.unshift(moist_item);
    ph.unshift(ph_item);
    light.unshift(light_item);
  }


  tempChart = new Chart(ctx1, {
    type: 'line',
    data: {
        datasets: [{
            label: 'Temperature',
            data: temperature,
            fill: false,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 
                'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            pointRadius: 0
        }]
    },
    options: {
        scales: {
            xAxes: [{
                type: 'time',
                distribution:'series'
            }]
        }
    }
  });

  moistChart = new Chart(ctx2, {
    type: 'line',
    data: {
        datasets: [{
            label: 'Moisture',
            data: moisture,
            fill: false,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 
                'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            pointRadius: 0
        }]
    },
    options: {
        scales: {
            xAxes: [{
                type: 'time',
                distribution:'series'
            }]
        }
    }
  });

  phChart = new Chart(ctx3, {
    type: 'line',
    data: {
        datasets: [{
            label: 'pH',
            data: ph,
            fill: false,
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 
                'rgba(255, 206, 86, 1)',
            borderWidth: 1,
            pointRadius: 0
        }]
    },
    options: {
        scales: {
            xAxes: [{
                type: 'time',
                distribution:'series'
            }]
        }
    }
  });

  lightChart = new Chart(ctx4, {
    type: 'line',
    data: {
        datasets: [{
            label: 'Light',
            data: light,
            fill: false,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 
                'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            pointRadius: 0
        }]
    },
    options: {
        scales: {
            xAxes: [{
                type: 'time',
                distribution:'series'
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
    refTime = 60000;//at the moment 1 minute, change for 1 day
  }
  else if(indexCtr == 1){
    refTime = 60000*5;//5 minutes change to 1 week
  }
  else if(indexCtr == 2){
    refTime = 60000*10;//10 minutes change to 1 month   
  }
  else if(indexCtr == 3){
    refTime = 60000*20;
  }
  else{
    refTime = -1;
  }
  first_item = sensorData[sensorData.length-1];
    first_time = first_item.timestamp;
    for(var i = sensorData.length-1; i >= 0;i--){
    if(first_time - sensorData[i].timestamp > refTime && refTime >= 0)//at the moment 1 minute for testing
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