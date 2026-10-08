import { Request, Response } from "express";
import {
  createCategory,
  getCategories,
} from "../services/category.service.js";

export async function createCategoryController(
  request: Request,
  response: Response,
) {
  try {
    const { name } = request.body;
	
	if (!name || typeof name !== "string" || !name.trim()) {
      return response.status(400).json({
    message: "O nome da categoria é obrigatório.",
  });
}

    const category = await createCategory(name.trim());

    return response.status(201).json(category);
  } catch (error: any) {
    console.error(error);

    if (error?.code === "P2002") {
      return response.status(409).json({
		message: "Já existe uma categoria com este nome.",
      });
}

    return response.status(500).json({
      message: "Erro ao criar categoria.",
    });
  }
}

export async function getCategoriesController(
  request: Request,
  response: Response,
) {
  try {
    const categories = await getCategories();

    return response.json(categories);
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      message: "Erro ao buscar categorias.",
    });
  }
}