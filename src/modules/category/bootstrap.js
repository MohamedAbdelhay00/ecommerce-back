import brandRouter from "../brand/brand.routes.js"
import subCategoryRouter from "../subCategory/subCategory.routes.js"
import productRouter from "./category.routes.js"
import categoryRouter from "./category.routes.js"

export const bootstrap = (app) => {
    app.use('/api/categories', categoryRouter)
    app.use('/api/sub-categories', subCategoryRouter)
    app.use('/api/brands', brandRouter)
    app.use('api/products', productRouter)
}