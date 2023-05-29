//These lines import the Express framework and create an Express application instance called app.
var express = require ('express');
var app = express ();

//This line imports the body-parser middleware, which is used to parse the request body.
var bodyParser = require ('body-parser');

//This line imports the Mongoose library, which provides an interface for interacting with MongoDB.
var mongoose = require ('mongoose');

//This line establishes a connection to the MongoDB database named swag-shop running locally on your machine. The connection is stored in the db variable.
var db = mongoose.connect ('mongodb://localhost/swag-shop-api');

//These lines import the Product and WishList models from the respective files. These models define the structure and behavior of the data that will be stored in MongoDB.
var Product = require ('./models/product');
var WishList = require ('./models/wishlist');
const product = require ('./models/product');

//These lines configure the Express application to use the body-parser middleware.
//bodyParser.json() parses incoming requests with JSON payloads,
//while bodyParser.urlencoded({extended:false}) parses requests with URL-encoded payloads.
app.use (bodyParser.json ());
app.use (bodyParser.urlencoded ({extended: false}));

// Assuming you have Express.js as the server framework
app.use ((req, res, next) => {
  res.setHeader ('Access-Control-Allow-Origin', 'http://localhost:3000');
  next ();
});

//Posting products tot the mongodb
app.post ('/product', function (req, res) {
  var product = new Product ();

  //These lines create a new instance of the Product model and assign values to its title and price properties.
  //The values are obtained from the request body using req.body.
  product.title = req.body.title;
  product.price = req.body.price;

  //In earlier version mongo used to allow callback functions for save method but in latest version it return promises
  // product.save(function(err, savedProduct){//to make it save in our mongo db
  //     if(err){
  //         res.status(500).send({error: "Could not save product"});
  //     }else{
  //         res.send(savedProduct);//return savedproduct from mongodb to user
  //     }
  // })

  //updated version return promises hence the updated code
  //These lines save the product to the MongoDB database using the save() method, which returns a promise.
  //If the saving is successful, the saved product is sent as a response.
  //If an error occurs during saving, a 500 status code and an error message are sent as the response.
  product
    .save ()
    .then (savedProduct => {
      res.send (savedProduct);
    })
    .catch (err => {
      res.status (500).send ({error: 'Could not save product'});
    });
});

//Fetching products from Database ans sending it to the client/user
app.get ('/product', function (req, res) {
  //Older version of MOngodDB
  // Product.find({}, function(err, products){//these functions are aynchronous
  //     if(err){
  //         res.status(500).send({error:"Could not fetch products"});
  //     }else{
  //         res.send(products);
  //     }
  // });

  //Latest version of mongodb return promises
  product
    .find ()
    .then (products => {
      res.send (products);
    })
    .catch (err => {
      res.status (500).send ({error: 'Could not fetch products'});
    });
});

//Posting wishlist to mongodb

app.post ('/wishlist', function (req, res) {
  var wishList = new WishList ();
  wishList.title = req.body.title;

  wishList
    .save ()
    .then (newWishList => {
      res.send (newWishList);
    })
    .catch (err => {
      res.status (500).send ({error: 'Could not create wishlist'});
    });
});

//getting wishlist from mongodb
app.get ('/wishlist', function (req, res) {
  //stores id in wishlist
  // WishList.find()
  //     .then(wishLists=>{
  //         res.send(wishLists);
  //     })
  //     .catch(err=>{
  //         res.status(500).send({error:"Could not fetch wishLists"});
  //     });

  //but client needs data not id to display so we need to populate the data
  WishList.find ({})
    .populate ({path: 'products', model: 'Product'})
    .exec ()
    .then (wishLists => {
      res.status (200).send (wishLists);
    })
    .catch (error => {
      res.status (500).send ({error: 'Could not fetch wishLists'});
    });
});

//creating endpoint to insert products in wishlist

app.put ('/wishlist/product/add', function (req, res) {
  // Product.findOne({_id:req.body.productId}, function(err, product){
  //     if(err){
  //         res.status(500).send({error:"Could not add product to wishlist"});
  //     }else{
  //         WishList.updateOne({_id:req.body.wishListId}, {$addToSet:{products:product._id}}, function(err, wishList){
  //             if(err){
  //                 res.status(500).send({error:"Could not add product to wishlist"});
  //             }else{
  //                 res.send(wishList);
  //             }
  //         });
  //     }
  // })

  /*
        The findOne() method returns a Query object, which can be executed with the exec() method to get a promise.
        We chain .exec() after findOne() to get the promise for the product.
        If a product is found, we continue the promise chain by calling updateOne() on the WishList model to update the wishlist.
        We chain .exec() again after updateOne() to get the promise for the updated wishlist.
        Finally, we handle the resolved promise by sending the updated wishlist as the response, and any errors are caught and handled by sending a 500 response.
        By using promises, you can handle the asynchronous operations in a more readable and manageable way.
    */

  Product.findOne ({_id: req.body.productId})
    .exec ()
    .then (product => {
      if (!product) {
        return res.status (500).send ({error: 'Product not found'});
      }
      return WishList.updateOne (
        {_id: req.body.wishListId},
        {$addToSet: {products: product._id}}
      ).exec ();
    })
    .then (updatedWishList => {
      res.send ('Successfully added to wishlist');
    })
    .catch (error => {
      res.status (500).send ({error: 'Could not add product to wishlist'});
    });
});

//This starts the Express application and makes it listen on port 3000.
//The callback function is executed when the server starts,
//and it logs a message to the console indicating that the server is running.
app.listen (3002, function () {
  console.log ('Swag Shop API Project is running at port 3002....');
});
