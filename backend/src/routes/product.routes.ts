import { Router } from "express";

import {
  createProductController,
  getProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} from "../controllers/product.controller.js";

import {
  createProductSchema,
  updateProductSchema,
} from "../schemas/product.schema.js";

import { validate } from "../middlewares/validate.js";

const productRouter = Router();

productRouter.post(
  "/",
  validate(createProductSchema),
  createProductController,
);

productRouter.get("/", getProductsController);

productRouter.get("/:id", getProductByIdController);

productRouter.put(
  "/:id",
  validate(updateProductSchema),
  updateProductController,
);

productRouter.delete("/:id", deleteProductController);

export default productRouter;