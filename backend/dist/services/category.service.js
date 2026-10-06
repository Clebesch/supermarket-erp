"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = createCategory;
exports.getCategories = getCategories;
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
async function createCategory(name) {
    return prisma_js_1.default.category.create({
        data: {
            name,
        },
    });
}
async function getCategories() {
    return prisma_js_1.default.category.findMany({
        orderBy: {
            name: "asc",
        },
    });
}
