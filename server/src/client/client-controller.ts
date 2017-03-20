
import edge = require('edge');
import express = require('express');
import path = require('path');
import fs = require('fs');


const app = require('../application');

var helloWorld = edge.func(`
	async (input) => {
		return ".NET Welcomes " + input.ToString();
	}
`);


export function createNewClient(req: express.Request, res: express.Response): void {
	helloWorld('javascript', function (error, result) {
		if (error) {
			res.status(500).send('Error executing the createClientEdge function');
			return;
		};
		console.log('result-->', result);//roberto
		res.status(200).send('New client added');
		return;
	});
}
