// Start server by calling 'brew services start mongodb-community'

// Required Packages
var http = require('http');
var url = require('url');
var fs = require('fs');
var app = require('express')();

// Inits Express router
let router = require('express').Router();

var bodyParser = require('body-parser');
app.use(bodyParser.json());


// let apiRoutes = require('./api-routes')
// app.use('/api', apiRoutes)

var MongoClient = require('mongodb').MongoClient;


// Server URLS
var database_url = "mongodb://localhost:27017/";
var server_url = ""
var server_port = process.env.PORT || 8082


// Collection name 
shop_list_collection = 'ebl_shop_list'


function create_collection(collection_name) {
	MongoClient.connect(database_url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("mydb");
		dbo.createCollection(collection_name, function(err, res) {
			if (err) throw err;
			console.log("Collection called " + collection_name + " created");
			db.close();
		});
	});
}

function query_all_entries(collection_name) {
	MongoClient.connect(database_url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("mydb");
		dbo.collection(collection_name).find({}).toArray(function(err, result) {
			// Error handling
			if (err) throw err;

			// Log result, close db
			console.log(result);
			db.close();

			// Return result so that it can be served
			return result;
		});
	});
}

function add_single_shop(collection_name, shop_name, street_address, city, state, zip_code, phone_number, category) {
	MongoClient.connect(database_url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("mydb");

		// Format data
		var shop = {
			shop_name: shop_name,
			street_address: street_address,
			city: city,
			state: zip_code,
			phone_number: phone_number,
			category: category
		};

		// Insert a single shop into the collection
		dbo.collection(collection_name).insertOne(shop, function(err, res) {
			if (err) throw err;
			console.log(shop_name + " has been added to the collection named " + collection_name + ".");
			db.close();
		});
	});
}


function query_single_shop(collection_name, shop_name) {
	MongoClient.connect(database_url, function(err, db) {
		// Error handling
		if (err) throw err;

		// Define Database
		var dbo = db.db("mydb");

		// Formatted Query
		var query = { 
			shop_name: shop_name 
		};

		// Qeuery via shop name
		dbo.collection(collection_name).find(query).toArray(function(err, result) {
			if (err) throw err;

			// Log result and close db
			console.log(result);

			// var results = result
			
			db.close();

			// Return results
			return result;
		});
	});
}



function server(port_number){
	http.createServer(function (req, res) {
		var q = url.parse(req.url, true);
		var filename = "." + q.pathname;
		fs.readFile(filename, function(err, data) {
			if (err) {
				res.writeHead(404, {'Content-Type': 'text/html'});
				return res.end("404 Not Found");
			} 
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(data);
			return res.end();
		});
		console.log("Serving on port " + port_number + ".")
	}).listen(port_number);
}



function server_json() {
	var spicetown = query_single_shop(shop_list_collection, "Oaktown Spice Shop");

	var test = [{status: "Good", test: "Everything's fine"}]

	// console.log("Spicetown Results" + spicetown);
	app.get('/', (request, response) => response.send({items: test}));
}
// create_collection(shop_list_collection)
// add_single_shop(
// 	shop_list_collection, "Therapy Store", 
// 	"2951 College Ave", "Berkeley", "California", 
// 	"94705", "15106659009", "retail"
// 	)

server_json()
// Run json server on server port
app.listen(server_port, () => console.log(`Simple GET app is listening on port ${server_port}!`))
// query_all_entries(shop_list_collection)
// server(port_number)










