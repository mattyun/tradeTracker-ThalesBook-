/**
 * Created by matthewyun on 4/25/16.
 */
var app = app || {};

app.mainView = Backbone.View.extend({

    el: $('#getQuote'),

    initialize: function() {

        this.collection = new app.positionCollection();

        //fire enter event on button press
        $('input').keyup(function(e){
            if(e.keyCode == 13){
                $(this).trigger('enter');
            }
        });

//        this.collection = new app.quotesCollection();
//        this.collection.fetch({reset:true});


//        this.listenTo(this.collection, 'add', this.renderQuote);
//        this.listenTo(this.collection, 'reset', this.render );
    },

    events: {
        'click #btnGetQuote': 'quoteRender',
        'enter #Stock': 'quoteRender',
        'click #date': 'calendarGen',
        'click #saveStock': 'saveStock'

    },

    saveStock: function(e){
        e.preventDefault();

        // *** INPUT VERIFICATION
        // check for empty fields. Populate with red error message
        var errors = 0;
        var newPosition = {};

        //
        $('#stockTable td').find('.details').each(function(i, el) {
            newPosition[el.id] = $(el).html();
        });

        $('#stockTable td').find('.input').each(function(i, el) {
            if ($(el).hasClass('outlook')){
                if (el.checked){
                    newPosition['outlook'] = el.id;
                }
            }

            if ($(el).hasClass('otherData')){
                newPosition[el.id] = $(el).val() ;
            } else if ($(el).hasClass('numberData')){
                newPosition[el.id] = Number($(el).val());
//                newPosition[el.id] = $(el).val();
            }
        });

        //Validation

        if(! newPosition.outlook){
            alert('Please select outlook');
        } else if (! newPosition.date){
            alert('Please select date');
        } else if (! newPosition.notes){
            alert('Please fill out notes');
        } else if (newPosition.impact != "" && isNaN(newPosition.impact)){
                alert('Impact must be a Number!');
        } else{

        // Save to database
//            this.collection.create(newPosition);

            $.post('/api/position',
                {
                    Name: newPosition.name,
                    Symbol: newPosition.symbol,
                    LastPrice: newPosition.price,
                    Outlook: newPosition.outlook,
                    Impact: newPosition.impact || "",
                    CurrentDate: Date(),
                    Date: newPosition.date,
                    Notes: newPosition.notes
                }).done(function(response) {
                    //redirect to portfolio after save
                    window.location.replace('/portfolio');
            });
        }

    },


    quoteRender: function(e){
        e.preventDefault();

        console.log('quote render running');

        this.$('.quoteContainer').empty(); //clear existing quote

        var ticker = $('#Stock').val();

        var that = this;
        $.ajax({
            type: 'GET',
            crossDomain: true,
            dataType: 'jsonp',
            data: { symbol: ticker},
            url: 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp'

        }).done(function(response) {
            console.log(response);
            that.renderQuote(response);
        });


    },


    renderQuote: function(symbolModel) {
        console.log(symbolModel);

        var quoteView = new app.quoteView({
            model: symbolModel
        });

        this.$el.append(quoteView.render().el);

        this.calendarGen();

    },

    calendarGen: function(){
        $( "#date" ).datepicker();

    }

});
