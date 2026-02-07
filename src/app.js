const express = require('express');
const healthRouter = require('./routes/health');
const apiRouter = require('./routes/api');

const app = express();

app.use(express.json());
app.use('/health', healthRouter);
app.use('/api', apiRouter);

module.exports = app;
