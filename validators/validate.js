const jwt = require('jsonwebtoken');
var resultsNotFound = {
    "errorCode": "0",
    "errorMessage": "Server Error.",
    "rowCount": "0",
    "data": ""
  };

module.exports = {
    checkInputDataNULL: function(req, res) {
        if (!req.body) return res.send(resultsNotFound);
    },
    checkInputDataQuality: function(req, res) {
        resultsNotFound["errorMessage"] = "There is no data submitted from Client.";
        if (req.body.userName == "") return res.send(resultsNotFound);
      },
    checkJWTToken: function(req, res) {
        const token = req.headers.token;
        console.log(token);
        
        if (!token) res.sendStatus(400);
        const decoded = jwt.verify(
        token,
        "MySuperSecretPassword"
        );
        console.log(decoded);
        
        resultsNotFound["errorMessage"] = "Your token in not valid, please logoff and login again.";
        if (!decoded) return res.send(resultsNotFound);
        return decoded.userName;
    }
  };