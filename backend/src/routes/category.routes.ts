import { Router } from "express";

import {
  createCategoryController,
  getCategoriesController,
} from "../controllers/category.controller.js";


const categoryRouter = Router();

categoryRouter.post("/", createCategoryController);

categoryRouter.get("/", getCategoriesController);

export default categoryRouter;