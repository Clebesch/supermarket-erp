import { Router } from "express";

import {
  createStockMovementController,
  getStockMovementsController,
} from "../controllers/stock-movement.controller.js";

import { createStockMovementSchema } from "../schemas/stock-movement.schema.js";
import { validate } from "../middlewares/validate.js";

const stockMovementRouter = Router();

stockMovementRouter.get(
  "/",
  getStockMovementsController,
);

stockMovementRouter.post(
  "/",
  validate(createStockMovementSchema),
  createStockMovementController,
);

export default stockMovementRouter;