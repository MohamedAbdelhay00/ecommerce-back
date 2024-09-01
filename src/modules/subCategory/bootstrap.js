import subCategoryRouter from "./subCategory.routes.js"

export const bootstrap = (app) => {
    app.use('/api/sub-categories', subCategoryRouter)
}