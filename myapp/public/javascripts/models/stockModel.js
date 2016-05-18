/**
 * Created by matthewyun on 4/25/16.
 */


var app = app || {};

app.stockModel = Backbone.Model.extend({
    defaults: {
        Name:'',
        Symbol: '',
        LastPrice: '',
        MarketCap: ''
    }

});
