const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const cors = require('cors');
const allowedOrigins = process.env.allowedOrigins;
const valFunctions = require('./validators/validate');


app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' + 'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));



const jsonParser = bodyParser.json()

app.post('/sign_up', jsonParser, function (req, res) {
    if(valFunctions.checkInputDataNULL(req,res)) return false;
    if(valFunctions.checkInputDataQuality(req,res)) return false;

    var dbFunctions = require('./models/connector');
    dbFunctions.createUser(req,res); 
});
app.post('/login', jsonParser, function (req, res) {
    if(valFunctions.checkInputDataNULL(req,res)) return false;
    if(valFunctions.checkInputDataQuality(req,res)) return false;

    var dbFunctions = require('./models/connector');
    dbFunctions.loginUser(req,res); 
});

app.post('/upload', jsonParser, function (req, res) {

    var userName = valFunctions.checkJWTToken(req,res);
    if(!userName) return false;

    var dbFunctions = require('./models/connector');
    dbFunctions.uploadSong(req,res); 
});

app.post('/most_listened', jsonParser, function (req, res) {

    var dbFunctions = require('./models/connector');
    dbFunctions.most_listened(req,res); 
});

app.post('/recently_added', jsonParser, function (req, res) {

    var dbFunctions = require('./models/connector');
    dbFunctions.recently_added(req,res); 
});

app.post('/addtoPlaylist', jsonParser, function (req, res) {

    var userName = valFunctions.checkJWTToken(req,res);
    if(!userName) return false;

    var dbFunctions = require('./models/connector');
    dbFunctions.addtoPlaylist(req,res); 
});

app.post('/playlist', jsonParser, function (req, res) {

    var userName = valFunctions.checkJWTToken(req,res);
    if(!userName) return false;

    var dbFunctions = require('./models/connector');
    dbFunctions.playlist(req,res); 
});

app.post('/increaseListens', jsonParser, function (req, res) {

    var dbFunctions = require('./models/connector');
    dbFunctions.increaseListens(req,res); 
});

app.post('/search', jsonParser, function (req, res) {

    var dbFunctions = require('./models/connector');
    dbFunctions.search(req,res); 
});


app.use('/', (req,res) => res.send("welcome to the music server"));

app.listen(process.env.PORT,() => console.log('server is ready to listen at '+ process.env.PORT));