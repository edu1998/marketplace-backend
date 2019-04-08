const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
require ('./config/environment');

const app = express();

app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/router'));

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Listening port ${PORT}`);
})