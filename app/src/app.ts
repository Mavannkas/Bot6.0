import express = require('express');
const app = express();

app.get('/', function (req, res) {
	res.send({
		Output: 'Hello World!',
	});
});

app.post('/', function (req, res) {
	res.send({
		z: 'Hello World!',
	});
});

// Export your Express configuration so that it can be consumed by the Lambda handler
export default app;
