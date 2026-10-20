import express from "express";
import healthRouter from "./routes/health.routes.js";
import categoryRouter from "./routes/category.routes.js";
import productRouter from "./routes/product.routes.js";
import { errorHandler } from "./middlewares/error-handler.js";
import stockMovementRouter from "./routes/stock-movement.routes.js";
import customerRouter from "./routes/customer.routes.js";
import supplierRouter from "./routes/supplier.routes.js";
import purchaseRouter from "./routes/purchase.routes.js";

const app = express();

const PORT = 3000;

app.use(express.json());

// Rota principal.
app.get("/", (request, response) => {
  response.json({
    message: "SuperMarket ERP API",
    status: "online",
  });
});

// Health check da API.
app.use("/api/health", healthRouter);

app.use("/api/categories", categoryRouter);

app.use("/api/products", productRouter);

app.use("/api/stock-movements", stockMovementRouter);

app.use("/api/customers", customerRouter);

app.use("/api/suppliers", supplierRouter);

app.use("/api/purchases", purchaseRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado em http://localhost:${PORT}`);
});