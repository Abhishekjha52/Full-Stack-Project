var mongoose = require ('mongoose');
var Schema = mongoose.Schema; //grabbibg information i.e; schema object

var product = new Schema ({
  //creating a new object
  //define the data
  title: String,
  price: Number,
  likes: {type: Number, default: 0},
});

module.exports = mongoose.model ('Product', product);
