import { Router } from "express";

import {
  createCustomerController,
  getCustomersController,
  getCustomerByIdController,
  updateCustomerController,
  deleteCustomerController,
} from "../controllers/customer.controller.js";

import {
  createCustomerSchema,
  updateCustomerSchema,
} from "../schemas/customer.schema.js";

import { validate } from "../middlewares/validate.js";

const customerRouter = Router();

customerRouter.post(
  "/",
  validate(createCustomerSchema),
  createCustomerController,
);

customerRouter.get(
  "/",
  getCustomersController,
);

customerRouter.get(
  "/:id",
  getCustomerByIdController,
);

customerRouter.put(
  "/:id",
  validate(updateCustomerSchema),
  updateCustomerController,
);

customerRouter.delete(
  "/:id",
  deleteCustomerController,
);

export default customerRouter;