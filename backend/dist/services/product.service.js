"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = createProduct;
exports.getProducts = getProducts;
exports.getProductById = getProductById;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
async function createProduct(data) {
    return prisma_js_1.default.product.create({
        data: {
            name: data.name,
            barcode: data.barcode,
            description: data.description,
            costPrice: data.costPrice,
            salePrice: data.salePrice,
            stock: data.stock ?? 0,
            minStock: data.minStock ?? 0,
            categoryId: data.categoryId,
        },
        include: {
            category: true,
        },
    });
}
async function getProducts() {
    return prisma_js_1.default.product.findMany({
        include: {
            category: true,
        },
        orderBy: {
            name: "asc",
        },
    });
}
async function getProductById(id) {
    return prisma_js_1.default.product.findUnique({
        where: {
            id,
        },
        include: {
            category: true,
        },
    });
}
async function updateProduct(id, data) {
    return prisma_js_1.default.product.update({
        where: {
            id,
        },
        data,
        include: {
            category: true,
        },
    });
}
async function deleteProduct(id) {
    return prisma_js_1.default.product.delete({
        where: {
            id,
        },
    });
}
