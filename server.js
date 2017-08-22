var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var app = express();

app.get('/airbnb', function(req, res){

  url = 'https://www.airbnb.co.uk/rooms/14531512?s=51';

  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);

      var name;
      var json = { name : "" };

      $('#listing_name').each(function(){
        var data = $(this);
        name = data.eq(0).text();

        json.name = name;
      })
    }

    fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
      console.log('Success!');
    })

    res.send('Should be done.')

  })





})



app.listen('3000')
console.log('Listening on port 3000');
module.exports = app;




