import { Request, Response } from "express";

import {
  createStockMovement,
  getStockMovements,
  type StockMovementType,
} from "../services/stock-movement.service.js";

export async function createStockMovementController(
  request: Request,
  response: Response,
) {
  try {
    const { productId, type, quantity, reason } = request.body;

    if (
      !Number.isInteger(productId) ||
      productId <= 0 ||
      !Number.isInteger(quantity) ||
      quantity <= 0 ||
      (type !== "IN" && type !== "OUT") ||
      (reason !== undefined && typeof reason !== "string")
    ) {
      return response.status(400).json({
        message:
          "Informe productId válido, tipo IN ou OUT, quantidade inteira positiva e motivo opcional.",
      });
    }

    const movement = await createStockMovement({
      productId,
      type: type as StockMovementType,
      quantity,
      reason,
    });

    return response.status(201).json(movement);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro interno.";

    if (
      message === "Produto não encontrado." ||
      message === "Estoque insuficiente para realizar a saída." ||
      message === "Não é possível movimentar um produto inativo."
    ) {
      return response.status(400).json({ message });
    }

    console.error(error);

    return response.status(500).json({
      message: "Erro ao registrar movimentação de estoque.",
    });
  }
}

export async function getStockMovementsController(
  request: Request,
  response: Response,
) {
  try {
    const productIdParam = request.query.productId;
    const typeParam = request.query.type;

    let productId: number | undefined;

    if (productIdParam !== undefined) {
      if (
        typeof productIdParam !== "string" ||
        !/^[1-9]\d*$/.test(productIdParam)
      ) {
        return response.status(400).json({
          message: "O filtro productId deve ser um inteiro positivo.",
        });
      }

      productId = Number(productIdParam);
    }

    if (
      typeParam !== undefined &&
      typeParam !== "IN" &&
      typeParam !== "OUT"
    ) {
      return response.status(400).json({
        message: "O filtro type deve ser IN ou OUT.",
      });
    }

    const movements = await getStockMovements({
      productId,
      type: typeParam as StockMovementType | undefined,
    });

    return response.json(movements);
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      message: "Erro ao consultar movimentações de estoque.",
    });
  }
}