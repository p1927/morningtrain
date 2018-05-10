//CSV Parser using Javascript
//Author: Pratyush Mishra
/*Note: CSV parser based on Regex. Considering the following rules
A double quoted string. (may contain unescaped single quotes.)
A single quoted string. (may contain unescaped double quotes.)
A non-quoted string. (may NOT contain quotes, commas or backslashes.)
An empty value. (An all whitespace value is considered empty.)
Quoted values may contain commas.
Quoted values may contain anything, e.g. 'that's cool'.
Values containing quotes, commas, or backslashes must be quoted.
Values containing leading or trailing whitespace must be quoted.
Values which have comma,quotes shall be starting with quote and must end with quote followed by delimiter or new line

*/
(function() { //IIFE for isolated scope

	//function that requires CSV file path as argument, accepts Delimiter and Quotes as optional arguments
	module.exports.CSV_parser = function(providedPath, strDelimiter, strQuote) {
		const promise = new Promise((resolve, reject) => {
			//creating filestream for reading file line by line so heap memory is not exhausted in case of larger files 
			const fs = require('fs');
			const path = require('path');
			const filePath = providedPath || path.join(__dirname, 'demo.csv'); // if path not provided parses demo file. 
			const validfile = new RegExp("(.csv)$", "g");

			//check if path exists
			if (!fs.existsSync(filePath)) {
				reject("Invalid File path Provided");
				return promise;
			} //check if its a csv file 
			 else if (!filePath.match(validfile)) {
				reject("It is not a CSV file.");
				return promise;
			} else {


				const readline = require('readline');
				const stream = require('stream');

				const instream = fs.createReadStream(filePath);
				const outstream = new stream;
				const rl = readline.createInterface(instream, outstream);
				let parsedCSV = [];
				let row = 0;

				// While reading line by line
				rl.on('line', function(line) {

					// uncomment to view received data, takes longer if larger file.
					//console.log('Received data: ' + line);

					//Removing possibility of blanck line causing error
					if (line != '') {
						parsedCSV[row++] = CSVToArray(line, strDelimiter, strQuote);
					}

				});

				// After finished reading
				rl.on('close', function() {
					resolve(parsedCSV);
				});
			}

		});
		return promise;

	};



	//function takes string , string delimiter, and string quotes as arguments
	function CSVToArray(strData, strDelimiter, strQuote) {
		// Check to see if the delimiter is defined. If not,
		// then default to comma.
		let strMatchedValue;
		strDelimiter = (strDelimiter || ",");
		strQuote = (strQuote || "\"");


		// Create a regular expression to parse the CSV values.
		const objPattern = new RegExp(
			( //pattern example   
				// example for double quotes and comma as delimiter

				//(\,(?=\s*)|\r?\n|\r|^)(?:"([^"]*(?:"(?![,\n])[^"]*)*)(?:"(?=[,|\n|\r]))|([^\,\r\n]*))
				//worked out on https://regex101.com/

				// Delimiters.  pattern starting with strDelimiter, newline, carrige return, or start of line
				"(\\" + strDelimiter + "(?=\\s*)|\r?\n|\r|^)" +

				// Quoted fields. 2nd group starts with quote (non-capturing group) followed by anything with/without quote 
				//but not immediately followed by delimiter 
				//and then this is followed by quote immediately followed by delimiter
				//example [ "abcd"efgh", ] inside quote is preserved, and quote followed by delimiter (non-capturing group)
				// is considered the end of value.

				"(?:\\" + strQuote + "([^\\" + strQuote + "]*(?:\\" +
				strQuote + "(?![\\" + strDelimiter + "\n])[^\\" + strQuote + "]*)*)(?:\\" + strQuote + "(?=[\\" +
				strDelimiter + "|\n|\r]))|" +
				// Standard fields. those that do not start with quote 3rd group
				"([^\\" + strDelimiter + "\r\n]*))"

			),
			"gi" //global match and case-insensitive
		);


		// Create an array to hold our data. Give the array
		// a default empty first row.
		let arrData = [];

		// Create an array to hold our individual pattern
		// matching groups.
		let arrMatches = null;


		// Keep looping over the regular expression matches
		// until we can no longer find a match.
		while (arrMatches = objPattern.exec(strData)) {

			//fix for lines starting with no value. i.e starting with delimiter
			if (!arrMatches.index && arrMatches[0].charAt(0) === strDelimiter) {
				arrData.push('');
			}
			// Now that we have our delimiter out of the way,
			// let's check to see which kind of value we
			// captured (quoted or unquoted).
			if (arrMatches[2]) {

				// We found a quoted value. When we capture
				// this value, unescape any double quotes.

				strMatchedValue = arrMatches[2].replace(
					new RegExp("\"\"", "g"),
					"\""
				);



			} else {

				// We found a non-quoted value.

				strMatchedValue = arrMatches[3];

			}


			// Now that we have our value string, let's add
			// it to the data array.
			if (strMatchedValue) {
				strMatchedValue = strMatchedValue.trim();
			}
			arrData.push(strMatchedValue);
		}

		// Return the parsed data.

		return (arrData);
	}

})(); //IIFE ended