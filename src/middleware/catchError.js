import { AppError } from "../utils/appError.js";

export const catchError = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(err => {
            next(new AppError(err, 500));
        });
    };
};
