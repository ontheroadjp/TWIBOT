var express = require('express');
var app = express();

var options = {
    key: process.env.TWIBOT_API_KEY,
    secret: process.env.TWIBOT_API_KEY_SECRET,
    token: process.env.TWIBOT_ACCESS_TOKEN,
    token_secret: process.env.TWIBOT_ACCESS_TOKEN_SECRET
};
app.set('options', options);

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send('This is Twitter-bot application.')
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});

module.exports = app;
