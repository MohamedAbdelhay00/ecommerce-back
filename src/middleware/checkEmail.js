import { User } from "../../database/models/user.model.js";
import bcrypt from "bcrypt";

export const checkEmaill = async (req, res, next) => {
  let isExsit = await User.findOne({ email: req.body.email });
  if (isExsit) {
    return res.status(409).json({ message: "Email already exist" });
  }
  req.body.password = await bcrypt.hash(req.body.password, 10);
  next();
};
