/**
 * Created by matthewyun on 4/30/16.
 */
var app = app || {};

app.positionCollection = Backbone.Collection.extend({

    model: app.positionModel,

    url:'/api/position'


});