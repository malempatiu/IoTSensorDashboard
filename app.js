/* **************** Importing external and internal required dependenices and files ******************** */
const express         = require('express'),
      app             = express(),
      bodyParser      = require('body-parser'),
      http            = require('http'),
      socketIO        = require('socket.io'),
      path            = require('path'),
      sensorCacheData = require('./models/getCachedSensorReadings.js'),
      sensorDb        = require('./models/sensor_db');

/* **************** APP Config ****************** */
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'client')));


app.get('/', function (req, res) {
         res.render('sensorreadings');
    });

/* **************** Fetching last ten temperature readings ******************** */ 
app.get('/temperature/histroy', (err, res) => {
         
         if (err) {
                 console.log(`Temperature Fetching Error: ${err}`); 
            } else {
                 sensorDb.fetchLatestReadings('temperature', 10, (err, data) => {
                     if (err) {
                             console.log(err);
                             return res.status(500).end();
                        } else {
                             res.json(data.reverse()); 
                        }   
                    });   
                }
    });

/* **************** Fetching last ten humidity readings ******************** */ 
app.get('/humidity/histroy', (err, res) => {
         
        if (err) {
             console.log(`Humidity Fetching Error: ${err}`); 
            } else {
                 sensorDb.fetchLatestReadings('humidity', 10, (err, data) => {
                     if (err) {
                             console.log(err);
                             return res.status(500).end();
                        } else {
                             res.json(data.reverse()); 
                        }   
                    });   
                }
    });    

/* ************ Creatig HTTP Server ************ */
const httpServer = http.createServer(app);
/* ************* Integrating server with socket *************** */
const serverSocket = socketIO(httpServer);
serverSocket.on('connection', (socket) => {
         console.log('Client has connected');
         socket.emit('newTemparature', {
                 temperature: sensorCacheData.getTemperature 
            });   
         socket.emit('newHumidity', {
                 humidity: sensorCacheData.getHumidity 
            });
        
         //Listening for client disconnection
         socket.on('disconnect', () => {
                 console.log('Client has disconnected'); 
            });
    });

httpServer.listen(3030, () => {
     console.log('IoT Dashboard has started'); 
});