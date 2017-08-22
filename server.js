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

      var name, type, bedrooms, bathrooms;
      var json = { name : "", type : "", bedrooms : "", bathrooms : "" };

      $('#listing_name').each(function(){
        var name_data = $(this);
        name = name_data.eq(0).text();

        json.name = name;
      })

      $('.link-reset').each(function(){
        var type_data = $(this);

        var type = type_data.eq(0).text();

        if(type.indexOf("Property type:") > -1) {
          type = type.split(":")[1].trim();
          json.type = type;
        }
        
      })

      $('.bottom-spacing-2').each(function(){
        var rooms_data = $(this);

        var rooms = rooms_data.eq(0).text();

        if(rooms.indexOf("Bedrooms:") > -1) {
          bedrooms = rooms.split(":")[1].trim();
          json.bedrooms = bedrooms
        }

        if(rooms.indexOf("Bathrooms:") > -1) {
          bathrooms = rooms.split(":")[1].trim();
          json.bathrooms = bathrooms
        }
      
      })

    }else {
      console.log(error);
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




