var mongoose = require ('mongoose');
var Schema = mongoose.Schema; //grabbibg information i.e; schema object
var ObjectId = mongoose.Schema.Types.ObjectId;

var wishList = new Schema ({
  title: {type: String, default: 'Cool Wish List'},
  products: [{type: ObjectId, ref: 'Product'}], //creating and referencing relationships between mongo documents
});

module.exports = mongoose.model ('WishList', wishList);
