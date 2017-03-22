import edge = require('edge');
import express = require('express');
import path = require('path');
import fs = require('fs');


const app = require('../application');

 const createNewClientFunc = edge.func(`
	#r "dll/RTLBL16.dll"
	#r "dll/RTLSystem16.dll"
	#r "dll/RTLUtil16.dll"
	#r "dll/RTLBase16.dll"
	#r "dll/RTLDL16.dll"
	#r "dll/RTLPrint16.dll"
	using System;
	using System.Threading.Tasks;
	using System.Collections.Generic;
	using System.ComponentModel;
	using System.Drawing;
	using System.Linq;
	using System.Text;
	using System.Runtime.InteropServices;
	public class Startup
	{
		public async Task<object> Invoke(dynamic input) {
			return ".NET Welcomes " + input.ToString();
		}
	}`);


export function createNewClient(req: express.Request, res: express.Response): void {
	createNewClientFunc(req.body, function (error, result) {
		if (error) {
			res.status(500).send('Error executing the createClientEdge function');
			return;
		};
		console.log('result-->', result);//roberto
		res.status(200).send('New client added');
		return;
	});
}
