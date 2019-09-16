let mysql = require('mysql');
var bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

var pool  = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'musicapp'
  });

var resultsNotFound = {
    "errorCode": "0",
    "errorMessage": "Operation not successful.",
    "rowCount": "0",
    "data": ""
  };
  var resultsFound = {
    "errorCode": "1",
    "errorMessage": "Operation successful.",
    "rowCount": "1",
    "data": ""
};



module.exports = {
    createUser: function (req, res) {
      pool.getConnection(function (err, connection) {
        if (err) throw err; // not connected!
  
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
          var sql = 'INSERT INTO user SET ?';
          var values = { 'userName': req.body.userName,  'password': hash, 'createdAt': new Date() }
          // Use the connection
          connection.query(sql, values, function (error, results, fields) {
            if (error) {
              resultsNotFound["errorMessage"] = "Username already exists.";
              return res.send(resultsNotFound);
            } else return res.send(resultsFound);
        });
            // When done with the connection, release it.
            connection.release(); // Handle error after the release.
            if (err) throw error; // Don't use the connection here, it has been returned to the pool.

        });
      });
    },

    loginUser: function (req, res) {
        pool.getConnection(function (err, connection) {
          if (err) throw err; // not connected!
    
            var sql = 'SELECT * FROM `user` WHERE `userName` = ?';
            var values = [req.body.userName]
            // Use the connection
            connection.query(sql, values, function (error, results, fields) {
              if (error) {
                resultsNotFound["errorMessage"] = "Something went wrong with Server.";
                return res.send(resultsNotFound);
              }
              if (results =="") {
                resultsNotFound["errorMessage"] = "User Id not found.";
                return res.send(resultsNotFound);
              }
              bcrypt.compare(req.body.password, results[0].password, function (err, result) {
                if (result == true) {
                  var token = {
                    "token": jwt.sign(
                      { userName: req.body.userName },
                      process.env.JWT_SECRET,
                      { expiresIn: '30d' }
                    )
            }
            resultsFound["data"] = token;
            res.send(resultsFound);
          } else {
            resultsNotFound["errorMessage"] = "Incorrect Password.";
            return res.send(resultsNotFound);
          }
        });
    
              // When done with the connection, release it.
              connection.release(); // Handle error after the release.
              if (err) throw error; // Don't use the connection here, it has been returned to the pool.
            });
          });
      },
      uploadSong: function (req, res) {
        pool.getConnection(function (err, connection) {
          if (err) throw err; // not connected!
            console.log(req.body);
            
            var sql = 'INSERT INTO audio SET ?';
            var values = { 'title': req.body.title, 'artist': req.body.artist, 'album': req.body.album, 'link': req.body.link, 'listens': 0 , 'uploaddate': new Date()};
            // Use the connection
            connection.query(sql, values, function (error, results, fields) {
              if (error) {
                  console.log(error);
                  
                resultsNotFound["errorMessage"] = "something is wrong";
                return res.send(resultsNotFound);
              } else return res.send(resultsFound);
          });
              // When done with the connection, release it.
              connection.release(); // Handle error after the release.
              if (err) throw error; // Don't use the connection here, it has been returned to the pool.
  
          });
        
      },

      most_listened: function (req, res) {
        pool.getConnection(function (err, connection) {
          if (err) throw err; // not connected!

            console.log('entered');
            
            var sql = 'SELECT * FROM audio ORDER BY listens DESC';
            // Use the connection
            connection.query(sql, function (error, results, fields) {
              if (error) {
                resultsNotFound["errorMessage"] = "Something went wrong with Server.";
                return res.send(resultsNotFound);
              }
              if (results =="") {
                resultsNotFound["errorMessage"] = "Songs not found";
                return res.send(resultsNotFound);
              }
              
              // console.log(results);
              resultsFound["data"] = results;
              return res.send(resultsFound);
            });
              
            
              connection.release(); // Handle error after the release.
                if (err) throw error; // Don't use the connection here, it has been returned to the pool.
              
          });
      },

      search: function (req, res) {
        pool.getConnection(function (err, connection) {
          if (err) throw err; // not connected!

            console.log('entered');

            var values = req.body[0].search;
            console.log(values);
            
            
            var sql = 'SELECT * FROM audio WHERE title LIKE ? OR album LIKE ? OR artist LIKE ?';
            // Use the connection
            connection.query(sql, ['%'+values+'%','%'+values+'%','%'+values+'%'],function (error, results, fields) {
              if (error) {
                resultsNotFound["errorMessage"] = "Something went wrong with Server.";
                return res.send(resultsNotFound);
              }
              if (results =="") {
                resultsNotFound["errorMessage"] = "Songs not found";
                return res.send(resultsNotFound);
              }
              
              console.log(results);
              resultsFound["data"] = results;
              return res.send(resultsFound);
            });
              
                  // When done with the connection, release it.
              connection.release(); // Handle error after the release.
                if (err) throw error; // Don't use the connection here, it has been returned to the pool.
              
          });
      },
      recently_added: function (req, res) {
        pool.getConnection(function (err, connection) {
          if (err) throw err; // not connected!

            // console.log('entered');
            
            var sql = 'SELECT * FROM audio ORDER BY uploaddate DESC';
            // Use the connection
            connection.query(sql, function (error, results, fields) {
              if (error) {
                resultsNotFound["errorMessage"] = "Something went wrong with Server.";
                return res.send(resultsNotFound);
              }
              if (results =="") {
                resultsNotFound["errorMessage"] = "Songs not found";
                return res.send(resultsNotFound);
              }
              
              // console.log(results);
              resultsFound["data"] = results;
              return res.send(resultsFound);
            });
              
                  // When done with the connection, release it.
              connection.release(); // Handle error after the release.
                if (err) throw error; // Don't use the connection here, it has been returned to the pool.
              
          });
      },
      addtoPlaylist: function (req, res) {
        pool.getConnection(function (err, connection) {
          if (err) throw err; // not connected!
    
            var sql = 'INSERT INTO playlist SET ?';
            
            var values = {'link': req.body.link, 'name': req.body.userName};
            // Use the connection
            connection.query(sql, values, function (error, results, fields) {
              if (error) {
                  console.log(error);
                  
                resultsNotFound["errorMessage"] = "Song already exist on the playlist";
                return res.send(resultsNotFound);
              } else return res.send(resultsFound);
          });
              // When done with the connection, release it.
              connection.release(); // Handle error after the release.
              if (err) throw error; // Don't use the connection here, it has been returned to the pool.
  
          });
        
      },
      playlist: function (req, res) {
        pool.getConnection(function (err, connection) {
          if (err) throw err; // not connected!
    
            var sql = 'SELECT * FROM playlist JOIN audio ON playlist.link = audio.link WHERE playlist.name = ? ';
            
            var values = req.body[0].userName;
            console.log(values);
            
            // Use the connection
            connection.query(sql, values,function (error, results, fields) {
              if (error) {
                resultsNotFound["errorMessage"] = "Something went wrong with Server.";
                return res.send(resultsNotFound);
              }
              if (results =="") {
                resultsNotFound["errorMessage"] = "Songs not found";
                return res.send(resultsNotFound);
              }
              
              // console.log(results);
              resultsFound["data"] = results;
              return res.send(resultsFound);
            });
              
                  // When done with the connection, release it.
              connection.release(); // Handle error after the release.
                if (err) throw error;
          });
        
      },

      increaseListens: function (req, res) {
        pool.getConnection(function (err, connection) {
          if (err) throw err; // not connected!

            console.log(req.body);

            var value = req.body.link;
            console.log(value);
            
            // var sql = 'SELECT * FROM audio WHERE link = ?';
            var sql = 'UPDATE audio SET listens = listens + 1 WHERE link = ?'
            // var value = req.body.link;
            // console.log(value);
            

            connection.query(sql, [value], function (error, results, fields) {
              if (error) {
                resultsNotFound["errorMessage"] = "Something went wrong with Server.";
                return res.send(resultsNotFound);
              }
              if (results =="") {
                resultsNotFound["errorMessage"] = "Songs not found";
                return res.send(resultsNotFound);
              }
              
              console.log(results);

              // Use the connection
              

              resultsFound["data"] = results;
              return res.send(resultsFound);

            }); 
                  
              connection.release(); // Handle error after the release.
                if (err) throw error; // Don't use the connection here, it has been returned to the pool.
              
          });
      }

}
