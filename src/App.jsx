import React, { Component } from "react";
import "./App.css";

//Components
import Product from "./Components/Product/product";
import WishList from "./Components/wishlist/wishlist";

//Services
import HttpService from "./Services/http-service";
const http = new HttpService();

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { products: [] };

    //Bind Function
    this.loadData = this.loadData.bind(this);
    this.productList = this.productList.bind(this);
    //this.loadData(); //calling function
  }

  componentDidMount() {
    this.loadData(); // Move the function call here
  }

  loadData = () => {
    //just to reference the product array
    //bcoz if we use this directly then
    //bcoz of asynchronous we won't be able to access product array
    //if we enter into promise
    var self = this;

    //when http.getProducts runs, it gives promise, if we have successful promise then daa function runs else err function runs
    http.getProducts().then(
      (data) => {
        // console.log(products);
        self.setState({ products: data }); //everytime setstate is called every component gets reload
      },
      (err) => { }
    );
  };

  productList = () => {
    const list = this.state.products.map((product) => (
      <div className="col-sm-4" key={product._id}>
        <Product
          product={product}
        />
      </div>
    ));
    return list;
  };

  render() {
    return (
      <>
        <div className="App">
          <div className="App-header">
            <h2>Welcome to Swag-Shop</h2>
          </div>
          <div className="container-fluid App-main">
            <div className="row">
              <div className="col-sm-8">
                <div className="row">
                  {this.productList()}
                </div>
              </div>
              <div className="col-sm-4">
                <WishList />
              </div>
            </div>
          </div>
        </div>

        {/* <Product
              className="col-sm-4"
              title="Cool Gun"
              price="22.4"
              imgUrl="https://www.jiomart.com/images/product/600x600/490908276/anmol-toys-multicolour-plastic-fish-water-gun-small-no-77-product-images-o490908276-p591103322-1-202302151454.jpg"
            />
            <Product
              className="col-sm-4"
              title="Cool Gun"
              price="22.4"
              imgUrl="https://www.jiomart.com/images/product/600x600/490908276/anmol-toys-multicolour-plastic-fish-water-gun-small-no-77-product-images-o490908276-p591103322-1-202302151454.jpg"
            />
            <Product
              className="col-sm-4"
              title="Cool Gun"
              price="22.4"
              imgUrl="https://www.jiomart.com/images/product/600x600/490908276/anmol-toys-multicolour-plastic-fish-water-gun-small-no-77-product-images-o490908276-p591103322-1-202302151454.jpg"
            /> */}
      </>
    );
  }
}

export default App;
