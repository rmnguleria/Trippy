var express = require('express');
var http = require('http');
var app = express();

app.use(express.static('public'));

app.get('/',function(req,res){
	res.sendfile('./index.html');
});

var locations = [];

var sevenwondersJson = [

	{
		// Airport Name
		// Departure Time
		// Duration
		// Kilometer
		// Price
		// Duration
		Name: "Taj Mahal",
		Place : "Agra"
	},
	{
		Name: "The Great Wall Of China",
		Place : "Beijing"
	},
	{
		Name: "Christ Redeemer",
		Place : "Rio de Janeiro"
	},
	{
		Name: "Roman Colosseum",
		Place : "Rome"
	},
	{
		Name: "Machu Picchu",
		Place : "Peru"
	},
	{
		Name: "Petra",
		Place : "Jordan"
	}

];

var apiKey = "FnZolVXnVGTWPKrQZHwLVhycJEGapEYm";

function getDistance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180;
	var radlat2 = Math.PI * lat2/180;
	var radlon1 = Math.PI * lon1/180;
	var radlon2 = Math.PI * lon2/180;
	var theta = lon1-lon2;
	var radtheta = Math.PI * theta/180;
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * 180/Math.PI;
	dist = dist * 60 * 1.1515;
	if (unit=="K") { dist = dist * 1.609344 };
	if (unit=="N") { dist = dist * 0.8684 };
	return dist;
}

var size = 0;

function getInformationForPlace(res,place){
	var regionJson = {};
	var body = '';
	http.get("http://terminal2.expedia.com/x/suggestions/regions?query="+place+"&apikey="+apiKey,function(response){
		response.on('data',function(d){
			console.log("Getting Data");
			body += d;
		});
		response.on('end',function(){
			console.log("Body Done" + body);
			size++;
			console.log("Size value" + size);
			regionJson = body;
			var arrayResult = regionJson.sr;
			console.log("I am regionJson" , regionJson.sr);
			var info = {};
			for(result in arrayResult){
				if(true){
					info.lat = result.ll.lat;
					info.lng = result.ll.lng;
					info.ac = result.a;
					break;
				}
			}


			var LocationDetail= {};
			
			LocationDetail.lat = info.lat;
			LocationDetail.lng = info.lng;
			LocationDetail.ac = info.ac;
			LocationDetail.Place = place;

			for(var i=0;i<sevenwondersJson.length;i++){
				if(sevenwondersJson[i].Place == place){
					LocationDetail.Name = sevenwondersJson[i].Name;
				}
				if(i==sevenwondersJson.length-1){
					LocationDetail.Name = "StartingLocation";
				}
			}
			locations.push(LocationDetail);
			if(size == sevenwondersJson.length+1){
				console.log(locations);
				return true;
			}else{
				getInformationForPlace(sevenwondersJson[size-1].Place);
			}
		});
	});
}


app.get('/sevenwonders/:place/date/:date',function(req,res,next){

	getInformationForPlace(res,req.params.place);
	next();

});

app.get('/sevenwonders/:place/date/:date',function(req,res,next){

	res.send(locations);

});	

app.listen(3000);