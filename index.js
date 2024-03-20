// init project
require('dotenv').config();
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/:date?", (req, res) => {
  var { date } = req.params;
  
  if (date === undefined) {
    date = Date.now();
  }

  const isUnixTime = /^[0-9]+$/.test(date);
  let unixTime;
  let formattedDateString;
  const formatTime = (time) => {
    return Number(time) < 10
      ? "0" + time
      : time
  };

  const getUnixTime = (date) => {
    return Math.floor(new Date(date).getTime());
  };

  const getFormattedDateString = (dateObj) => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthsOfYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${daysOfWeek[dateObj.getDay()]}, ${formatTime(dateObj.getDate())} ${monthsOfYear[dateObj.getMonth()]} ${dateObj.getUTCFullYear()} ${formatTime(dateObj.getHours())}:${formatTime(dateObj.getMinutes())}:${formatTime(dateObj.getSeconds())} GMT`;
  };

  if (!isUnixTime) {
    unixTime = getUnixTime(date);
    if (new Date(unixTime) != "Invalid Date") {
      formattedDateString = getFormattedDateString(new Date(unixTime));
    }
  } else {
    unixTime = date;
    dateObj = new Date(parseInt(date));
    if (dateObj !== null) {
      formattedDateString = getFormattedDateString(dateObj);
    }
  }

  if (isNaN(unixTime)) {
    res.send({error: "Invalid Date"});
  } else {
    res.send({unix: parseInt(unixTime), utc: formattedDateString});
  }
});

// Listen on port set in environment variable or default to 3000
console.log(process.env.PORT);
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
