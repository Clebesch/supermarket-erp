"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductController = createProductController;
exports.getProductsController = getProductsController;
exports.getProductByIdController = getProductByIdController;
exports.updateProductController = updateProductController;
exports.deleteProductController = deleteProductController;
const product_service_js_1 = require("../services/product.service.js");
async function createProductController(request, response) {
    try {
        const { name, barcode, description, costPrice, salePrice, stock, minStock, categoryId, } = request.body;
        if (!name ||
            !barcode ||
            costPrice === undefined ||
            salePrice === undefined ||
            categoryId === undefined) {
            return response.status(400).json({
                message: "Nome, código de barras, preços e categoria são obrigatórios.",
            });
        }
        const product = await (0, product_service_js_1.createProduct)({
            name,
            barcode,
            description,
            costPrice: Number(costPrice),
            salePrice: Number(salePrice),
            stock: stock !== undefined ? Number(stock) : undefined,
            minStock: minStock !== undefined ? Number(minStock) : undefined,
            categoryId: Number(categoryId),
        });
        return response.status(201).json(product);
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({
            message: "Erro ao criar produto.",
        });
    }
}
async function getProductsController(request, response) {
    try {
        const products = await (0, product_service_js_1.getProducts)();
        return response.json(products);
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({
            message: "Erro ao buscar produtos.",
        });
    }
}
async function getProductByIdController(request, response) {
    try {
        const id = Number(request.params.id);
        if (Number.isNaN(id)) {
            return response.status(400).json({
                message: "ID do produto inválido.",
            });
        }
        const product = await (0, product_service_js_1.getProductById)(id);
        if (!product) {
            return response.status(404).json({
                message: "Produto não encontrado.",
            });
        }
        return response.json(product);
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({
            message: "Erro ao buscar produto.",
        });
    }
}
async function updateProductController(request, response) {
    try {
        const id = Number(request.params.id);
        if (Number.isNaN(id)) {
            return response.status(400).json({
                message: "ID do produto inválido.",
            });
        }
        const productExists = await (0, product_service_js_1.getProductById)(id);
        if (!productExists) {
            return response.status(404).json({
                message: "Produto não encontrado.",
            });
        }
        const { name, barcode, description, costPrice, salePrice, stock, minStock, active, categoryId, } = request.body;
        const product = await (0, product_service_js_1.updateProduct)(id, {
            name,
            barcode,
            description,
            costPrice: costPrice !== undefined ? Number(costPrice) : undefined,
            salePrice: salePrice !== undefined ? Number(salePrice) : undefined,
            stock: stock !== undefined ? Number(stock) : undefined,
            minStock: minStock !== undefined ? Number(minStock) : undefined,
            active,
            categoryId: categoryId !== undefined ? Number(categoryId) : undefined,
        });
        return response.json(product);
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({
            message: "Erro ao atualizar produto.",
        });
    }
}
async function deleteProductController(request, response) {
    try {
        const id = Number(request.params.id);
        if (Number.isNaN(id)) {
            return response.status(400).json({
                message: "ID do produto inválido.",
            });
        }
        const productExists = await (0, product_service_js_1.getProductById)(id);
        if (!productExists) {
            return response.status(404).json({
                message: "Produto não encontrado.",
            });
        }
        await (0, product_service_js_1.deleteProduct)(id);
        return response.status(204).send();
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({
            message: "Erro ao excluir produto.",
        });
    }
}
