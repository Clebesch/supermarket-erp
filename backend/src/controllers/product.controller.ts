import { Request, Response } from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../services/product.service.js";

export async function createProductController(
  request: Request,
  response: Response,
) {
  try {
    const {
      name,
      barcode,
      description,
      costPrice,
      salePrice,
      stock,
      minStock,
      categoryId,
    } = request.body;

    if (
      !name ||
      !barcode ||
      costPrice === undefined ||
      salePrice === undefined ||
      categoryId === undefined
    ) {
      return response.status(400).json({
        message:
          "Nome, código de barras, preços e categoria são obrigatórios.",
      });
    }

    const product = await createProduct({
      name,
      barcode,
      description,
      costPrice: Number(costPrice),
      salePrice: Number(salePrice),
      stock: stock !== undefined ? Number(stock) : undefined,
      minStock: minStock !== undefined ? Number(minStock) : undefined,
      categoryId: Number(categoryId),
    });

    return response.status(201).json(product);
  } catch (error) {
	   throw error;
  }
}

export async function getProductsController(
  request: Request,
  response: Response,
) {
  try {
    const products = await getProducts();

    return response.json(products);
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      message: "Erro ao buscar produtos.",
    });
  }
}

export async function getProductByIdController(
  request: Request,
  response: Response,
) {
  try {
    const id = Number(request.params.id);

    if (Number.isNaN(id)) {
      return response.status(400).json({
        message: "ID do produto inválido.",
      });
    }

    const product = await getProductById(id);

    if (!product) {
      return response.status(404).json({
        message: "Produto não encontrado.",
      });
    }

    return response.json(product);
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      message: "Erro ao buscar produto.",
    });
  }
}

export async function updateProductController(
  request: Request,
  response: Response,
) {
  try {
    const id = Number(request.params.id);

    if (Number.isNaN(id)) {
      return response.status(400).json({
        message: "ID do produto inválido.",
      });
    }

    const productExists = await getProductById(id);

    if (!productExists) {
      return response.status(404).json({
        message: "Produto não encontrado.",
      });
    }

    const {
      name,
      barcode,
      description,
      costPrice,
      salePrice,
      stock,
      minStock,
      active,
      categoryId,
    } = request.body;

    const product = await updateProduct(id, {
      name,
      barcode,
      description,
      costPrice:
        costPrice !== undefined ? Number(costPrice) : undefined,
      salePrice:
        salePrice !== undefined ? Number(salePrice) : undefined,
      stock: stock !== undefined ? Number(stock) : undefined,
      minStock: minStock !== undefined ? Number(minStock) : undefined,
      active,
      categoryId:
        categoryId !== undefined ? Number(categoryId) : undefined,
    });

    return response.json(product);
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      message: "Erro ao atualizar produto.",
    });
  }
}

export async function deleteProductController(
  request: Request,
  response: Response,
) {
  try {
    const id = Number(request.params.id);

    if (Number.isNaN(id)) {
      return response.status(400).json({
        message: "ID do produto inválido.",
      });
    }

    const productExists = await getProductById(id);

    if (!productExists) {
      return response.status(404).json({
        message: "Produto não encontrado.",
      });
    }

    await deleteProduct(id);

    return response.status(204).send();
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      message: "Erro ao excluir produto.",
    });
  }
}