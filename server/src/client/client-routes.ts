
import express = require('express');
import ClientController = require('./client-controller');


export module Routes {
	export function client(): express.Router {
		var router = express.Router();

		router.route('/')
			.post(ClientController.createNewClient);

		return router;
	}
}
