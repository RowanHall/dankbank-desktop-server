const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: 'YOUR PASSPHRASE HERE'
}, app).listen(443)