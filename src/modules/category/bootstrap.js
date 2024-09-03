import brandRouter from "../brand/brand.routes.js"
import subCategoryRouter from "../subCategory/subCategory.routes.js"
import productRouter from "../product/product.routes.js"
import categoryRouter from "./category.routes.js"
import userRouter from "../users/user.routes.js"
import authRouter from "../auth/auth.routes.js"

export const bootstrap = (app) => {
    app.use('/api/categories', categoryRouter)
    app.use('/api/sub-categories', subCategoryRouter)
    app.use('/api/brands', brandRouter)
    app.use('/api/products', productRouter)
    app.use('/api/users', userRouter)
    app.use('/api/auth/', authRouter)
}