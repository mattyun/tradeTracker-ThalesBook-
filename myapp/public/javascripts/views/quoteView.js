/**
 * Created by matthewyun on 4/25/16.
 */

var app = app || {};

app.quoteView = Backbone.View.extend({
//    el: $('#testQuestions'),
    tagName: 'div',
    className: 'quoteContainer',
    template: $('#quoteTemplate').html(),

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