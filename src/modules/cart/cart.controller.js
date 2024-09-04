import { AppError } from "../../utils/appError.js";
import { catchError } from "../../middleware/catchError.js";
import { Cart } from "../../../database/models/cart.model.js";
import { Product } from "../../../database/models/product.model.js";
import { Coupon } from "../../../database/models/coupon.model.js";

function calctotalPrice(cart) {
  cart.totalCartPrice = cart.cartItems.reduce((total, item) => {
    console.log(`Calculating price for product: ${item.product}`);
    console.log(`Quantity: ${item.quantity}, Price: ${item.price}`);
    const itemPrice = item.quantity * item.price;
    if (isNaN(itemPrice)) {
      throw new Error(`Invalid price or quantity for product: ${item.product}`);
    }
    return total + itemPrice;
  }, 0);

  if(cart.discount) {
    cart.totalCartPriceAfterDiscount = cart.totalCartPrice - (cart.totalCartPrice * cart.discount) / 100;
  }
}

const addToCart = catchError(async (req, res, next) => {
  let isCartExist = await Cart.findOne({ user: req.user._id });

  let product = await Product.findById(req.body.product);
  if (!product) return next(new AppError("Product not found", 404));

  req.body.price = product.price;
  req.body.quantity = req.body.quantity || 1;

  console.log("Product price:", product.price);
  console.log("Product quantity:", req.body.quantity);

  if (req.body.quantity > product.stock)
    return next(new AppError("Product out of stock", 404));

  if (!isCartExist) {
    const cart = new Cart({
      user: req.user._id,
      cartItems: [req.body],
    });

    calctotalPrice(cart);
    console.log("New Cart total price:", cart.totalCartPrice);
    await cart.save();
    return res.json({ message: "success", cart });
  } else {
    let item = isCartExist.cartItems.find(
      (item) => item.product.toString() === req.body.product
    );

    if (item) {
      item.quantity += req.body.quantity;
      if (item.quantity > product.stock)
        return next(new AppError("Product out of stock", 404));
      item.price = product.price; // Ensure price is updated
    } else {
      req.body.price = product.price; // Ensure price is set
      isCartExist.cartItems.push(req.body);
    }

    calctotalPrice(isCartExist);
    console.log("Updated Cart total price:", isCartExist.totalCartPrice);
    await isCartExist.save();
    res.json({ message: "success", cart: isCartExist });
  }
});

const updateQuantity = catchError(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id });
  let item = cart.cartItems.find((item) => item.product == req.params.id);
  if (!item) return next(new AppError("Product not found in cart", 404));

  item.quantity = req.body.quantity;
  calctotalPrice(cart);
  await cart.save();
  res.json({ message: "success", cart });
});

const removeItemFromCart = catchError(async (req, res, next) => {
  let cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.id } } },
    { new: true }
  );
  calctotalPrice(cart);
  await cart.save();
  cart || next(new AppError("Cart not found", 404));
  !cart || res.json({ message: "success", cart });
});

const getLoggedUserCart = catchError(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id });
  cart || next(new AppError("Cart not found", 404));
  !cart || res.json({ message: "success", cart });
});

const clearUserCart = catchError(async (req, res, next) => {
  let cart = await Cart.findOneAndDelete({ user: req.user._id });
  cart || next(new AppError("Cart not found", 404));
  !cart || res.json({ message: "success", cart });
});

const applyCoupon = catchError(async (req, res, next) => {
  let coupon = await Coupon.findOne({ code: req.body.code, expires: { $gt: Date.now() } });
  if (!coupon) return next(new AppError("Invalid coupon", 404));
  let cart = await Cart.findOne({ user: req.user._id });
  cart.totalCartPriceAfterDiscount = cart.totalCartPrice - (cart.totalCartPrice * coupon.discount) / 100;
  cart.discount = coupon.discount;
  await cart.save();
  res.json({ message: "success", cart });
});

export { addToCart, updateQuantity, removeItemFromCart, getLoggedUserCart, clearUserCart, applyCoupon };
