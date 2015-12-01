var express = require('express');
var http = require('http');
var app = express();

app.use(express.static('public'));

app.get('/',function(req,res){
	res.sendfile('./index.html');
});

var sevenwondersJson = [

{
	lat : "",
	longi : "",
	Place : "",
	aCode : ""
}

];

app.get('/sevenwonders/:place/date/:date',function(req,res){

	// fetch airport id from place
	//call terminal2.expedia.com/x/suggestions/regions?query=Kolkata&apikey=FnZolVXnVGTWPKrQZHwLVhycJEGapEYm

	http.get("http://terminal2.expedia.com/x/suggestions/regions?query="+req.params.place+"&apikey=FnZolVXnVGTWPKrQZHwLVhycJEGapEYm",function(response){
		console.log("response",response);
	});


	//

});

app.listen(3000);