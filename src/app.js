import {parseToHtml} from "./pdfNet/main";

const http = require('http');
import {parseData} from './parser';

const hostname = '127.0.0.1';
const port = 3042;

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Hello World');
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
	// parseData();
	parseToHtml()
});
