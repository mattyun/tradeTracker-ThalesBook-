/**
 * Created by matthewyun on 4/28/16.
 */
var app = app || {};


app.portfolioView = Backbone.View.extend({

    el: $('#portfolio'),

    initialize: function() {
        this.collectionPrt = new app.positionCollection();
        this.collectionPrt.fetch({reset:true});

//        this.listenTo(this.collectionPrt, 'add', this.renderHolding());
        this.listenTo(this.collectionPrt, 'reset', this.renderHolding());


    },

    events: {
        'click button': 'deletePosition'

    },



    renderHolding: function(){
//Change this to collection.fetch when you can figure
//out why it's not working...

        console.log('renderHolding running');
        this.$el.empty();

        var that = this;
        $.get('/api/position').done(function(response){
            response.forEach(function(position){
                $.ajax({ // Get current price
                    type: 'GET',
                    crossDomain: true,
                    dataType: 'jsonp',
                    data: { symbol: position.Symbol},
                    url: 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp'
                }).done(function(res){

                    position.CurrentPrice = res.LastPrice;
                    position.TargetPrice = that.targetGen(position);
                    position.Date = $.format.date(position.Date,'MM/dd/yyyy');//date format
                    position.CurrentDate = $.format.date(position.CurrentDate,'MM/dd/yyyy');
                    position.Impact = position.Impact ||'N/A';
                    position.PriceAtTarget = position.PriceAtTarget || 'N/A';
                    position.Result = that.resultGen(position);

                    that.renderPortfolio(position);
                });
            });
        });
    },

    renderPortfolio: function(positionModel) {

        var holdingView = new app.holdingView({
            model: positionModel
        });
        this.$el.append(holdingView.render().el);

        this.resultGen(positionModel);

    },

    //Determine Target Price based on impact value and outlook
    targetGen: function(position){
        var impact = (Math.abs(position.Impact)/100);
        if (position.Outlook === 'Bull'){
            var target = position.LastPrice * (1 + impact);
            return Math.round(target*100)/100; //scaling technique for rounding
        } else {
            var target = position.LastPrice * (1 - impact);
            return Math.round(target*100)/100;
        }
    },
    //Determine result if past target date
    resultGen: function(position){
        var priceBought = position.LastPrice;
        var priceAtTarget = position.PriceAtTarget;
        var impact = (Math.abs(position.Impact)/100);
        var outlook = position.Outlook;
        var currentDate = $.format.date(new Date(),'MM/dd/yyyy');
        var targetDate = position.Date;

        if (currentDate >= targetDate) {
            //need to use Interactive API to find price on specific date...

            if (isNaN(impact)) {

                if (outlook === 'Bull') {
                    if (priceAtTarget > priceBought) {
                        return 'correct';
                    } else {
                        return 'incorrect';
                    }

                } else if (outlook === 'Bear') {
                    if (priceAtTarget < priceBought) {
                        return 'correct';
                    } else {
                        return 'incorrect';
                    }
                }
            } else {
                if (outlook === 'Bull') {
                    if (priceAtTarget > priceBought * (1 + impact)) {
                        return 'correct';
                    } else {
                        return 'incorrect';
                    }

                } else if (outlook === 'Bear') {
                    if (priceAtTarget < priceBought * (1 - impact)) {
                        return 'correct';
                    } else {
                        return 'incorrect';
                    }
                }
            }
        }

    },

    deletePosition: function(e){
        e.preventDefault();

        // Pop up a confirmation dialog
        var confirmation = confirm('Are you sure you want to delete this position?');

        // Check and make sure the user confirmed
        if (confirmation === true) {
            var that = this;

            // If user confirms, go ahead with delete

            //get ID of clicked button
            var clickedEl = $(e.currentTarget);
            var id = clickedEl.attr("id");
            console.log(id);

            $.ajax({
                type: 'DELETE',
                url: '/api/position/' + id
            }).done(function( response ) {
                // Check for a successful (blank) response
                if (response.msg === '') {
                }
                else {
                    console.log('Error: ' + response.msg);
                }

                //hide deleted row (re-rendering doesn't always work)
                var parent = $(clickedEl).parents('table');
                $(parent).addClass('hide');

            });
        } else {
            // If user does not confirm, do nothing
            return false;
        }
    }

});
