/* **************** Importing external and internal required dependenices and files ******************** */
const express                     = require('express'),
      app                         = express(),
      bodyParser                  = require('body-parser'),
      http                        = require('http'),
      socketIO                    = require('socket.io'),
      path                        = require('path'),
      getDhtSensorReadings        = require('./models/getDhtReadings');

/* **************** APP Config ****************** */
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'client')));

/* ************ Temporary storage for sensor readings *********** */
const cache = {
     temperature: null,
     humidity: null
};

app.get('/', function (req, res) {
     res.render('sensorreadings');
});
/* ************ Creatig HTTP Server ************ */
const httpServer = http.createServer(app);
/* ************* Integrating server with socket *************** */
const serverSocket = socketIO(httpServer);
serverSocket.on('connection', (socket) => {
     console.log('Client has connected');
     //Function to read sensor readings every 2 seconds
     setInterval(() => {
         getDhtSensorReadings((err, DHTTemp, DHTHumi) => {
             if (err) {
                 return console.log(`DHT Sensor Reading: ${err}`);
                } else {
                         if(cache.temperature != DHTTemp) {
                             //attaching cutom event for new temperature value
                              socket.emit('newTemparature', {
                                     temperature: DHTTemp 
                                });   
                            }
                         if(cache.humidity != DHTHumi){
                             //attaching cutom event for new humidity value
                              socket.emit('newHumidity', {
                                     humidity: DHTHumi 
                                });
                            }
                    }
            });
        }, 2000);
        
     //Listening for client disconnection
     socket.on('disconnect', () => {
          console.log('Client has disconnected'); 
     });
});

httpServer.listen(3030, () => {
     console.log('IoT Dashboard has started'); 
});