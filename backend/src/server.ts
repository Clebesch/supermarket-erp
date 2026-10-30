import express from "express";
import healthRouter from "./routes/health.routes.js";
import categoryRouter from "./routes/category.routes.js";
import productRouter from "./routes/product.routes.js";
import { errorHandler } from "./middlewares/error-handler.js";
import stockMovementRouter from "./routes/stock-movement.routes.js";
import customerRouter from "./routes/customer.routes.js";
import supplierRouter from "./routes/supplier.routes.js";
import purchaseRouter from "./routes/purchase.routes.js";
import saleRouter from "./routes/sale.routes.js";
import cashRegisterRouter from "./routes/cash-register.routes.js";
import cashMovementRouter from "./routes/cash-movement.routes.js";
import cors from "cors";

const app = express();

const PORT = 3000;

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

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

app.use("/api/sales", saleRouter);

app.use("/api/cash-registers", cashRegisterRouter);

app.use("/api/cash-registers/:id/movements", cashMovementRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado em http://localhost:${PORT}`);
});