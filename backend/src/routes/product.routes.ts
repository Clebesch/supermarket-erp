import { Router } from "express";

import {
  createProductController,
  getProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.get("/:id", getProductByIdController);

productRouter.post("/", createProductController);

productRouter.get("/", getProductsController);

productRouter.put("/:id", updateProductController);

productRouter.delete("/:id", deleteProductController);

export default productRouter;