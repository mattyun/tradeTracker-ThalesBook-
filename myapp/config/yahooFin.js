/**
 * Created by matthewyun on 5/11/16.
 */
//var $ = require('jQuery');
var http = require('http');
module.exports = {
    'getStock': function (opts, type, complete) {
        var defs = {
            desc: false,
            baseURL: 'http://query.yahooapis.com/v1/public/yql?q=',
            query: {
                quotes: 'select * from yahoo.finance.quotes where symbol = "{stock}" | sort(field="{sortBy}", descending="{desc}")',
                historicaldata: 'select * from yahoo.finance.historicaldata where symbol = "{stock}" and startDate = "{startDate}" and endDate = "{endDate}"'
            },
            suffixURL: {
                quotes: '&env=store://datatables.org/alltableswithkeys&format=json&callback=?',
                historicaldata: '&env=store://datatables.org/alltableswithkeys&format=json&callback=?'
            }
        };

        opts = opts || {};

        if (!opts.stock) {
            complete('No stock defined');
            return;
        }

        var query = defs.query[type]
            .replace('{stock}', opts.stock)
            .replace('{sortBy}', defs.sortBy)
            .replace('{desc}', defs.desc)
            .replace('{startDate}', opts.startDate)
            .replace('{endDate}', opts.endDate);

        var url = defs.baseURL + query + (defs.suffixURL[type] || '');

//        $.getJSON(url, function (data) {
//            var err = null;
//            if (!data || !data.query) {
//                err = true;
//            }
//            complete(err, !err && data.query.results);
//        });


        var options = {
            host: url
        };

        function callback (data) {
            var err = null;
            if (!data || !data.query) {
                err = true;
            }
            complete(err, !err && data.query.results);
        }

        http.request(options, callback).end();

    }

};