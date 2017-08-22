var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var app = express();

app.get('/airbnb', function(req, res){

  url = 'https://www.airbnb.co.uk/rooms/14531512?s=51';
  url2 = 'https://www.airbnb.co.uk/rooms/19278160?s=51';
  url3 = 'https://www.airbnb.co.uk/rooms/19292873?s=51';

  urls = [url, url2, url3];

  //I wanted to loop through the array of URLs and make a request for each one.

  request({
          'url': url, 
          headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
          }
        }, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);

      var name, type, bedrooms, bathrooms, amenities;
      var json = { name : "", type : "", bedrooms : "", bathrooms : "", amenities : "" };

      $('#listing_name').each(function(){
        var name_data = $(this);
        name = name_data.eq(0).text();
        json.name = name;
      })

      $('.link-reset').each(function(){
        var type_data = $(this);
        var type = type_data.eq(0).text();

        if(type.indexOf("Property type:") > -1){
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
        else if(rooms.indexOf("Bathrooms:") > -1) {
          bathrooms = rooms.split(":")[1].trim();
          json.bathrooms = bathrooms
        }
      })

      $('.amenities').each(function(){
        var amenities_data = $(this);
        var amenities = amenities_data.eq(0).text();
        json.amenities = amenities;
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




