'user strict';
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const config = require('./config');

const app = express();
const router = express.Router();

//Connecta ao banco mongodb com o mongoose.
mongoose.connect(config.connectionString, { useNewUrlParser: true , useCreateIndex: true});

//Carregar os models
const Customer = require('./models/customer');

//Carregar as Rotas
const indexRoute = require('./routes/index-route');
const customerRoute = require('./routes/customer-route');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use('/', indexRoute);
app.use('/customers', customerRoute);

module.exports = app;