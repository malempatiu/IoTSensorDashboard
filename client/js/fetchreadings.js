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
             backgroundColor: 'rgba(255, 44, 44, 0.7)'
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
             backgroundColor: 'rgba(33, 34, 255, 0.7)'
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
    
const fetchTemperatureHistory = () => {
         fetch('/temperature/history').then(response => {
             return response.json();
         }).then(data => {
             data.forEach( (reading) => {
                     const dateNow = new Date(reading.createdAt + 'Z');
                     const timeNow = `${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}`;
                     addData(temperatureChartConfig.data.labels, timeNow, 10);
                     addData(temperatureChartConfig.data.datasets[0].data, reading.value, 10);
                });
                temperatureChart.update();
            });   
    };
fetchTemperatureHistory();

const fetchHumidityHistory = () => {
         fetch('/humidity/history').then(response => {
             return response.json();
         }).then(data => {
             data.forEach( (reading) => {
                     const dateNow = new Date(reading.createdAt + 'Z');
                     const timeNow = `${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}`;
                     addData(humidityChartConfig.data.labels, timeNow, 10);
                     addData(humidityChartConfig.data.datasets[0].data, reading.value, 10);
                });
                
                humidityChart.update();
            });   
    }; 
fetchHumidityHistory();

/* ************ Initializing client side socket connection with "io" ***************** */
const clientSocket = io();
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

