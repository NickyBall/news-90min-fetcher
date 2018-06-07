var mongoose = require('mongoose');
var NewsSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    }
});

var News = mongoose.model('News', NewsSchema);
module.exports = News;