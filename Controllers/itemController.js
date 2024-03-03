import { Item } from "../Models/item.js";
import { User } from "../Models/user.js";
import cloudinary from "cloudinary";
import getDataUri from "../Utils/dataUri.js";
import { checkout } from "../Utils/payment.js";

export const createItem = async (req, res) => {
  try {
    const { item_name, overview, price } = req.body;

    const file = req.file;
    let myCloud;
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          message: "Maximum file size is 10 MB.",
        });
      }

      const fileUri = getDataUri(file);
      myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
        folder: "products_images",
      });
    }

    const item = await Item.create({
      item_name,
      description: {
        overview,
        price,
      },
      owner: req.user,
      image: {
        public_url: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });
    const user = await User.findById(req.user);
    user.products.push(item._id);
    user.save();
    res.status(201).json({
      success: true,
      message: "Product added",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const payment = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(400).json({
        success: false,
        message: "Product not found",
      });
    }

    const price = item.description.price;

    const order = await checkout(price);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const paymentVerification = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Go back",
  });
};

export const getAllItem = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const editItem = async (req, res) => {
  try {
    const { item_name, overview, price } = req.body;
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(400).json({
        success: false,
        message: "Product not found",
      });
    }

    item.item_name = item_name;
    item.description = {
      overview,
      price,
    };
    await item.save();
    res.status(200).json({
      success: true,
      message: "Product updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(400).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete the item's image from cloudinary if it exists
    if (item.image && item.image.public_url) {
      await cloudinary.v2.uploader.destroy(item.image.public_url);
    }

    // Remove the item from the products array of the user
    const user = await User.findById(req.user);
    const productIndex = user.products.indexOf(req.params.id);

    if (productIndex !== -1) {
      user.products.splice(productIndex, 1);
    }

    // Remove the item from the cart of all users
    const allUsers = await User.find({});
    allUsers.forEach(async (u) => {
      if (u.cart.some((itemId) => itemId === req.params.id)) {
        const cartIndex = u.cart.indexOf(req.params.id);
        u.cart.splice(cartIndex, 1);
        await u.save();
      }
    });

    await user.save();

    // Delete the item from the database
    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(400).json({
        success: false,
        message: "Item not found",
      });
    }

    const user = await User.findById(req.user);

    const isAdded = user.cart.includes(item._id);

    if (isAdded) {
      user.cart = user.cart.filter(
        (addedItemId) => addedItemId.toString() !== item._id.toString(),
      );
    } else {
      user.cart.push(item._id);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: isAdded ? "Product removed from cart" : "Product added to cart",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
