const express = require('express');
const app = express();


const cors = require('cors');
app.use(cors({ optionSuccessStatus: 200 }))
app.use(express.static('public'));


app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/api/timestamp/:date*?", function (req, res) {
  // check wether or not the date param exists, and if it does, checks if it is a unix timestamp in milliseconds or a UTC string
  const date = req.params.date ? new Date(Number.isNaN(Number(req.params.date)) ? req.params.date : Number(req.params.date)) : new Date();
  if (date.getTime()) res.json({ "unix": date.getTime(), "utc": date.toUTCString() });
  else res.status(422).json({ "error": "Invalid Date" });
})


var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

module.exports = app;