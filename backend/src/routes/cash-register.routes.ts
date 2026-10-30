
import { Router } from "express";

import {
  openCashRegisterController,
  getCashRegistersController,
  getCashRegisterByIdController,
  closeCashRegisterController,
  getCashRegisterReportController,
} from "../controllers/cash-register.controller.js";

import {
  openCashRegisterSchema,
  closeCashRegisterSchema,
} from "../schemas/cash-register.schema.js";

import { validate } from "../middlewares/validate.js";

const cashRegisterRouter = Router();

// Abrir um caixa.
cashRegisterRouter.post(
  "/",
  validate(openCashRegisterSchema),
  openCashRegisterController,
);

// Listar os caixas.
cashRegisterRouter.get("/", getCashRegistersController);

cashRegisterRouter.get(
  "/:id/report",
  getCashRegisterReportController,
);

// Consultar um caixa pelo ID.
cashRegisterRouter.get("/:id", getCashRegisterByIdController);

// Fechar um caixa.
cashRegisterRouter.post(
  "/:id/close",
  validate(closeCashRegisterSchema),
  closeCashRegisterController,
);

export default cashRegisterRouter;
