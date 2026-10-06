"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategoryController = createCategoryController;
exports.getCategoriesController = getCategoriesController;
const category_service_js_1 = require("../services/category.service.js");
async function createCategoryController(request, response) {
    try {
        const { name } = request.body;
        if (!name) {
            return response.status(400).json({
                message: "O nome da categoria é obrigatório.",
            });
        }
        const category = await (0, category_service_js_1.createCategory)(name);
        return response.status(201).json(category);
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({
            message: "Erro ao criar categoria.",
        });
    }
}
async function getCategoriesController(request, response) {
    try {
        const categories = await (0, category_service_js_1.getCategories)();
        return response.json(categories);
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({
            message: "Erro ao buscar categorias.",
        });
    }
}
