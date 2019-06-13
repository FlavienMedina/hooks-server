const { Wit, log } = require('node-wit');
const express = require('express')
const request = require('request')

const CONFIG = require('./config.js')

const PORT = process.env.PORT || 5000
const app = express();


app.use(express.json());
app.use(express.urlencoded());

const client = new Wit({
  accessToken: CONFIG.WIT_TOKEN
  // logger: new log.Logger(log.DEBUG)
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/', (req, res) => {
  client.message(req.body.question, {})
    .then((data) => {
      console.log('📍', data.entities.weather[0].value);
      console.log('📍', data.entities.location[0].value);
      if (data.entities.location) {
        let url = `https://api.openweathermap.org/data/2.5/find?q=${data.entities.location[0].value}&units=metric&appid=${CONFIG.WEATHER_API}`;
        console.log('📍', url);
        request(url, function (err, response, body) {
          if (err) {
            console.log('error:', error);
          } else {
            res.end(JSON.stringify(body));
          }
        });
      }
    })
    .catch(console.error);
})

  .listen(PORT, () => console.log(`Listening on ${PORT}`))
