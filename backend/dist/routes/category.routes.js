"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_js_1 = require("../controllers/category.controller.js");
const categoryRouter = (0, express_1.Router)();
categoryRouter.post("/", category_controller_js_1.createCategoryController);
categoryRouter.get("/", category_controller_js_1.getCategoriesController);
exports.default = categoryRouter;
