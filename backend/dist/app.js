"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const health_routes_js_1 = __importDefault(require("./routes/health.routes.js"));
const category_routes_js_1 = __importDefault(require("./routes/category.routes.js"));
const product_routes_js_1 = __importDefault(require("./routes/product.routes.js"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.get("/", (request, response) => {
    response.json({
        message: "SuperMarket ERP API",
        status: "online",
    });
});
app.use("/api/health", health_routes_js_1.default);
app.use("/api/categories", category_routes_js_1.default);
app.use("/api/products", product_routes_js_1.default);
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
