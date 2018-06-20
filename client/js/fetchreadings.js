/* ************** Line Chart Config For Temperature ********** */
const temperatureCanvasCtx = document.querySelector('#temperature-chart').getContext('2d');
const temperatureChartConfig = {
     //temperature as a grid line chart
     type: 'line',
     data: {
         //label for x-axis which represents time
         labels: [],
         //dataset for temperature values
         datasets: [{
             data: [],
             backgroundColor: 'rgba(234, 82, 82, 0.7)'
            }]
        },
     options: {
         legend: {
             display: false
            },
         responsive: true,
         maintainAspectRatio: false,
         scales: {
             yAxes: [{
                 ticks: {
                     suggestedMin: 10,
                     suggestedMax: 40
                        }
                }]
            }
        }
                  
    };
const temperatureChart = new Chart(temperatureCanvasCtx, temperatureChartConfig);
             
/* ***************** Line Chart Config For Humidity ************************* */
const humidityCanvasCtx = document.querySelector('#humidity-chart').getContext('2d');
const humidityChartConfig = {
     type: 'line',
     data: {
         labels: [],
         datasets: [{
             data: [],
             backgroundColor: 'rgba(234, 82, 82, 0.7)'
            }]
        },
     options: {
         legend: {
             display: false
            },
         responsive: true,
         maintainAspectRatio: false,
         scales: {
                 yAxes: [{
                     ticks: {
                         suggestedMin: 30,
                         suggestedMax: 90
                        }
                    }]
                }
        }
    };
const humidityChart = new Chart(humidityCanvasCtx, humidityChartConfig);
             
const addData = (arr, value, maxLen) => {
     arr.push(value);
     if(arr.length > maxLen) {
         arr.shift();
        }
    };
             
/* ************ Initializing client side socket connection with "io" ***************** */
const clientSocket = io();
clientSocket.on('connect', () => {
     console.log('Connected to server');    
});

/* ************* Listening on custom event for getting new temperature value ***************** */
clientSocket.on('newTemparature', (temperatureObject) => {
      const dateNow = new Date();
      const timeNow = `${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}`;
      addData(temperatureChartConfig.data.labels, timeNow, 10);
      addData(temperatureChartConfig.data.datasets[0].data, temperatureObject.temperature, 10);
      temperatureChart.update();
      const temperatureValue = document.querySelector('.temperature-value');
      temperatureValue.textContent = `${temperatureObject.temperature}°C`; 
});


/* ************* Listening on custom event for getting new humidity value ***************** */
clientSocket.on('newHumidity', (humidityObject) => {
      const dateNow = new Date();
      const timeNow = `${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}`;
      addData(humidityChartConfig.data.labels, timeNow, 10);
      addData(humidityChartConfig.data.datasets[0].data, humidityObject.humidity, 10);
      humidityChart.update();
      const humidityValue = document.querySelector('.humidity-value');
      humidityValue.textContent = `${humidityObject.humidity}%`; 
});

