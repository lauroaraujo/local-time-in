const express = require('express');
const bodyParser = require('body-parser');
const { city } = require('./handler');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (_req, res) => res.json({ status: 200, message: 'Server is running.' }));
app.get('/:city', city);

const listener = app.listen(process.env.PORT || 5000, function () {
  console.log('Server is listening on port ' + listener.address().port);
});
