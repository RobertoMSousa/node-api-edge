require('source-map-support').install();

import express = require('express');
import path = require('path');
import bodyParser = require('body-parser');


import config = require('./config');
import clientRoutes = require('./client/client-routes');


export var app = <express.Express>express();

app.use(bodyParser.json());

app.use('/api/client', clientRoutes.Routes.client());
