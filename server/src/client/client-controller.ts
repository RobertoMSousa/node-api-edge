
import express = require('express');
import path = require('path');
import fs = require('fs');
import edge = require('edge');


const app = require('../application');



const createClientEdge = edge.func(function () {/*
	async (input) => {
		return ".NET Welcomes " + input.ToString();
	}
*/});


export function createNewClient(req: express.Request, res: express.Response): void {
	createClientEdge(null, function (error, result) {
		if (error) {
			res.status(500).send('Error executing the createClientEdge function');
			return;
		};
		console.log('result-->', result);//roberto
		res.status(200).send('New client added');
		return;
	});
}
