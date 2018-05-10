//THis file uses CSV parser for parsing.

//including CSV_Parser module.
const csv = require('./CSV_Parser/csv_parser');

const path = require('path');
//Adding 500000 Sales Records.csv to path
const filePath = path.join(__dirname, '500000 Sales Records.csv');

let Parsed = csv.CSV_parser(filePath);
Parsed.then(function(result) { //process csv contents here
	console.log(result);
}, function(error) { 
	console.log(error);
});