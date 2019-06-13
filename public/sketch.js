getData();

async function getData(){
  const response = await fetch('/api');
  const data = await response.json();
  console.log(data);
  if(data.length > 0){
    table = document.getElementById('table');
    console.log(data[data.length-1].temperature);
    /*
    table.style.width  = '100px';
    table.style.border = '1px solid black';
    const header = table.createTHead();
    var row = header.insertRow(0);
    var timestamp = row.insertCell(0);
    var temp = row.insertCell(1);
    var moisture = row.insertCell(2);
    var ph = row.insertCell(3);
    var light = row.insertCell(4);
          
    temp.textContent = 'Temperature';
    moisture.textContent = 'Moisture';
    timestamp.textContent = "Time";
    ph.textContent = "pH";
    light.textContent = "Light";

    temp.style.border = '1px solid black';
    moisture.style.border = '1px solid black';
    timestamp.style.border = '1px solid black';
    ph.style.border = '1px solid black';
    light.style.border = '1px solid black';
    */
    ctr = 0;
    console.log(new Date(data[0].timestamp).toLocaleString());
    console.log(new Date(data[data.length-1].timestamp).toLocaleString());
    for(item of data){
      ctr++;
      if (ctr > 20) {break;}
      row = table.insertRow();
      timestamp = row.insertCell(0);
      temp = row.insertCell(1);
      moisture = row.insertCell(2);
      ph = row.insertCell(3);
      light = row.insertCell(4);

      /*
      temp.style.border = '1px solid black';
      moisture.style.border = '1px solid black';
      timestamp.style.border = '1px solid black';
      ph.style.border = '1px solid black';
      light.style.border = '1px solid black';
      */

      temp.textContent = `${item.temperature}`;
      moisture.textContent = `${item.moisture}`;
      ph.textContent = `${item.ph}`;
      light.textContent = `${item.light}`;
      const dateString = new Date(item.timestamp).toLocaleString();
      timestamp.textContent = dateString;
    }
    chartIt(data);
  }
  else{
    document.write('<H1>No data to show</H1>');
  }  
}

async function chartIt(data){
  var ctx1 = document.getElementById('ch1').getContext('2d');
  var ctx2 = document.getElementById('ch2').getContext('2d');
  var ctx3 = document.getElementById('ch3').getContext('2d');
  var ctx4 = document.getElementById('ch4').getContext('2d');

  const temperature = [];
  const moisture = [];
  const ph = [];
  const light =[];
  const timestamp = [];

  for(item of data){
    temperature.unshift(item.temperature);
    moisture.unshift(item.moisture);
    ph.unshift(item.ph);
    light.unshift(item.light);
    timestamp.unshift(item.timestamp);
    console.log("shaata" + item.timestamp);
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
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            xAxes: [{
                type: 'time',
                distribution:'series',
                time: {
                  unit: 'second',
                },
                ticks:{
                  source: 'auto'
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
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            xAxes: [{
                type: 'time',
                distribution:'series',
                time: {
                    displayFormats: {
                        second: 'h:mm:ss a'
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
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            xAxes: [{
                type: 'time',
                distribution:'series',
                time: {
                    displayFormats: {
                        second: 'h:mm:ss a'
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
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            xAxes: [{
                type: 'time',
                distribution:'series',
                time: {
                    displayFormats: {
                        second: 'h:mm:ss a'
                    }
                }
            }]
        }
    }
  });
}