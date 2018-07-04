/* **************************** Importing and initiating sqlite database ******************** */
const sqlite3Db = require('sqlite3'),
      path      = require('path'),
      db        = new sqlite3Db.Database(path.resolve('./sensor_DB'));
      
/* ********************** Adding temperature to db ************** */
const insertReading = (readingType, value) => {
         db.run(`INSERT INTO ${readingType} VALUES (datetime('now'), ${value});`)  
    };
    
/* ********************* Fetching n readings ex: 10 ************* */
const fetchLatestReadings = (readingType, limit, callback) => {
         db.all(`SELECT * FROM ${readingType} ORDER BY createdAt DESC LIMIT ${limit}`, callback) 
    };
    
module.exports = {
         insertReading,
         fetchLatestReadings
    };    