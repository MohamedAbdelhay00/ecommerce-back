import jwt from "jsonwebtoken";
import { User } from "../../../database/models/user.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';

const signup = catchError(async (req, res, next) => {
  let user = new User(req.body);
  await user.save();
  let token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.json({ message: "success", token });
});

const signin = catchError(async (req, res, next) => {
    let user = await User.findOne({ email: req.body.email });
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
        let token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        return res.json({ message: "success", token });
    }
    return next(new AppError("Invalid email or password", 401));
});

const changePassword = catchError(async (req, res, next) => {
    console.log("req.user:", req.user);

    const user = await User.findById(req.user._id);
    
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
    
    if (!isPasswordCorrect) {
        return next(new AppError("Invalid password", 401));
    }

    const hashedNewPassword = bcrypt.hashSync(req.body.newPassword, 12);

    await User.findByIdAndUpdate(req.user._id, {
        password: hashedNewPassword,
        passwordChangedAt: Date.now()
    });

    const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.json({ message: "success", token });
});



const protectedRoute = catchError(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError("Token not provided", 401));
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token);

    let userPayload;
    try {
        userPayload = jwt.verify(token, process.env.JWT_SECRET);
        console.log('User Payload:', userPayload);
    } catch (err) {
        return next(new AppError("Invalid token", 401));
    }

    const user = await User.findById(userPayload.userId);
    if (!user) {
        return next(new AppError("Unauthorized", 401));
    }

    req.user = user;
    console.log('Protected route user:', req.user);
    
    next();
});




const allowedTo = (...roles) => {
    return catchError((req, res, next) => {
        if(!roles.includes(req.user.role)) return next(new AppError("Unauthorized", 401));
        next();
    });
};

export { signup, signin, changePassword, protectedRoute, allowedTo };