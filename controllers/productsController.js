const Product = require("../models/Products");
const jwt = require("jsonwebtoken");
const { User, Transaction } = require("../models/User");

const productController = {
  async addProduct(req, res) {
    const { name, description, price, quantity, category, salePrice, images } =
      req.body;
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
  async getProducts(req, res) {
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
      winner,
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
            images,
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
  async buyProduct(req, res) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ error: "Token not provided" });
      }

      const decoded = await jwt.verify(token, "lottery-app");
      const userEmail = decoded.email;
      const user = await User.findOne({ email: userEmail });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const productId = req.params.id;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const productPrice = product.salePrice;

      if (user.wallet.balance < productPrice) {
        return res.status(400).json({ error: "Insufficient balance" });
      }
      let referringUser = user.referredBy;
      let i = 1;
      let referringRates = {
        1: 0.1,
        2: 0.07,
        3: 0.03,
      };

      while (referringUser !== null && i <= 3) {
        referringUser = await User.findOne({ referralCode: referringUser });

        if (referringUser) {
          console.log(referringUser.email);
          console.log(productPrice * referringRates[i]);

          // Calculate commission based on the current level (assuming referringRates contains different commission rates)
          const commissionAmount = productPrice * referringRates[i];

          // Add commission to the respective level's commission field
          switch (i) {
            case 1:
              referringUser.wallet.commission1 += commissionAmount;
              break;
            case 2:
              referringUser.wallet.commission2 += commissionAmount;
              break;
            case 3:
              referringUser.wallet.commission3 += commissionAmount;
              break;
            default:
              break;
          }

          referringUser.wallet.balance += commissionAmount; // Add to balance as well
          console.log(referringUser.wallet.balance);

          try {
            await referringUser.save();
          } catch (error) {
            console.error("Error saving referring user:", error);
            break;
          }

          referringUser = referringUser.referredBy;
          i++;
        } else {
          break;
        }
      }

      console.log(user.email, "orginal user");
      user.wallet.balance -= productPrice;
      await user.save();

      const transaction = new Transaction({
        amount: productPrice,
        description: product,
        username: user.name,
        email: user.email,
        type: "Product",
        isVerified: true,
        paymentMethod: "Wallet",
      });
      await transaction.save();

      user.wallet.transactions.push(transaction._id);
      await user.save();

      return res.status(200).json({ message: "Transaction successful" });
    } catch (error) {
      console.error("Error occurred:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  },
};

module.exports = productController;
