/* *************************** Importing Sensor DB and Sensor Cached Readings Modules *************** */ 
const getDhtSensorReadings = require('./getDhtReadings'),
      sensorDB             = require('./sensor_db');

/* ************ Temporary storage for sensor readings *********** */
const cache = {
         temperature: null,
         humidity: null
    };

/* ********************* Function to read sensor readings every 2 seconds **************** */
setInterval(() => {
     getDhtSensorReadings((err, DHTTemp, DHTHumi) => {
         if (err) {
             return console.log(`DHT Sensor Reading: ${err}`);
            } else {
                //storing readings in cache as well as in db
                sensorDB.insertReading('temperature', DHTTemp);
                sensorDB.insertReading('humidity', DHTHumi);
                cache.temperature = DHTTemp;
                cache.humidity    = DHTHumi;
            }
        });    
    }, 2000);
    
module.exports.getTemperature = () => cache.temperature
module.exports.getHumidity = () => cache.humidity
    