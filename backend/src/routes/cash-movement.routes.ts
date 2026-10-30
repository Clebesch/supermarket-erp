
import { Router } from "express";

import {
  createCashMovementController,
  getCashMovementsController,
} from "../controllers/cash-movement.controller.js";

import { createCashMovementSchema } from "../schemas/cash-movement.schema.js";
import { validate } from "../middlewares/validate.js";

const cashMovementRouter = Router({ mergeParams: true });

// Registrar entrada ou saída de dinheiro.
cashMovementRouter.post(
  "/",
  validate(createCashMovementSchema),
  createCashMovementController,
);

// Consultar o histórico do caixa.
cashMovementRouter.get("/", getCashMovementsController);

export default cashMovementRouter;
