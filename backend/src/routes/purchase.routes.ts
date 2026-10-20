import { Router } from "express";

import {
  createPurchaseController,
  getPurchasesController,
  getPurchaseByIdController,
  receivePurchaseController,
} from "../controllers/purchase.controller.js";

import { createPurchaseSchema } from "../schemas/purchase.schema.js";

import { validate } from "../middlewares/validate.js";

const purchaseRouter = Router();

purchaseRouter.post(
  "/",
  validate(createPurchaseSchema),
  createPurchaseController,
);

purchaseRouter.get("/", getPurchasesController);

purchaseRouter.post(
  "/:id/receive",
  receivePurchaseController,
);

purchaseRouter.get("/:id", getPurchaseByIdController);

purchaseRouter.get("/:id", getPurchaseByIdController);

export default purchaseRouter;
