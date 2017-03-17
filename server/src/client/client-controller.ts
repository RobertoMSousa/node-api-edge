
import express = require('express');
import path = require('path');
import fs = require('fs');

const app = require('../application');


export function createNewClient(req: express.Request, res: express.Response): void {
	console.log('res body-->', req.body);//roberto
	res.status(200).send('New client added');
	return;
}
