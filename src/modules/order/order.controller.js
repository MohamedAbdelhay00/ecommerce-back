import { AppError } from "../../utils/appError.js";
import { catchError } from "../../middleware/catchError.js";
import { Cart } from "../../../database/models/cart.model.js";
import { Order } from "../../../database/models/order.model.js";
import { Product } from "../../../database/models/product.model.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const createCashOrder = catchError(async (req, res, next) => {
  let cart = await Cart.findById(req.params.id);
  if(!cart) return next(new AppError("Cart not found", 404));
  let totalOrderPrice = cart.totalCartPriceAfterDiscount || cart.totalCartPrice;
  let order = new Order({
    user: req.user._id,
    orderItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice
  })
  await order.save();
  
  let options = cart.cartItems.map(item => {
    return {
      updateOne: {
        "filter": { _id: item.product },
        "update": { $inc: { sold: item.quantity, stock: -item.quantity } }
      }
    }
  });
  await Product.bulkWrite(options);

  await Cart.findByIdAndDelete(cart._id);

  res.json({ message: "success", order });
});

const getUserOrders = catchError(async (req, res, next) => {
  let orders = await Order.findOne({ user: req.user._id }).populate("orderItems.product");
  res.json({ message: "success", orders });
});

const getAllOrders = catchError(async (req, res, next) => {
  let orders = await Order.find({});
  res.json({ message: "success", orders });
});

const createCheckoutSession = catchError(async (req, res, next) => {
  let cart = await Cart.findById(req.params.id);
  if (!cart) return next(new AppError("Cart not found", 404));

  let totalOrderPrice = cart.totalCartPriceAfterDiscount || cart.totalCartPrice;

  let session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/success`,
    cancel_url: `${req.protocol}://${req.get('host')}/cancel`,
  });

  res.json({ message: "success", session });
});

export { createCashOrder, getUserOrders, getAllOrders, createCheckoutSession };
