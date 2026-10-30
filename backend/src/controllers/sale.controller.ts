import { Request, Response, NextFunction } from "express";

import {
  createSale,
  getSales,
  getSaleById,
  SaleServiceError,
} from "../services/sale.service.js";

// Registra uma nova venda.
export async function createSaleController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const sale = await createSale(request.body);

    return response.status(201).json(sale);
  } catch (error) {
    if (error instanceof SaleServiceError) {
      return response.status(error.statusCode).json({
        message: error.message,
      });
    }

    return next(error);
  }
}

// Lista todas as vendas.
export async function getSalesController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const sales = await getSales();

    return response.json(sales);
  } catch (error) {
    return next(error);
  }
}

// Busca uma venda pelo ID.
export async function getSaleByIdController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const idParam = request.params.id;

    if (
      typeof idParam !== "string" ||
      !/^[1-9]\d*$/.test(idParam)
  ) {
    return response.status(400).json({
      message: "O ID da venda deve ser um inteiro positivo.",
    });
  }

    const id = Number(idParam);

    if (!Number.isSafeInteger(id)) {
      return response.status(400).json({
        message: "O ID da venda é inválido.",
      });
    }

    const sale = await getSaleById(id);

    if (!sale) {
      return response.status(404).json({
        message: "Venda não encontrada.",
      });
    }

    return response.json(sale);
  } catch (error) {
    return next(error);
  }
}