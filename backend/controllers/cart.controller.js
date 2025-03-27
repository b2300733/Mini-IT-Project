const User = require("../models/user.model");
const Market = require("../models/communitymarket.model");
const Shop = require("../models/shop.model");

// Get cart items for a user
const getCart = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ cart: user.cart || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const email = req.params.email;
    const cartItem = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize cart if it doesn't exist
    if (!user.cart) {
      user.cart = [];
    }

    // Add item to cart
    user.cart.push(cartItem);
    await user.save();

    res.status(200).json({ message: "Item added to cart", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update cart (replace entire cart)
const updateCart = async (req, res) => {
  try {
    const email = req.params.email;
    const { cart } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = cart;
    await user.save();

    res.status(200).json({ message: "Cart updated", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const email = req.params.email;
    const { index } = req.params;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.cart || user.cart.length <= index) {
      return res.status(400).json({ message: "Invalid cart item index" });
    }

    user.cart.splice(index, 1);
    await user.save();

    res
      .status(200)
      .json({ message: "Item removed from cart", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const email = req.params.email;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = [];
    await user.save();

    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Checkout
const checkout = async (req, res) => {
  try {
    const email = req.params.email;
    const { userDetails } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Process each item in the cart
    const failedItems = [];
    const successItems = [];
    let totalAmount = 0;

    for (const item of user.cart) {
      // Check if this is a marketplace or shop item
      if (item.productId) {
        // Community marketplace item
        const product = await Market.findById(item.productId);

        if (!product) {
          failedItems.push({
            ...item,
            reason: "Product not found",
          });
          continue;
        }

        if (product.productQuantity < item.quantity) {
          failedItems.push({
            ...item,
            reason: "Not enough quantity available",
          });
          continue;
        }

        // Update product quantity
        product.productQuantity -= item.quantity;
        if (product.productQuantity === 0) {
          await Market.findByIdAndDelete(item.productId);
        } else {
          await product.save();
        }

        // Add to successful items
        successItems.push(item);
        totalAmount += item.price;
      } else if (item.shopProductId) {
        // Shop item
        const product = await Shop.findById(item.shopProductId);

        if (!product) {
          failedItems.push({
            ...item,
            reason: "Product not found",
          });
          continue;
        }

        if (product.productQuantity < item.quantity) {
          failedItems.push({
            ...item,
            reason: "Not enough quantity available",
          });
          continue;
        }

        // Update product quantity
        product.productQuantity -= item.quantity;
        await product.save();

        // Add to successful items
        successItems.push(item);
        totalAmount += item.price;
      } else {
        // Product without ID (direct add to cart)
        failedItems.push({
          ...item,
          reason: "Product ID missing, cannot process",
        });
        continue;
      }
    }

    // Create purchase history entry
    if (successItems.length > 0) {
      user.history.push({
        items: successItems,
        totalAmount: totalAmount,
        purchaseDate: new Date(),
        status: "Completed",
        userDetails: userDetails || {
          email: user.email,
          contactNo: user.contactNo || "",
          address: userDetails?.completeAddress || "",
        },
      });

      // Update cart by keeping only failed items
      if (failedItems.length > 0) {
        user.cart = user.cart.filter(
          (item) =>
            !successItems.some(
              (successItem) =>
                (successItem.productId &&
                  successItem.productId === item.productId) ||
                (successItem.shopProductId &&
                  successItem.shopProductId === item.shopProductId)
            )
        );
      } else {
        user.cart = [];
      }

      await user.save();
    }

    res.status(200).json({
      message: "Checkout completed",
      successItems,
      failedItems,
      history: user.history[user.history.length - 1],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
  checkout,
};
