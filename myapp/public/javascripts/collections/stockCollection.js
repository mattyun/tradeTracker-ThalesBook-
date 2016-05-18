/**
 * Created by matthewyun on 4/25/16.
 */

var app = app || {};

app.stockCollection = Backbone.Collection.extend({
   initialize: function(models, options){
       this.id = options.id;
       console.log('id equals ' + this.id);

   },
   url: function(){
       return 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=' + this.id;
   },
   model: app.stockModel


});