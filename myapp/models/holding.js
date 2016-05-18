/**
 * Created by matthewyun on 5/2/16.
 */
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var holdingsSchema = mongoose.Schema({
    Name: String,
    Symbol: String,
    LastPrice: Number,
    MarketCap: Number,
    Outlook: String,
    Impact: Number,
    CurrentDate: Date,
    Date: Date,
    PriceAtTarget: Number,
    Notes: String,
    ID: String
});

module.exports = mongoose.model('Holdings', holdingsSchema);