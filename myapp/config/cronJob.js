/**
 * Created by matthewyun on 5/11/16.
 */

// load Holdings model
var Holdings = require('../models/holding');
var http = require('http');
var currentDate = new Date();
//var yahooFin = require('../config/yahooFin');
var request = require('request');

//To get variable instance of value in a string
var getPos = function(str, match, instance) {
    return str.split(match, instance).join(match).length;
};

module.exports = {
    //update TargetDatePrice for holdings whose target date has passed
    'updateTargetDatePrice': function () {
        return Holdings.find({ //find holdings with target date past current and blank PriceAtTarget
            Date: {$lt: currentDate},
            PriceAtTarget:''
        }, function (err, positions) {
            positions.forEach(function(pos){
                if (!err) {
                    request({
                        method: 'GET',
                        url: 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=' + pos.Symbol
                    }, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var jsonpData = body;
                            var json;
                            //get rid of unnecessary string data Markit returns before data object
                            var startPos = jsonpData.indexOf('({');
                            var endPos = getPos(jsonpData, '})',2);//because Markit returns '})' once before data
                            var jsonString = jsonpData.substring(startPos+1, endPos+1);
                            json = JSON.parse(jsonString);

                            pos.PriceAtTarget = json.Open;  //set PriceAtTarget with current day's Open
                            pos.save(function (err) {
                                if(err) {
                                    console.error('ERROR!');
                                }});

//                            console.log(pos);
//                            console.log(json);
//                            console.log(json.Open);
                        } else {
                            console.log(error);
                        }
                    });

                } else {
                    return console.log(err);
                }
            })
        });
    }

};






