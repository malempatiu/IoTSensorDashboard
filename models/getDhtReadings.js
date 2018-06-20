/* *************** Importing the DHT Sensor Library ***************** */
const dhtSensor  = require('node-dht-sensor');

const getDhtSensorReadings = (callback) => {
     //11 represents the DHT11 Sensor & 4 RPi GPIO to read sensor data
     dhtSensor.read(11, 4, (err, temperature, humidity) => {
         
         if (err) {
             
             return callback(err);
             
         } else {
             
             callback(null, temperature, humidity);
             
         }
     });  
};

module.exports = getDhtSensorReadings;