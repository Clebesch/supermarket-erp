import { Router } from "express";

import {
  createSaleController,
  getSalesController,
  getSaleByIdController,
} from "../controllers/sale.controller.js";

import { createSaleSchema } from "../schemas/sale.schema.js";
import { validate } from "../middlewares/validate.js";

const saleRouter = Router();

// Registra uma venda.
saleRouter.post(
  "/",
  validate(createSaleSchema),
  createSaleController,
);

// Lista as vendas.
saleRouter.get("/", getSalesController);

// Consulta uma venda pelo ID.
saleRouter.get("/:id", getSaleByIdController);

export default saleRouter;