const csv = require('./CSV_Parser/csv_parser');
const path = require('path');
const filePath = path.join(__dirname, 'demo.csv');
let Parsed = csv.CSV_parser(filePath);
Parsed.then(function(result) { //process csv contents here
	console.log(result);
}, function(error) { 
	console.log(error);
});