const Product = require("../models/Products");

const productController = {
  async addProduct(req, res) {
    const { name, description, price, quantity, category,salePrice, images} = req.body;
    //console.log(name,price);
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      quantity,
      images,
      createdAt: Date.now(),
      salePrice,
    });
    console.log(newProduct);
    await newProduct.save();
    res.send("New product added to products collection");
  },
  async removeProduct(req, res) {
    const productId = req.params.id;

    try {
      const removedProduct = await Product.findOneAndDelete(productId);

      if (!removedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product removed successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  async unLiveProduct(req, res) {
    const productId = req.params.id;
    try {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: productId },
        { isLive: false },
        { new: true }
      );
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({
        message: "Product is no longer live",
        product: updatedProduct,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  async getProducts(req,res){
    const allProducts = await Product.find();
    res.send(allProducts);
  },
  async editProduct(req, res) {
    console.log("editing products");
    const productId = req.params.id;
  
    const {
      name,
      description,
      price,
      salePrice,
      images,
      winner
      // other attributes based on the schema
    } = req.body;
  
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          $set: {
            name,
            description,
            price,
            salePrice,
            winner,
            images
            // update other attributes similarly
          },
        },
        { new: true }
      );
  
      if (!updatedProduct) {
        return res.status(404).send("Product not found");
      }
  
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).send("Error editing product");
    }
  },
  
};

module.exports = productController;
