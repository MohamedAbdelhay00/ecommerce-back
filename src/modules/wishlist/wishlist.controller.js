import { AppError } from "../../utils/appError.js";
import { catchError } from "../../middleware/catchError.js";
import { User } from "../../../database/models/user.model.js";

const addToWishlist = catchError(async (req, res, next) => {
  const wishlist = await User.findByIdAndUpdate(
    req.user._id, 
    { $addToSet: { wishlist: req.body.product } },
    { new: true }
  );

  if (!wishlist) {
    return next(new AppError("User not found", 404));
  }

  res.json({ message: "success", wishlist: wishlist.wishlist });
});

const removeFromWishlist = catchError(async (req, res, next) => {
  const wishlist = await User.findByIdAndUpdate(
    req.user._id, 
    { $pull: { wishlist: req.params.id } }, 
    { new: true }
  );

  if (!wishlist) {
    return next(new AppError("User not found", 404));
  }

  res.json({ message: "success", wishlist: wishlist.wishlist });
});

const gotLoggedUserWishlist = catchError(async (req, res, next) => {
  const wishlist = await User.findById(req.user._id).populate('wishlist');

  if (!wishlist) {
    return next(new AppError("User not found", 404));
  }

  res.json({ message: "success", wishlist: wishlist.wishlist });
});

export {
  addToWishlist,
  removeFromWishlist,
  gotLoggedUserWishlist
};
