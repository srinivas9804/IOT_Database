
/*
setTimeout(() => {
  location.reload();
}, 30000);
*/
let lat, lon, sensorData;


if ('geolocation' in navigator) {
  console.log('geolocation available');
  navigator.geolocation.getCurrentPosition(async position => {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    const api_url = `/weather/${lat},${lon}`;
    const response = await fetch(api_url);
    const json = await response.json();
    const temp = document.getElementById('tempValue');
    const humid = document.getElementById('humidValue');
    temp.textContent = json.currently.temperature;
    humid.textContent = json.currently.humidity;
    console.log(json);
  });
}
else{
  console.log('geolocation not available');
}
getData();

async function getData(){
  const response = await fetch('/api');
  sensorData = await response.json();
  console.log(sensorData.length);
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
  const timestamp = [];

  for(item of sensorData){
    temperature.unshift(item.temperature);
    moisture.unshift(item.moisture);
    ph.unshift(item.ph);
    light.unshift(item.light);
    timestamp.unshift(item.timestamp);
  }


  var tempChart = new Chart(ctx1, {
    type: 'line',
    data: {
        labels: timestamp,
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
                distribution:'series',
                time: {
                  displayFormats: {
                        second: 'h:mm:ss'
                    }
                }
            }]
        }
    }
  });

  var moistChart = new Chart(ctx2, {
    type: 'line',
    data: {
        labels: timestamp,
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
                distribution:'series',
                time: {
                    displayFormats: {
                        second: 'h:mm:ss'
                    }
                }
            }]
        }
    }
  });

  var phChart = new Chart(ctx3, {
    type: 'line',
    data: {
        labels: timestamp,
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
                distribution:'series',
                time: {
                    displayFormats: {
                        second: 'h:mm:ss'
                    }
                }
            }]
        }
    }
  });

  var lightChart = new Chart(ctx4, {
    type: 'line',
    data: {
        labels: timestamp,
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
                distribution:'series',
                time: {
                    displayFormats: {
                        second: 'h:mm:ss'
                    }
                }
            }]
        }
    }
  });
}