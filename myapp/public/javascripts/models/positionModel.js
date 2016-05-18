/**
 * Created by matthewyun on 4/30/16.
 */
var app = app || {};

app.positionModel = Backbone.Model.extend({
    defaults: {
        Name: '',
        Symbol:'',
        LastPrice:'',
        MarketCap:'',
        Outlook:'',
        Impact:'',
        CurrentDate:'',
        Date: '',
        PriceAtTarget:'',
        Notes: ''
    }

});
