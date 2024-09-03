import { AppError } from "../../utils/appError.js";
import { catchError } from "../../middleware/catchError.js";
import { User } from "../../../database/models/user.model.js";
import { deleteOne } from "../handlers/handlers.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

const addUser = catchError(async (req, res, next) => {
  const user = new User(req.body);
  await user.save();
  res.json({ message: "success", user });
});

const allUsers = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(User.find(), req.query)
    .pagination()
    .fields()
    .filter()
    .sort()
    .search();
  const users = await apiFeatures.mongooseQuery;
  res.json({ message: "success", page: apiFeatures.pageNumber, users });
});

const getUser = catchError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  user || next(new AppError("User not found", 404));
  !user || res.json({ message: "success", user });
});

const updateUser = catchError(async (req, res, next) => {
  // Attempt to find the user by ID and update with the request body
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,           // Return the updated user after the update is applied
    runValidators: true, // Ensure the updates adhere to the schema validation rules
  });

  // If the user is not found, return a 404 error
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // If the update is successful, return the updated user data
  res.json({ message: "success", user });
});


const deleteUser = deleteOne(User);

export { addUser, allUsers, getUser, updateUser, deleteUser };
