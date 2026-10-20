import { Router } from "express";

import {
  createSupplierController,
  getSuppliersController,
  getSupplierByIdController,
  updateSupplierController,
  deleteSupplierController,
} from "../controllers/supplier.controller.js";

import {
  createSupplierSchema,
  updateSupplierSchema,
} from "../schemas/supplier.schema.js";

import { validate } from "../middlewares/validate.js";

const supplierRouter = Router();

supplierRouter.post(
  "/",
  validate(createSupplierSchema),
  createSupplierController,
);

supplierRouter.get("/", getSuppliersController);

supplierRouter.get("/:id", getSupplierByIdController);

supplierRouter.put(
  "/:id",
  validate(updateSupplierSchema),
  updateSupplierController,
);

supplierRouter.delete("/:id", deleteSupplierController);

export default supplierRouter;