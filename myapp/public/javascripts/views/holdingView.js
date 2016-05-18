/**
 * Created by matthewyun on 5/2/16.
 */
var app = app || {};

app.holdingView = Backbone.View.extend({
//    el: $('#testQuestions'),
    tagName: 'div',
    className: 'prtContainer',
    template: $('#portfolioTemplate').html(),

    initialize: function(){

    },

    events: {
        // should clicking next button go here?
    },

    render: function () {

        var tmpl = _.template(this.template);

        this.$el.html(tmpl(this.model));

        return this;

    }

});