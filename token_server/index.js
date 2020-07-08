const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const { chatToken } = require('./tokens');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);

const sendTokenResponse = (token, res) => {
    res.set('Content-Type', 'application/json');
    res.send(
        JSON.stringify({
            token: token.toJwt()
        })
    );
};

app.get('/ping', (req, res) => {
    res.send('pong');
});

app.get('/chat/token', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const identity = req.query.identity;
    const token = chatToken(identity, config);
    sendTokenResponse(token, res);
});

app.post('/chat/token', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const identity = req.body.identity;
    const token = chatToken(identity, config);
    sendTokenResponse(token, res);
});

app.listen(3001, () =>
    console.log('Express server is running on localhost:3001')
);