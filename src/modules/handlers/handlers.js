import { catchError } from "../../middleware/catchError.js";

export const deleteOne = (model) => {
    return catchError(async (req, res, next) => {
        const document = await model.findByIdAndDelete(req.params.id);
        document || next(new AppError("document not found", 404));
        !document || res.json({ message: "success", document });
      });
}