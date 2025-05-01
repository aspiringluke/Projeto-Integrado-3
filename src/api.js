const express = require('express');
const api = express();
const router = require('./routes/router');
const cors = require('cors');

api.use(cors());
api.use(express.urlencoded({extended:false}));
api.use(express.json());
api.use('/', router);

module.exports = api;
