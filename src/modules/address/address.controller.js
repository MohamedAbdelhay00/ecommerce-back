import { AppError } from "../../utils/appError.js"
import { catchError } from "../../middleware/catchError.js";
import { User } from "../../../database/models/user.model.js";

const addToAddress = catchError(async (req, res, next) => {
  let address = await User.findByIdAndUpdate(req.user._id, { $push: { address: req.body } }, { new: true });
  address || next(new AppError("User not found", 404));
  !address || res.json({ message: "success", address: address.address });
});

const removeAddress = catchError(async (req, res, next) => {
  let user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { address: { _id: req.params.id } } },
    { new: true }
  );

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.json({ message: "success", address: user.address });
});


const gotLoggedUserAddress = catchError(async (req, res, next) => {
  let address = await User.findById(req.user._id)
  address || next(new AppError("User not found", 404));
  !address || res.json({ message: "success", address: address.address });
});

export {
  addToAddress,
  removeAddress,
  gotLoggedUserAddress
}
